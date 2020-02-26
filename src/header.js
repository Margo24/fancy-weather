export default class ControlBlock {
    constructor() {
        this.controlsContainer=null;
    }

    init() {
        this.controlsContainer = document.createElement("div");
        this.controlsContainer.classList.add("controls-container");

        this.controlsContainer.appendChild(this.createControls());

        return this.controlsContainer;
    }

    createControls() {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(this.refreshButton());
        fragment.appendChild(this.languageControl());
        fragment.appendChild(this.temperatureControl());
        fragment.appendChild(this.searchForm());
        return fragment;
    }

    refreshButton() {
        const RefreshBtn = document.createElement("button");
        RefreshBtn.setAttribute("type", "button");
        RefreshBtn.classList.add("refresh-button");
        //add image into button
        const src = 'assets/refresh-pic.svg';
        addImage(RefreshBtn, src, 0);

        return RefreshBtn;
    }

    languageControl() {
        const dropdown = document.createElement("div");
        dropdown.classList.add("dropdown");
        //create button
        const DropdownBtn = document.createElement("button");
        DropdownBtn.setAttribute("type", "button");
        DropdownBtn.classList.add("dropdown-button");
        //add inner content
        const dropdownText = document.createElement("span");
        dropdownText.innerText = "En";
        DropdownBtn.appendChild(dropdownText);
        const src = 'assets/dropdown-vector.svg';
        addImage(DropdownBtn, src, 0);

        dropdown.appendChild(DropdownBtn);
        dropdown.appendChild(this.dropdownList());

        return dropdown;
    }

    dropdownList() {
        const languages = ['En', 'Ru', 'Be'];
        const ul = document.createElement('ul');
        ul.classList.add("language-list");
        for (let i=0; i<languages.length; i++) {
            const listElement = document.createElement("li");
            listElement.innerHTML = languages[i];
            ul.appendChild(listElement);
        }

        return ul;
    }

    temperatureControl() {
        const temperatureContainer = document.createElement("div");
        temperatureContainer.classList.add("temperature-container");
        const temperatureScales = ["F", "C"];
        temperatureScales.forEach((element,index) => {
            const keyElement = document.createElement("button");

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("temperature-key");
            switch (index) {
                case 0:
                    keyElement.classList.add("left");
                    keyElement.innerHTML = `&#176${element}`;
                    break;

                case 1:
                default:
                    keyElement.classList.add("right");
                    keyElement.classList.add("active");
                    keyElement.innerHTML = `&#176${element}`;
                    break;
            }

            temperatureContainer.appendChild(keyElement);
        });

        return temperatureContainer;
    }

    searchForm() {
        const searchContainer = document.createElement("div");
        searchContainer.classList.add("search-container");
        //add search input
        const searchInput = document.createElement("input");
        searchInput.setAttribute("type", "text");
        searchInput.setAttribute("placeholder", "Search city");
        searchContainer.appendChild(searchInput);

        //add submit button
        const Submit = document.createElement("input");
        Submit.setAttribute("type", "submit");
        Submit.setAttribute("value", "Search");
        Submit.classList.add("submit-button");
        Submit.innerHTML = "Search";
        searchContainer.appendChild(Submit);

        return searchContainer;
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
