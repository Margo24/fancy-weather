import ControlBlock from './header.js';
import weatherBlock from './weatherBlock.js';
import threeDaysWeatherBlock from './threeDaysBlock.js';
import mapBlock from './mapBlock.js';

const controls = new ControlBlock();
const weather = new weatherBlock();
const threeDaysWeather = new threeDaysWeatherBlock();
const geolocationBlock = new mapBlock();

const daysOfWeek = {
    0: ["Sunday", "Воскресенье", "Нядзеля"],
    1: ["Monday", "Понедельник", "Панядзелак"],
    2: ["Tuesday", "Вторник", "Аўторак"],
    3: ["Wednesday", "Среда", "Серада"],
    4: ["Thursday", "Четверг", "Чацвер"],
    5: ["Friday", "Пятница", "Пятніца"],
    6: ["Saturday", "Суббота", "Субота"]
};

const monthes = {
    0: ["January", "Январь", "Студзень"],
    1: ["February", "Февраль", "Люты"],
    2: ["March", "Март", "Сакавiк"],
    3: ["April", "Апрель", "Красавiк"],
    4: ["May", "Май", "Май"],
    5: ["June", "Июнь", "Червень"],
    6: ["July", "Июль", "Лiпень"],
    7: ["August", "Август", "Жнiвень"],
    8: ["September", "Сентябрь", "Верасень"],
    9: ["October", "Октябрь", "Кастрычнiк"],
    10: ["November", "Ноябрь", "Лiстапад"],
    11: ["December", "Декабрь", "Снежань"],
};

const weatherParametersTranslate = {
    0: ["", "Feels like:", "Wind:", "Humidity:"],
    1: ["", "Ощущается:", "Ветер:", "Влажность:"],
    2: ["", "Адчуваецца:", "Вецер:", "Вільготнасць:"]
};

const backgroundImageData = {
    'season': '',
    'daytime': '',
    'weather': ''
};

const languageNum = { 'en': 0, 'ru': 1, 'be': 2};

const coordsTranslate = {
    0: ["Latitude:", "Longitude:"],
    1: ["Широта:", "Долгота:"],
    2: ["Шырата:", "Даўгата:"]
};

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

localStorage.clear();

window.addEventListener('load',function () {
    localStorage.setItem('temperatureScale', 'Celsius');
    localStorage.setItem('language', 'en');
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");

    const fragment = document.createDocumentFragment();
    fragment.appendChild(controls.init());
    fragment.appendChild(weather.init());
    fragment.appendChild(geolocationBlock.init());

    wrapper.appendChild(fragment);
    document.body.appendChild(wrapper);

    //add block 3 into block 2
    const weatherBlock = document.getElementsByClassName('weather-container')[0];
    const weatherFragment = document.createDocumentFragment();
    weatherFragment.appendChild(threeDaysWeather.init());
    weatherBlock.appendChild(weatherFragment);

    getCoords();
    showTime();
    navigator.geolocation.getCurrentPosition(success, error, options);
    changeBackground();
    temperatureSwitch();
    translate();
});

function showTime() {
    const choosenLanguage = localStorage.getItem('language');
    const languageId = languageNum[choosenLanguage];
    const isTimezoned = localStorage.getItem('timezone') !== null;
    const date = new Date();
    let day = date.getDate();
    let month;
    let dayOfWeek;
    let hour;
    let dayOffset;
    if (isTimezoned) {
        const localeDate = date.toLocaleString('en-US',{timeZone:localStorage.getItem('timezone')});
        const timeOfDay12Hours = localeDate.slice(-2);
        const localeHour = localeDate.substring(localeDate.indexOf(',') + 1, localeDate.indexOf(':')).trim();
        const localeMonth = localeDate.split('/')[0];
        const localeDay = localeDate.split('/')[1];
        dayOffset = localeDay - day;
        dayOfWeek = dayOffset ? (date.getDay() + dayOffset)%7:date.getDay();
        hour = timeOfDay12Hours === "AM" ? localeHour:Number(localeHour) + 12;
        day = localeDay;
        month = localeMonth - 1;
    } else {
        hour = date.getHours();
        day = date.getDate();
        month = date.getMonth();
        dayOfWeek = date.getDay();
    }
    const minutes = date.getMinutes();
    const minutesVisual = minutes.toString().length >1 ? minutes.toString():"0" + minutes;
    const currentData = `${daysOfWeek[dayOfWeek][languageId]} ${day} ${monthes[month][languageId]} ${hour}:${minutesVisual}`;
    document.getElementsByClassName("date")[0].innerText = currentData;

    const treeDays = document.getElementsByClassName("day-of-week");

    if (treeDays[0].innerText.toLowerCase() == "day" ||
        hour === 0 || dayOffset !== 0 ||
        treeDays[0].innerText != daysOfWeek[(dayOfWeek+1)%7][languageId]) {
        for (let i=1; i<=treeDays.length; i++) {
            treeDays[i - 1].innerText = `${daysOfWeek[(dayOfWeek + i)%7][languageId]}`
        }
    }

    getSeasonAndDaytime(month, hour);
    setTimeout(showTime, 10000) // refresh time every 10 seconds
}

function success(pos) {
    const crd = pos.coords;
    apiData(crd);
};

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
};

function apiData(crd) {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFyZ28yNCIsImEiOiJjazQ0bWt3bjUwMGF6M2xudm5oY3BudDZmIn0.EpvRM5GAZ_XeH0ueG6wijw';

    const map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
        center: [crd.longitude, crd.latitude], // starting position [lng, lat]
        zoom: 14 // starting zoom
    });

    const marker = new mapboxgl.Marker()
        .setLngLat([crd.longitude, crd.latitude])
        .addTo(map);

    const choosenLanguage = localStorage.getItem('language');
    const languageId = languageNum[choosenLanguage];

    const coordsChildren = document.getElementsByClassName("coords-container")[0].childNodes;
    coordsChildren[0].innerText = `${coordsTranslate[languageId][0]} ${crd.latitude.toFixed(2)}`;
    coordsChildren[1].innerText = `${coordsTranslate[languageId][1]} ${crd.longitude.toFixed(2)}`;

    //country and city
    const location = document.getElementsByTagName("h1")[0];

    const opencagedataApi = 'https://api.opencagedata.com/'  +
        `geocode/v1/json?q=${crd.latitude}%2C%20${crd.longitude}&` +
        `key=afc6231b627b4924b6d7a3c0fb8b4d83&language=${choosenLanguage}&pretty=1&no_annotations=1`;

    fetch (opencagedataApi)
        .then(responce => {
            return responce.json();
        })
        .then(data =>{
            const localityCity = data.results[0].components.city;
            const localityTown = data.results[0].components.town;
            const locality = localityCity ? localityCity.toUpperCase():localityTown.toUpperCase();
            const country = data.results[0].components.country.toUpperCase();
            location.innerText = `${locality}, ${country}`;
        })
        .catch(err => console.log());

    //weather
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const apiDarkSky = `${proxy}https://api.darksky.net/forecast/` +
        `d3ef86176621ae3421e203a6de9c088e/${crd.latitude},${crd.longitude}?lang=${choosenLanguage}`;

    fetch(apiDarkSky)
        .then(responce => {
            return responce.json();
        })
        .then(data =>{
            currentWeather(data.currently);
            futureWeather(data.daily.data);
        })
        .catch(err => console.log());

    backgroundImageQuery();
}

function futureWeather(dataArray) {
    const futureWeatherItems = document.getElementsByClassName("future-weather");
    Array.prototype.forEach.call(futureWeatherItems, (child, index) => {
        tempAndIcon(child, dataArray, index);
    });
}

function tempAndIcon(item, dataArray, index) {
    let tempPath;
    let iconPath;
    if (dataArray.hasOwnProperty("temperature")) {
        tempPath = Number(dataArray.temperature).toFixed(1);
        localStorage.setItem('currentTempF', tempPath);
        iconPath = dataArray.icon;
    } else {
        tempPath = Number(dataArray[index+1].temperatureHigh).toFixed(1);
        iconPath = dataArray[index+1].icon;
    }
    localStorage.setItem(`${index+1}thTempF`, tempPath);

    const isCelsius = localStorage.getItem('temperatureScale') === 'Celsius';
    const tempValue = isCelsius ? fahrenheitToCelsius (tempPath):tempPath;
    item.childNodes[0].innerHTML = `${tempValue}&#176`;
    item.childNodes[1].src = `assets/weather-icons/${iconPath}.png`
}

function currentWeather(dataArray) {
    const choosenLanguage = localStorage.getItem('language');
    const languageId = languageNum[choosenLanguage];

    const currentTemperature = document.getElementsByClassName("current-temperature")[0];
    const weatherList = document.getElementsByClassName("weather-list")[0].childNodes;

    const currWeatherArray = (dataArray.summary).split(' ');
    backgroundImageData['weather'] = currWeatherArray[currWeatherArray.length - 1];

    localStorage.setItem('feelsLikeTempF', Number(dataArray.apparentTemperature).toFixed(1));
    const celsiusFeelsLike = fahrenheitToCelsius(dataArray.apparentTemperature);
    const weatherSummary = dataArray.summary[0] + dataArray.summary.substring(1).toLowerCase();
    const dataArrayNeededValues = [weatherSummary, celsiusFeelsLike, dataArray.windSpeed, dataArray.humidity];
    const weatherParameters = weatherParametersTranslate[languageId];

    tempAndIcon(currentTemperature, dataArray);
    //add weather parameters to list(summary, feels like, etc.)
    Array.prototype.forEach.call(weatherList, (child, index) => {
        if (index === 1) {
            child.innerHTML = `${weatherParameters[1]} ${dataArrayNeededValues[1]}&#176`;
        } else {
            child.innerText = `${weatherParameters[index]} ${dataArrayNeededValues[index]}`;
        }
    });
}

function fahrenheitToCelsius (value) {
    return ((value - 32 ) / 1.8).toFixed(1);
}

function getCoords() {
    const searchContainer = document.getElementsByClassName("search-container")[0];
    const input = searchContainer.childNodes[0];
    const search = searchContainer.childNodes[1];

    search.addEventListener("click", () => {
        const city = input.value;
        if (city === "") {
            alert("Enter city");
        } else {
            searchWeatherLocality(city);
        }
    })
}

function searchWeatherLocality(city) {
    const choosenLanguage = localStorage.getItem('language');
    const opencagedataApi = `https://api.opencagedata.com/geocode/v1/` +
        `json?q=${city}&key=afc6231b627b4924b6d7a3c0fb8b4d83&language=${choosenLanguage}&pretty=1`; //ru, be, en

    fetch(opencagedataApi)
        .then(responce => {
            return responce.json();
        })
        .then(data =>{
            const timezone = data.results[0].annotations.timezone.name;
            localStorage.setItem('timezone', timezone);
            const crd = {latitude: data.results[0].geometry.lat, longitude: data.results[0].geometry.lng};
            apiData(crd);
        })
        .catch(err => console.log())
}

function changeBackground() {
    const changeButton = document.getElementsByClassName("refresh-button")[0];
    const spinnedImage = changeButton.childNodes[0];

    changeButton.addEventListener("click", () => {
        spinnedImage.classList.add('spin-animation');
        //changing background image
        backgroundImageQuery();
    });

    spinnedImage.addEventListener('animationend', function() {
        this.classList.remove('spin-animation');
    });
}

function backgroundImageQuery() {
    const wrapper = document.getElementsByClassName("wrapper")[0];

    const unsplashApi = `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1` +
        `&query=nature,${backgroundImageData['season']},${backgroundImageData['daytime']},` +
        `${backgroundImageData['weather'].toLowerCase()}&client_id=65ab65689c6c62de0ccaea4be7b43777daa7664f8738b406583fc91f8317ca54`;

    fetch(unsplashApi)
        .then(responce => {
            return responce.json();
        })
        .then(data =>{
            wrapper.style.backgroundImage = `url('${data.urls.regular}')`;
        })
        .catch(err => console.log())
}

function temperatureSwitch() {
    const temperatureButtonContainer = document.getElementsByClassName("temperature-container")[0];
    const fahrenheitButton = temperatureButtonContainer.childNodes[0];
    const celsiusButton = temperatureButtonContainer.childNodes[1];

    const futureTemperatureItems = document.getElementsByClassName('future-temperature');
    const currentTemperature = document.getElementsByClassName('current-temperature')[0].childNodes[0];
    const feelsLike = document.getElementsByClassName('weather-list')[0].childNodes[1];

    fahrenheitButton.addEventListener('click', function () {
        this.classList.add('active');
        celsiusButton.classList.remove('active');

        localStorage.setItem('temperatureScale', 'Fahrenheit');

        const choosenLanguage = localStorage.getItem('language');
        const languageId = languageNum[choosenLanguage];
        const weatherParameters = weatherParametersTranslate[languageId];
        
        currentTemperature.innerHTML = `${localStorage.getItem('currentTempF')}&#176`;
        feelsLike.innerHTML = `${weatherParameters[1]} ${localStorage.getItem('feelsLikeTempF')}&#176`;

        Array.prototype.forEach.call(futureTemperatureItems, (child, index) => {
            const localTempValue = localStorage.getItem(`${index+1}thTempF`);
            child.innerHTML= `${localTempValue}&#176`;
        });
    });

    celsiusButton.addEventListener('click', function () {
        this.classList.add('active');
        fahrenheitButton.classList.remove('active');

        localStorage.setItem('temperatureScale', 'Celsius');

        const choosenLanguage = localStorage.getItem('language');
        const languageId = languageNum[choosenLanguage];
        const weatherParameters = weatherParametersTranslate[languageId];

        currentTemperature.innerHTML = `${fahrenheitToCelsius(localStorage.getItem('currentTempF'))}&#176`;
        feelsLike.innerHTML = `${weatherParameters[1]} ${fahrenheitToCelsius(localStorage.getItem('feelsLikeTempF'))}&#176`;

        Array.prototype.forEach.call(futureTemperatureItems, (child, index) => {
            const localTempValue = fahrenheitToCelsius(localStorage.getItem(`${index+1}thTempF`));
            child.innerHTML= `${localTempValue}&#176`;
        });
    })
}

function getSeasonAndDaytime(month, hour) {
    switch (month) {
        case 0:
        case 1:
        case 11:
            backgroundImageData['season'] = 'winter';
            break;

        case 2:
        case 3:
        case 4:
            backgroundImageData['season'] = 'spring';
            break;

        case 5:
        case 6:
        case 7:
            backgroundImageData['season'] = 'summer';
            break;

        case 8:
        case 9:
        case 10:
            backgroundImageData['season'] = 'autumn';
            break;

        default:
            backgroundImageData['season'] = 'summer';
            break;
    }

    switch (true) {
        case (hour >= 6 && hour<=11):
            backgroundImageData['daytime'] = "morning";
            break;

        case (hour > 11 && hour<=17):
            backgroundImageData['daytime'] = "afternoon";
            break;

        case (hour > 17 && hour<=23):
            backgroundImageData['daytime'] = "evening";
            break;

        default:
            backgroundImageData['daytime'] = "night";
            break;
    }
}

function translate() {
    //still under development
    const dropdownButton = document.getElementsByClassName("dropdown-button")[0];
    const languageList = document.getElementsByClassName("language-list")[0];
    const searchContainer = document.getElementsByClassName("search-container")[0];

    const placeholderValues = ["Search city", "Искать город", "Шукаць горад"];
    const submitButtonValues = ["Search", "Поиск", "Пошук"];

    dropdownButton.addEventListener('click', function () {
        languageList.style.display = 'block';
        languageList.classList.add('go-down-animation');
    });

    languageList.addEventListener('animationend', function() {
        this.classList.remove('go-down-animation');
        if (this.classList.contains('go-up-animation')) {
            languageList.style.display = 'none';
        }
        this.classList.remove('go-up-animation');
    });

    languageList.onclick = function (event) {
        languageList.classList.add('go-up-animation');

        let target = event.target;
        if (target.tagName !== 'LI') return;

        dropdownButton.childNodes[0].innerText = target.innerText.toUpperCase();
        const setUpLanguage = target.innerText.toLowerCase();
        localStorage.setItem('language', setUpLanguage);

        const languageId = languageNum[setUpLanguage];
        searchContainer.childNodes[0].placeholder = placeholderValues[languageId];
        searchContainer.childNodes[1].value = submitButtonValues[languageId];

        //add current nav
        const input = searchContainer.childNodes[0];
        const city = input.value;

        if (city === "") {
            navigator.geolocation.getCurrentPosition(success, error, options);
        } else {
            searchWeatherLocality(city);
        }
    }
}
