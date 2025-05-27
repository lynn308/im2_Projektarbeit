console.log('hi script.js')

const container = document.querySelector("#container")
const dropdown = document.querySelector("#brewery-type-dropdown")
const handle = document.querySelector("#handle")

const API_URL = "https://api.openbrewerydb.org/v1/breweries?by_country=ireland&per_page=100";


async function fetchData(url){
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (e) {
        console.error(e);
        return[];
    }
}

//Filter für Brauereien nach Typ//

const myData = await fetchData(API_URL);
console.log(myData);

function populateDropdown() {
    const types = [...new Set(myData.map(item => item.brewery_type))]; // Set entfernt Duplikate
    types.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1); // Erstes Zeichen groß
        dropdown.appendChild(option);
    });
}

//Filter für Brauereien nach Stadt//
const cityDropdown = document.querySelector("#city-dropdown");

function populateCityDropdown() {
    const cities = [...new Set(myData.map(item => item.city).filter(Boolean))];
    cities.sort(); // alphabetisch
    cities.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        cityDropdown.appendChild(option);
    });
}


// Funktion zur Anzeige der Brauereien
function showData(filteredData) {
    container.innerHTML = ''; // Löscht bestehende Einträge

    if (filteredData.length === 0) {
        const noDataMessage = document.createElement("p");
        noDataMessage.textContent = "Keine Brauereien gefunden.";
        container.appendChild(noDataMessage);
        return;
    }
    filteredData.forEach((element) => {
        console.log(element.name);
        let card = document.createElement("article");
        card.classList.add("card");
        card.innerHTML = `
            <h2 class="irgendwas">${element.name}</h2>
            <p>${element.brewery_type}</p>
            <p>${element.website_url}</p>
        `;
        container.appendChild(card);
    });
}


// Zuerst Dropdown befüllen und alle Daten anzeigen
populateDropdown();
populateCityDropdown();



handle.addEventListener("click", () => {
    const selectedType = dropdown.value;
    const selectedCity = cityDropdown.value;

    // Filtere die Daten basierend auf dem ausgewählten Typ und der Stadt
    const filteredData = myData.filter(item => {
        const typeMatch = selectedType === "all" || item.brewery_type === selectedType;
        const cityMatch = selectedCity === "all" || item.city === selectedCity;
        return typeMatch && cityMatch;
    });

    // Zeige die gefilterten Daten an
    console.log(filteredData); // Debugging-Ausgabe
    showData(filteredData);
});