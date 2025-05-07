console.log('hi script.js')

const container = document.querySelector("#container")
const dropdown = document.querySelector("#brewery-type-dropdown")

const API_URL = "https://api.openbrewerydb.org/v1/breweries";


async function fetchData(url){
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (e) {
        console.error(e);
        return[];
    }
}

const myData = await fetchData(API_URL);

function populateDropdown() {
    const types = [...new Set(myData.map(item => item.brewery_type).filter(type => type))]; // Filtere undefined oder null
    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "Alle Brauereitypen";
    dropdown.appendChild(allOption);

    types.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1); // Erstes Zeichen groß
        dropdown.appendChild(option);
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

// Event-Listener für das Dropdown
dropdown.addEventListener('change', (e) => {
    const selectedType = e.target.value;
    const filteredData = selectedType 
        ? myData.filter(item => item.brewery_type === selectedType) 
        : myData; // Wenn nichts ausgewählt ist, zeige alle Brauereien
    showData(filteredData);
});

// Zuerst Dropdown befüllen und alle Daten anzeigen
populateDropdown();
showData(myData);

