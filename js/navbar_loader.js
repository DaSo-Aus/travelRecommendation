const navbarElement = document.getElementById("navbar-placeholder");
const isTravelPage = window.location.pathname.endsWith("index.html");

const fragment = document.createDocumentFragment();

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
      // ➕ Suchleiste laden
      fetch("../components/navbar-search.html")
        .then(response => {
          if (!response.ok) throw new Error("Fehler beim Laden der Suchleiste");
          return response.text();
        })
        .then(searchHTML => {
          const searchDiv = document.createElement("div");
          searchDiv.innerHTML = searchHTML;
          fragment.appendChild(searchDiv.firstElementChild);
          navbarElement.appendChild(fragment);

          // 🧠 Jetzt ist Suchleiste im DOM – Event-Listener setzen
          initSearchHandlers();
        });
    } else {
      navbarElement.appendChild(fragment);
    }
  })
  .catch(error => {
    console.error("Navbar-Fehler:", error);
  });
