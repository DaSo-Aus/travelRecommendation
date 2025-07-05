let allRecommendations = [];

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".search-bar form");
  const searchInput = searchForm?.querySelector("input[type='text']");
  const container = document.getElementById("recommendation-container");

  // Standardhinweis: Noch keine Suche durchgeführt
  container.innerHTML = "<p>Bitte geben Sie ein Suchwort ein und klicken Sie auf 'Search'.</p>";

  fetch("../apis/travel_recommendation_api.json")
    .then((res) => res.json())
    .then((data) => {
      data.countries?.forEach((country) => {
        country.cities?.forEach((city) => allRecommendations.push(city));
      });

      allRecommendations.push(...(data.temples || []));
      allRecommendations.push(...(data.beaches || []));
    });

  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Form submitted");
    const query = searchInput?.value.trim().toLowerCase();
    if (!query) {
      container.innerHTML = "<p>Bitte gib ein Stichwort ein.</p>";
      return;
    }

    const filtered = allRecommendations.filter((item) =>
      item.name?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      container.innerHTML = "<p>Keine passenden Reiseziele gefunden.</p>";
      return;
    }

    render(filtered);
  });

  searchForm?.querySelector("input[type='reset']")?.addEventListener("click", () => {
    container.innerHTML = "<p>Bitte geben Sie ein Suchwort ein und klicken Sie auf 'Search'.</p>";
  });

  function render(list) {
    container.innerHTML = "";

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
