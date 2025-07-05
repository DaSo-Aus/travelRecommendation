document.addEventListener("DOMContentLoaded", () => {
  fetch('../apis/travel_recommendation_api.json') 
    .then(response => {
      if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Reisedaten.");
      }
      return response.json();
    })
    .then(data => {
      console.log("Empfehlungen geladen:", data);
      renderRecommendations(data);
    })
    .catch(error => {
      console.error("Fehler beim Laden der Empfehlungen:", error);
    });
});

function renderRecommendations(recommendations) {
  const container = document.getElementById("recommendation-container");

  if (!container) {
    console.warn("Container mit der ID 'recommendation-container' wurde nicht gefunden.");
    return;
  }

  recommendations.forEach(place => {
    const card = document.createElement("div");
    card.classList.add("recommendation-card");

    card.innerHTML = `
      <h3>${place.name}</h3>
      <img src="${place.imageUrl}" alt="Bild von ${place.name}" class="recommendation-image" />
      <p>${place.description}</p>
    `;

    container.appendChild(card);
  });
}
