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


//Overlay für Ergebnisanzeige//
function showOverlay(breweryData) {
    const overlay = document.getElementById("overlay");
    const content = document.getElementById("overlay-content");

    content.innerHTML = `
        <h2>Your Brewery Match 🍻</h2>
        <p><strong>Name:</strong> ${breweryData.name}</p>
        <p><strong>Type:</strong> ${breweryData.brewery_type}</p>
        <p><strong>Location:</strong> ${breweryData.city}, ${breweryData.state}</p>
        <p><strong>Address:</strong> ${breweryData.street}</p>
        <p><strong>Website:</strong> 
            <a href="${breweryData.website_url}" target="_blank">
                ${breweryData.website_url}
            </a>
        </p>
        <p><em>Klick irgendwo, um zu schließen</em></p>
    `;

    overlay.classList.remove("hidden");
}

//Overlay schliessen//
document.getElementById("overlay").addEventListener("click", () => {
    document.getElementById("overlay").classList.add("hidden");
});

//Bier auslösen bei klick auf Hebel

const handle = document.getElementById("handle");
const stream = document.getElementById("beer-stream");
const glass = document.getElementById("glass");

handle.addEventListener("click", () => {
    // Griff optisch drehen
    handle.style.transform = "rotate(45deg)";

    // Bier "fließt"
    stream.style.height = "80px";
    glass.style.background = "gold";

    // Nach 1,5 Sekunden: Griff zurück + Overlay zeigen
    setTimeout(() => {
        handle.style.transform = "rotate(0deg)";
        stream.style.height = "0";

        // Filter anwenden
        const selectedType = dropdown.value;
        const selectedCity = cityDropdown.value;

        if (!selectedType && !selectedCity) {
            alert("Bitte wähle zuerst einen Brauereityp oder eine Stadt.");
            return; // Beende die Funktion
          }
          

        const filteredData = myData.filter(item => {
            const matchesType = selectedType
  ? item.brewery_type?.toLowerCase() === selectedType.toLowerCase()
  : true;

const matchesCity = selectedCity
  ? item.city?.toLowerCase() === selectedCity.toLowerCase()
  : true;

            return matchesType && matchesCity;
        });

        if (filteredData.length > 0) {
            showOverlay(filteredData[0]); // erste passende Brauerei
        } else {
            alert("Keine passende Brauerei gefunden.");
        }
    }, 1500);
});
