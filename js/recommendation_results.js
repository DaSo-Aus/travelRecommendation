const recommendationContainer = document.getElementById("recommendation-container");

// 🔎 Suchfunktion aktivieren – wird nach dem Laden der Suchleiste aufgerufen
function initSearchHandlers() {
  const searchInput = document.querySelector('.search-bar input[type="text"]');
  const searchButton = document.querySelector('.search-bar input[type="submit"]');
  const clearButton = document.querySelector('.search-bar input[type="reset"]');

  if (searchButton && searchInput && clearButton) {
    searchButton.addEventListener("click", (event) => {
      event.preventDefault();
      const keyword = searchInput.value.trim().toLowerCase();
      if (!keyword) return;
      showRecommendations(keyword);
    });

    clearButton.addEventListener("click", (event) => {
      event.preventDefault();
      searchInput.value = "";
      recommendationContainer.innerHTML = "";
    });
  }
}

// 🔄 JSON-Daten laden
let travelData = null;

fetch("../apis/travel_recommendation_api.json")
  .then(response => {
    if (!response.ok) throw new Error("Fehler beim Laden der JSON-Daten");
    return response.json();
  })
  .then(data => {
    travelData = data;
    console.log("Empfehlungsdaten geladen:", data);
  })
  .catch(error => console.error("Datenladefehler:", error));

// 📍 Empfehlungen anzeigen basierend auf flexibler Übereinstimmung
function showRecommendations(keyword) {
  recommendationContainer.innerHTML = "";
  if (!travelData) return;

  const results = [];

  // 🔍 Länder + Städte durchsuchen (flexibles Matching)
  travelData.countries.forEach(country => {
    const countryNameLower = country.name.toLowerCase();

    if (countryNameLower.includes(keyword)) {
      results.push(...country.cities.map(city => ({
        name: city.name,
        imageUrl: city.imageUrl,
        description: city.description,
        timezone: getTimezoneByCountry(country.name)
      })));
    } else {
      country.cities.forEach(city => {
        if (city.name.toLowerCase().includes(keyword)) {
          results.push({
            name: city.name,
            imageUrl: city.imageUrl,
            description: city.description,
            timezone: getTimezoneByCountry(country.name)
          });
        }
      });
    }
  });

  // 🔍 Tempel durchsuchen
  travelData.temples.forEach(temple => {
    const nameLower = temple.name.toLowerCase();
    if (
      nameLower.includes(keyword) ||
      keyword === "temple" ||
      keyword === "temples"
    ) {
      results.push({
        name: temple.name,
        imageUrl: temple.imageUrl,
        description: temple.description
      });
    }
  });

  // 🔍 Strände durchsuchen
  travelData.beaches.forEach(beach => {
    const nameLower = beach.name.toLowerCase();
    if (
      nameLower.includes(keyword) ||
      keyword === "beach" ||
      keyword === "beaches"
    ) {
      results.push({
        name: beach.name,
        imageUrl: beach.imageUrl,
        description: beach.description
      });
    }
  });

  // ❌ Kein Ergebnis
  if (results.length === 0) {
    const card = document.createElement("div");
    card.className = "recommendation-card";

    const title = document.createElement("h3");
    title.textContent = "No results found";

    const desc = document.createElement("p");
    desc.textContent = "Try another keyword like 'Australia', 'Angkor Wat', or 'Beach'.";

    card.appendChild(title);
    card.appendChild(desc);
    recommendationContainer.appendChild(card);
    return;
  }

  // ✅ Ergebnisse anzeigen
  results.forEach(destination => {
    const card = document.createElement("div");
    card.className = "recommendation-card";

    if (destination.imageUrl) {
      const img = document.createElement("img");
      img.src = destination.imageUrl;
      img.alt = destination.name;
      img.className = "recommendation-image";
      card.appendChild(img);
    }

    const title = document.createElement("h3");
    title.textContent = destination.name;

    const desc = document.createElement("p");
    desc.textContent = destination.description;

    card.appendChild(title);
    card.appendChild(desc);

    if (destination.timezone) {
      const timeElement = document.createElement("p");
      timeElement.style.fontSize = "0.9em";
      timeElement.style.color = "#333";
      const now = new Date().toLocaleTimeString('en-US', {
        timeZone: destination.timezone,
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      });
      timeElement.textContent = `Current time: ${now}`;
      card.appendChild(timeElement);
    }

    recommendationContainer.appendChild(card);
  });
}

// 🌍 Zeitzonenzuordnung
function getTimezoneByCountry(countryName) {
  const zones = {
    "Australia": "Australia/Sydney",
    "Japan": "Asia/Tokyo",
    "Brazil": "America/Sao_Paulo",
    "India": "Asia/Kolkata",
    "Cambodia": "Asia/Phnom_Penh",
    "French Polynesia": "Pacific/Tahiti"
  };
  return zones[countryName] || null;
}
