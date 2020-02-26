export default class weatherBlock {
    constructor() {
        this.controlsContainer=null;
    }

    init() {
        this.controlsContainer = document.createElement("div");
        this.controlsContainer.classList.add("weather-container");
        this.controlsContainer.appendChild(this.createElements());

        return this.controlsContainer;
    }

    createElements() {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(this.geolocationContainer());
        fragment.appendChild(this.currentWeatherContainer());
        return fragment;
    }

    geolocationContainer() {
        const geolocationContainer = document.createElement("div");
        geolocationContainer.classList.add("geolocation-container");
        //location
        const h1 = document.createElement("h1");
        h1.classList.add("location", "text-light", "text-uppercase");
        h1.innerText = "Minsk";
        //timezone
        const timezone = document.createElement("span");
        timezone.classList.add("date", "text-light");
        timezone.innerText = "Date";
        geolocationContainer.appendChild(h1);
        geolocationContainer.appendChild(timezone);

        return geolocationContainer;
    }

    currentWeatherContainer() {
        const currentWeatherContainer = document.createElement("div");
        currentWeatherContainer.classList.add("current-weather");
        //temperature
        const currentWeather = document.createElement("div");
        currentWeather.classList.add("current-temperature");
        const currentTemperature = document.createElement("span");
        currentTemperature.innerHTML = `-10&#176`;
        currentWeather.appendChild(currentTemperature);
        //icon
        const src = 'assets/weather-icons/clear-day.png';
        addImage (currentWeather, src, 140);
        //other weather parameters
        currentWeatherContainer.appendChild(currentWeather);
        currentWeatherContainer.appendChild(this.currentWeatherList());

        return currentWeatherContainer;
    }

    currentWeatherList() {
        const weatherListContainer = document.createElement("div");
        weatherListContainer.classList.add("current-parameters");

        const ul = document.createElement('ul');
        ul.classList.add("weather-list");
        const weatherList = ["Overcast", "Feels like:", "Wind:", "Humidity:"];
        for (let i=0; i<weatherList.length; i++) {
            const listElement = document.createElement("li");
            listElement.innerHTML = weatherList[i];
            ul.appendChild(listElement);
        }
        weatherListContainer.appendChild(ul);

        return weatherListContainer;
    }
}

function addImage(parent, path, imgWidth) {
    let elem = document.createElement("img");
    elem.src = path;
    if (imgWidth) {
        elem.width = imgWidth;
    }
    parent.appendChild(elem);
}
