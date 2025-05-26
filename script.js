console.log('hi script.js')

const container = document.querySelector("#container")
const dropdown = document.querySelector("#brewery-type-dropdown")

const API_URL = "https://api.openbrewerydb.org/v1/breweries?by_country=ireland&per_page=50";


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
    filteredData.forEach((element) => {
        console.log(element.name);
        let card = document.createElement("article");
        card.classList.add("card");
        card.innerHTML = `
            <h2>${element.name}</h2>
            <p>${element.brewery_type}</p>
        `;
        container.appendChild(card);
    });
}


// Zuerst Dropdown befüllen und alle Daten anzeigen
populateDropdown();
populateCityDropdown();



