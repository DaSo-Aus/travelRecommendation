const navbarElement = document.getElementById("navbar-placeholder");
const isTravelPage = window.location.pathname.endsWith("travel_recommendation.html");

// Leeres Wrapper-DIV zum Kombinieren beider Module vorbereiten
const fragment = document.createDocumentFragment();

// Haupt-Navigation laden
fetch("../components/navbar-main.html")
  .then(response => {
    if (!response.ok) throw new Error("Fehler beim Laden der Haupt-Navigation");
    return response.text();
  })
  .then(mainHTML => {
    const mainDiv = document.createElement("div");
    mainDiv.innerHTML = mainHTML;
    fragment.appendChild(mainDiv.firstElementChild);

    if (isTravelPage) {
      // Falls travel_recommendation.html → auch Suchleiste laden
      fetch("../components/navbar-search.html")
        .then(response => {
          if (!response.ok) throw new Error("Fehler beim Laden der Suchleiste");
          return response.text();
        })
        .then(searchHTML => {
          const searchDiv = document.createElement("div");
          searchDiv.innerHTML = searchHTML;
          fragment.appendChild(searchDiv.firstElementChild);
          navbarElement.appendChild(fragment); // Beide Teile gemeinsam anhängen
        });
    } else {
      navbarElement.appendChild(fragment); // Nur Main-Teil anhängen
    }
  })
  .catch(error => {
    console.error("Navbar-Fehler:", error);
  });
