let movies = [];
let initialDisplay = [];

document.addEventListener("DOMContentLoaded", () => {
  const movieList = document.getElementById("movie-list");
  const searchInput = document.getElementById("search");
  const genreSelect = document.getElementById("genreFilter");
  const regForm = document.getElementById("regForm");

  // --------- Load Movie Data ---------
  fetch("data/top250_min.json")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load movie data");
      return res.json();
    })
    .then(data => {
      movies = data.sort((a, b) => b.rating - a.rating);

      // show random 10 movies initially
      initialDisplay = getRandomMovies(movies, 10);
      displayMovies(initialDisplay);
    })
    .catch(err => {
      console.error(err);
      movieList.innerHTML = `<p style="color:white;">Failed to load movies</p>`;
    });

  // --------- Search + Filter Events ---------
  searchInput.addEventListener("input", handleSearchAndFilter);
  genreSelect.addEventListener("change", handleSearchAndFilter);

  // --------- Registration Form ---------
  regForm.addEventListener("submit", handleFormSubmit);
});


//  Display Movies
function displayMovies(list) {
  const container = document.getElementById("movie-list");
  container.innerHTML = "";

  if (!list || list.length === 0) {
    container.innerHTML = `<p style="color:white;">No movies found</p>`;
    return;
  }

  list.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";

    const poster = movie.thumb_url || "https://via.placeholder.com/200x300?text=No+Image";
    const genre = movie.genre?.join(", ") || "Unknown";
    const rating = movie.rating || "N/A";

    card.innerHTML = `
      <img src="${poster}" alt="${movie.name}">
      <div class="movie-info">
        <h3 title="${movie.name}">${movie.name} (${movie.year})</h3>
        <p>⭐ ${rating}</p>
        <p>${genre}</p>
      </div>
      <div class="movie-footer">
        <a href="details.html?id=${encodeURIComponent(movie.imdb_url)}">
          <button>Details</button>
        </a>
      </div>
    `;

    container.appendChild(card);
  });

  removeBrokenPosters();
}

//  Get Random Movies

function getRandomMovies(arr, count) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function handleSearchAndFilter() {
  const query = document.getElementById("search").value.toLowerCase();
  const genreChoice = document.getElementById("genreFilter").value.toLowerCase();

  // start with all movies
  let baseList = [];

  // if no filter applied → show initial 10
  if (genreChoice === "all" && query === "") {
    baseList = initialDisplay;
  } 
  // if only genre selected
  else if (genreChoice !== "all" && query === "") {
    baseList = movies.filter(m =>
      m.genre && m.genre.some(g => g.toLowerCase() === genreChoice)
    );
  } 
  // if only search applied
  else if (genreChoice === "all" && query !== "") {
    baseList = movies.filter(m =>
      m.name.toLowerCase().includes(query) ||
      (m.genre && m.genre.join(",").toLowerCase().includes(query)) ||
      (m.actors && m.actors.join(",").toLowerCase().includes(query))
    );
  } 
  // both genre + search active
  else {
    baseList = movies.filter(m =>
      (m.genre && m.genre.some(g => g.toLowerCase() === genreChoice)) &&
      (
        m.name.toLowerCase().includes(query) ||
        (m.actors && m.actors.join(",").toLowerCase().includes(query))
      )
    );
  }

  displayMovies(baseList);
}

//  Registration Form
function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !email || !phone) {
    alert("Please fill in all fields.");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  const phonePattern = /^[0-9]{10}$/;
  if (!phonePattern.test(phone)) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  alert(`Thank you, ${name}! You’ve successfully registered for the movie event.`);
  e.target.reset();
}

//  Remove Broken Posters
function removeBrokenPosters() {
  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      img.src = "https://via.placeholder.com/200x300?text=Image+Not+Found";
    });
  });
}
