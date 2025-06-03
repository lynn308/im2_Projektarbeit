console.log('hi script.js');

const container = document.querySelector("#container");
const dropdown = document.querySelector("#brewery-type-dropdown");
const handle = document.querySelector("#handle");
const cityDropdown = document.querySelector("#city-dropdown");
const beerFill = document.querySelector(".beer-fill");
const beerFlow = document.getElementById("beer-flow");

const API_URL = "https://api.openbrewerydb.org/v1/breweries?by_country=ireland&per_page=100";

async function fetchData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

// Brauerei-Typ Dropdown befüllen
const myData = await fetchData(API_URL);
console.log(myData);

function populateDropdown() {
  const types = [...new Set(myData.map(item => item.brewery_type))];
  types.forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    dropdown.appendChild(option);
  });
}

// Städte Dropdown befüllen
function populateCityDropdown() {
  const cities = [...new Set(myData.map(item => item.city).filter(Boolean))];
  cities.sort();
  cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    cityDropdown.appendChild(option);
  });
}

// Overlay-Anzeige
function showData(filteredData) {
  container.innerHTML = '';
  container.style.display = 'block';

  const closeButton = document.createElement("button");
  closeButton.id = "close-overlay";
  closeButton.textContent = "✖";
  container.appendChild(closeButton);

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
      <h1 class="overlay-title">Your Brewery!</h1>
      <div class="info-row"><span class="label">Name:</span><span class="value">${element.name}</span></div>
      <div class="info-row"><span class="label">Adress:</span><span class="value">${element.address_1 || ''}, ${element.city || ''}</span></div>
      <div class="info-row"><span class="label">Website:</span>
        <span class="value">${element.website_url ? `<a href="${element.website_url}" target="_blank">${element.website_url}</a>` : '-'}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

// Funktion zum Leeren des Bierglases
function resetBeer() {
  const beerFill = document.querySelector(".beer-fill");
  beerFill.style.height = "0";
  beerFill.style.animation = "none";
  void beerFill.offsetWidth; // Reflow forcieren
}

// Overlay schließen bei Button-Klick oder Klick außerhalb
document.body.addEventListener("click", (event) => {
  const overlay = document.getElementById("container");

  // 1. Klick auf das "✖"-Schließen-Button
  if (event.target.id === "close-overlay") {
    overlay.style.display = "none";
    resetBeer();
  }

  // 2. Klick außerhalb des Overlays
  else if (
    overlay.style.display === "block" &&
    !overlay.contains(event.target)
  ) {
    overlay.style.display = "none";
    resetBeer();
  }
});


populateDropdown();
populateCityDropdown();

// 🍺 Klick-Event für Zapfhahn-Hebel
handle.addEventListener("click", () => {
  const selectedType = dropdown.value;
  const selectedCity = cityDropdown.value;

  if (!selectedType || !selectedCity) {
    alert("Bitte wähle sowohl einen Brauerei-Typ als auch eine Stadt aus.");
    return;
  }

  // Strahl starten
  beerFlow.style.transition = "height 1s ease-in";
  beerFlow.style.height = "385px";

  // Verzögert: Glasfüllung nach 300ms
  beerFill.style.height = "0";
  beerFill.style.animation = "none";
  void beerFill.offsetWidth;
  setTimeout(() => {
    beerFill.style.animation = "fillBeer 2.5s ease-out forwards";
  }, 900);

 // Strahl sichtbar lassen, bevor er verschwindet
setTimeout(() => {
  // Nach 1s ist der Strahl unten angekommen – bleibe 0.5s dort
  setTimeout(() => {
    beerFlow.style.transition = "none";
    beerFlow.style.height = "0px";
    void beerFlow.offsetHeight;
    beerFlow.style.transition = "height 1s ease-in";
  }, 1200); // 👈 0.5 Sekunde stehen lassen
}, 1500); // 

  // Daten filtern
  const filteredData = myData.filter(item => {
    const typeMatch = selectedType === "all" || item.brewery_type === selectedType;
    const cityMatch = selectedCity === "all" || item.city === selectedCity;
    return typeMatch && cityMatch;
  });

  // Overlay ausblenden
  container.style.display = "none";

  // Overlay mit Brauerei nach 3s anzeigen
  setTimeout(() => {
    showData(filteredData);
  }, 4000);

  function showData(filteredData) {
  container.innerHTML = '';
  container.style.display = 'block';

  const closeButton = document.createElement("button");
  closeButton.id = "close-overlay";
  closeButton.textContent = "✖";
  container.appendChild(closeButton);

  // 👉 Titel nur einmal
  const title = document.createElement("h1");
  title.classList.add("overlay-title");
  title.textContent = "Your Brewery!";
  container.appendChild(title);

  if (filteredData.length === 0) {
    const noDataMessage = document.createElement("p");
    noDataMessage.textContent = "Keine Brauereien gefunden.";
    container.appendChild(noDataMessage);
    return;
  }

  filteredData.forEach((element) => {
    const card = document.createElement("article");
    card.classList.add("card");
    card.innerHTML = `
      <div class="info-row"><span class="label">Name:</span><span class="value">${element.name}</span></div>
      <div class="info-row"><span class="label">Address:</span><span class="value">${element.address_1 || ''}, ${element.city || ''}</span></div>
      <div class="info-row"><span class="label">Website:</span>
        <span class="value">${element.website_url ? `<a href="${element.website_url}" target="_blank">${element.website_url}</a>` : '-'}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

});
