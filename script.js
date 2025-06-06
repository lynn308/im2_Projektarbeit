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

// ✅ Neue showData-Funktion mit Sorry-Nachricht
function showData(filteredData) {
  container.innerHTML = '';
  container.style.display = 'block';

  const closeButton = document.createElement("button");
  closeButton.id = "close-overlay";
  closeButton.textContent = "✖";
  container.appendChild(closeButton);

  if (filteredData.length === 0) {
    const noDataMessage = document.createElement("div");
    noDataMessage.innerHTML = `
      <h2 class="brewery-name">🍺 Sorry!</h2>
      <p style="font-size: 18px; color: white; max-width: 600px;">
        Leider gibt es keine passende Brauerei für deine Auswahl. Probiere eine andere Kombination.
      </p>
    `;
    container.appendChild(noDataMessage);
    return;
  }

  // 👉 Titel nur anzeigen, wenn Daten vorhanden sind
  const title = document.createElement("h1");
  title.classList.add("overlay-title");
  title.textContent = "🍺 Your Brewery!";
  container.appendChild(title);

  filteredData.forEach((element) => {
    const card = document.createElement("article");
    card.classList.add("card");
    card.innerHTML = `
      <h2 class="brewery-name">${element.name}</h2>
      <div class="info-row">
        <span class="label">Address:</span>
        <span class="value">${element.address_1 || ''}, ${element.city || ''}</span>
      </div>
      <div class="info-row">
        <span class="label">Website:</span>
        <span class="value">${element.website_url ? `<a href="${element.website_url}" target="_blank">${element.website_url}</a>` : '-'}</span>
      </div>
    `;
    container.appendChild(card);
  });
}



// Funktion zum Leeren des Bierglases
function resetBeer() {
  beerFill.style.height = "0";
  beerFill.style.animation = "none";
  void beerFill.offsetWidth;
}

// Overlay schließen
document.body.addEventListener("click", (event) => {
  if (event.target.id === "close-overlay" || 
      (container.style.display === "block" && !container.contains(event.target))) {
    container.style.display = "none";
    resetBeer();
  }
});

// 🍺 Zapfhahn-Klick
handle.addEventListener("click", () => {
  const selectedType = dropdown.value;
  const selectedCity = cityDropdown.value;

  if (!selectedType || !selectedCity) {
    alert("Bitte wähle sowohl einen Brauerei-Typ als auch eine Stadt aus.");
    return;
  }

  // Bierstrahl anpassen je nach Gerät
  beerFlow.style.transition = "height 1s ease-in";
  const isMobile = window.innerWidth <= 750;
  beerFlow.style.height = isMobile ? "225px" : "385px";

  // Glas füllen (Animation)
  beerFill.style.height = "0";
  beerFill.style.animation = "none";
  void beerFill.offsetWidth;
  setTimeout(() => {
    beerFill.style.animation = "fillBeer 2.5s ease-out forwards";
  }, 900);

  // Strahl verschwindet wieder
  setTimeout(() => {
    setTimeout(() => {
      beerFlow.style.transition = "none";
      beerFlow.style.height = "0px";
      void beerFlow.offsetHeight;
      beerFlow.style.transition = "height 1s ease-in";
    }, 1200);
  }, 1500);

  // Daten filtern & anzeigen
  const filteredData = myData.filter(item => {
    const typeMatch = selectedType === "all" || item.brewery_type === selectedType;
    const cityMatch = selectedCity === "all" || item.city === selectedCity;
    return typeMatch && cityMatch;
  });

  container.style.display = "none";
  setTimeout(() => {
    showData(filteredData);
  }, 4000);
});

// Initiales Setup
populateDropdown();
populateCityDropdown();
