document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");

  if (!movieId) {
    document.getElementById("movie-details").innerHTML =
      "<p>Movie not found.</p>";
    return;
  }

  fetch("data/top250.json")
    .then(res => res.json())
    .then(data => {
      const movie = data.find(m => m.url === movieId);

      if (!movie) {
        document.getElementById("movie-details").innerHTML =
          "<p>Movie not found in database.</p>";
        return;
      }

      displayMovieDetails(movie);
    })
    .catch(() => {
      document.getElementById("movie-details").innerHTML =
        "<p>Error loading details.</p>";
    });
});

function displayMovieDetails(movie) {
  const container = document.getElementById("movie-details");

  const poster =
    movie.image ||
    "https://via.placeholder.com/400x600?text=No+Image";

  const directors = movie.director?.map(d => d.name).join(", ") || "Unknown";
  const cast = movie.actor?.map(a => a.name).join(", ") || "N/A";
  const genre = movie.genre?.join(", ") || "Unknown";
  const rating = movie.aggregateRating?.ratingValue || "N/A";
  const trailer = movie.trailer?.embedUrl || null;

  container.innerHTML = `
    <img src="${poster}" alt="${movie.name}">
    <div class="details-info">
      <h2>${movie.name} (${movie.datePublished?.split("-")[0] || "Year"})</h2>
      <p><strong>Rating:</strong> ⭐ ${rating}</p>
      <p><strong>Genre:</strong> ${genre}</p>
      <p><strong>Director:</strong> ${directors}</p>
      <p><strong>Cast:</strong> ${cast}</p>
      <p><strong>Duration:</strong> ${movie.duration?.replace("PT", "").toLowerCase() || "N/A"}</p>
      <p><strong>Description:</strong> ${movie.description}</p>
    </div>
  `;
}
