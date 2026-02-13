const API_KEY = "39a4874c97beaa43dabc9beb45d56593";

/* Create movie cards */
function createMovieCard(movie, row) {

    if (!movie.poster_path) return;

    const card = document.createElement("div");
    card.classList.add("movie-card");

    const img = document.createElement("img");
    img.src = "https://image.tmdb.org/t/p/w342" + movie.poster_path;
    img.loading = "lazy";

    /* Rating Badge */
    const rating = document.createElement("div");
    rating.classList.add("rating-badge");

    let score = movie.vote_average
        ? movie.vote_average.toFixed(1)
        : "N/A";

    rating.innerText = "⭐ " + score;

    if (score >= 7) rating.style.color = "#00ff88";
    else if (score >= 5) rating.style.color = "#ffd700";
    else rating.style.color = "#ff4c4c";

    /* Trending Badge */
    if (movie.vote_average >= 7.5 && movie.vote_count > 300) {
        const trending = document.createElement("div");
        trending.classList.add("trending-badge");
        trending.innerText = "🔥 Trending";
        card.appendChild(trending);
    }

    /* Overlay title */
    const overlay = document.createElement("div");
    overlay.classList.add("movie-overlay");
    overlay.innerText = movie.title;

    card.appendChild(img);
    card.appendChild(rating);
    card.appendChild(overlay);

    card.onclick = () => {
        window.location.href = `movie.html?id=${movie.id}`;
    };

    row.appendChild(card);
}

/* Load movies */
async function loadMovies(url, rowId) {
    try {
        const res = await fetch(url);
        const data = await res.json();

        const row = document.getElementById(rowId);
        row.innerHTML = "";

        if (!data.results) return;

        data.results.slice(0, 10).forEach(movie => {
            createMovieCard(movie, row);
        });

        startAutoScroll(row);

    } catch (error) {
        console.error("Error loading movies:", error);
    }
}

/* Auto-scroll rows */
function startAutoScroll(row) {
    setInterval(() => {
        row.scrollLeft += 1;
        if (row.scrollLeft >= row.scrollWidth - row.clientWidth) {
            row.scrollLeft = 0;
        }
    }, 40);
}

/* Mood recommendation */
function searchMood(mood) {

    const moodMap = {
        happy: [35, 16],
        romantic: [10749],
        excited: [28, 12],
        sad: [18],
        scared: [27, 53],
        chill: [14, 12],
        curious: [9648],
        inspired: [36, 99],
        nostalgic: [18, 10751]
    };

    if (!moodMap[mood]) return;

    const genreIds = moodMap[mood].join(",");
    window.location.href = `genre.html?genres=${genreIds}`;
}

/* Featured banner */
async function loadFeaturedMovie() {
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
        );

        const data = await res.json();
        if (!data.results || data.results.length === 0) return;

        const movies = data.results.slice(0, 6);

        const banner = document.getElementById("featuredBanner");
        const title = document.getElementById("featuredTitle");
        const overview = document.getElementById("featuredOverview");
        const btn = document.getElementById("featuredBtn");

        let index = 0;

        function showMovie(movie) {
            if (!movie.backdrop_path) return;

            banner.style.backgroundImage =
                `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

            title.textContent = movie.title;

            overview.textContent = movie.overview
                ? movie.overview.substring(0, 150) + "..."
                : "No description available.";

            btn.onclick = () => {
                window.location.href = `movie.html?id=${movie.id}`;
            };
        }

        showMovie(movies[index]);

        setInterval(() => {
            index = (index + 1) % movies.length;
            showMovie(movies[index]);
        }, 5000);

    } catch (error) {
        console.log("Error loading featured movies:", error);
    }
}

/* Load Movie Rows */

/* Recent famous Tamil movies */
loadMovies(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=ta&region=IN&sort_by=popularity.desc&primary_release_date.gte=2020-01-01&vote_count.gte=100`,
    "tamilRow"
);

/* Hindi movies */
loadMovies(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=hi&sort_by=popularity.desc`,
    "hindiRow"
);

/* Hollywood movies */
loadMovies(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=en&sort_by=popularity.desc`,
    "hollywoodRow"
);

/* Popular movies */
loadMovies(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`,
    "popularRow"
);

/* Start featured banner */
loadFeaturedMovie();
