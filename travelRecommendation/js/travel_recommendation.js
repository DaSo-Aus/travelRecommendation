// NavBar laden
fetch("../components/navbar.html")
    .then(response => {
        if (!response.ok) throw new Error("Netzwerkfehler");
        return response.text();
    })
    .then(data => {
        document.getElementById("navbar-placeholder").innerHTML = data;
    })
    .catch(error => {
        console.error("Fehler beim Laden der NavBar:", error);
    });
