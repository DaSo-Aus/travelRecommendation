let allRecommendations = [];

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".search-bar form");
  const searchInput = searchForm?.querySelector("input[type='text']");
  const container = document.getElementById("recommendation-container");

  fetch("../apis/travel_recommendation_api.json")
    .then((res) => res.json())
    .then((data) => {
      // Städte aus Ländern sammeln
      data.countries?.forEach((country) => {
        country.cities?.forEach((city) => allRecommendations.push(city));
      });

      // Tempel & Strände sammeln
      allRecommendations.push(...(data.temples || []));
      allRecommendations.push(...(data.beaches || []));

      render(allRecommendations);
    });

  // 🔍 Suche nach Eingabe
  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput?.value.trim().toLowerCase();

    if (!query) {
      render(allRecommendations);
      return;
    }

    const filtered = allRecommendations.filter((item) => {
      return (
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    });

    render(filtered);
  });

  // 🔄 Reset-Button
  searchForm?.querySelector("input[type='reset']")?.addEventListener("click", () => {
    render(allRecommendations);
  });

  // ✨ Darstellung der Empfehlungen
  function render(list) {
    container.innerHTML = "";

    if (!list.length) {
      container.innerHTML = "<p>Keine passenden Reiseziele gefunden.</p>";
      return;
    }

    list.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("recommendation-card");

      card.innerHTML = `
        <img src="${item.imageUrl}" alt="Bild von ${item.name}" class="recommendation-image" />
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      `;

      container.appendChild(card);
    });
  }
});
