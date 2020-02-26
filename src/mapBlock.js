export default class mapBlock {
    constructor() {
        this.itemsContainer=null;
    }

    init() {
        this.itemsContainer = document.createElement("div");
        this.itemsContainer.classList.add("map-wrapper");
        this.itemsContainer.appendChild(this.createElements());

        return this.itemsContainer;
    }

    createElements() {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(this.createMapDiv());
        fragment.appendChild(this.createCoords());
        return fragment;
    }

    createMapDiv() {
        const mapContainer = document.createElement("div");
        mapContainer.id = "map";

        return mapContainer;
    }

    createCoords() {
        const coordsContainer = document.createElement("div");
        coordsContainer.classList.add("coords-container");
        //location
        const spanLat = document.createElement("span");
        spanLat.innerText = "Latitude:";
        const spanLong = document.createElement("span");
        spanLong.innerText = "Longitude:";

        coordsContainer.appendChild(spanLat);
        coordsContainer.appendChild(spanLong);

        return coordsContainer;
    }
}
