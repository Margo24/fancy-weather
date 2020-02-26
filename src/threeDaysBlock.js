export default class threeDaysWeatherBlock {
    constructor() {
        this.controlsContainer=null;
    }

    init() {
        this.controlsContainer = document.createElement("div");
        this.controlsContainer.classList.add("three-days-weather");
        this.controlsContainer.appendChild(this.createElements());

        return this.controlsContainer;
    }

    createElements() {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i<3; i++) {
            fragment.appendChild(this.generateIcon());
        }

        return fragment;
    }

    generateIcon() {
        const dayOfWeek = document.createElement("div");
        const nameOfDay = document.createElement("h3");
        nameOfDay.innerText = "Day";
        nameOfDay.classList.add("day-of-week", "text-light");
        const weatherInfo = document.createElement("div");
        weatherInfo.classList.add("future-weather");

        const temperature = document.createElement("span");
        temperature.classList.add("text-light", "future-temperature");
        temperature.innerHTML = `-10&#176`;
        weatherInfo.appendChild(temperature);

        const src = 'assets/weather-icons/clear-day.png';
        addImage (weatherInfo, src, 60);

        dayOfWeek.appendChild(nameOfDay);
        dayOfWeek.appendChild(weatherInfo);

        return dayOfWeek;
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
