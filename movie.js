const API_KEY = "39a4874c97beaa43dabc9beb45d56593";

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

async function loadMovieDetails() {

    const container = document.getElementById("movieDetails");
    container.innerHTML = "<h2 style='padding:20px'>Loading movie...</h2>";

    try {

        // Movie details
        const movieRes = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
        );
        const movie = await movieRes.json();

        // Credits
        const creditRes = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`
        );
        const credits = await creditRes.json();

        // Trailer
        const videoRes = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
        );
        const videos = await videoRes.json();

        // Recommendations
        let recRes = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${API_KEY}`
        );
        let recommendations = await recRes.json();

        // Fallback to similar movies
        if (!recommendations.results || recommendations.results.length === 0) {
            recRes = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}`
            );
            recommendations = await recRes.json();
        }

        // Trailer logic
        let trailerKey = null;
        if (videos.results && videos.results.length > 0) {
            const trailer = videos.results.find(
                v => v.type === "Trailer" && v.site === "YouTube"
            );
            if (trailer) trailerKey = trailer.key;
        }

        // Render layout
        container.innerHTML = `
            <div class="details-container">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
                <div class="movie-info">
                    <h1>${movie.title}</h1>
                    <p><b>Rating:</b> ${movie.vote_average}</p>
                    <p><b>Duration:</b> ${movie.runtime} minutes</p>
                    <p>${movie.overview}</p>

                    ${
                        trailerKey
                        ? `<a class="trailer-btn" href="https://www.youtube.com/watch?v=${trailerKey}" target="_blank">▶ Watch Trailer</a>`
                        : "<p>No trailer available</p>"
                    }
                </div>
            </div>

            <div class="cast-section">
                <h2 style="padding-left:40px;">Top Cast</h2>
                <div class="cast-row">
                    ${
                        credits.cast
                        ? credits.cast.slice(0,8).map(actor => `
                            <div class="cast-card">
                                <img src="${
                                    actor.profile_path
                                    ? "https://image.tmdb.org/t/p/w185" + actor.profile_path
                                    : "https://via.placeholder.com/185x278?text=No+Image"
                                }">
                                <p>${actor.name}</p>
                            </div>
                        `).join("")
                        : ""
                    }
                </div>
            </div>

            <div class="recommend-section">
                <h2 style="padding-left:40px;">Recommended Movies</h2>
                <div id="recommendRow" class="recommend-row"></div>
            </div>
        `;

        // Insert recommended movies dynamically
        const row = document.getElementById("recommendRow");

        if (recommendations.results) {
            recommendations.results
                .filter(rec => rec.poster_path)
                .slice(0, 10)
                .forEach(rec => createRecommendCard(rec, row));

            startAutoScroll(row);
        }

    } catch (error) {
        console.log(error);
        container.innerHTML = "<h2 style='padding:20px'>Error loading movie</h2>";
    }
}

loadMovieDetails();

/* Create recommended movie card */
function createRecommendCard(movie, row) {

    if (!movie.poster_path) return;

    const card = document.createElement("div");
    card.classList.add("movie-card");

    const img = document.createElement("img");
    img.src = "https://image.tmdb.org/t/p/w342" + movie.poster_path;

    const overlay = document.createElement("div");
    overlay.classList.add("movie-overlay");
    overlay.innerText = movie.title;

    card.appendChild(img);
    card.appendChild(overlay);

    card.onclick = () => {
        window.location.href = `movie.html?id=${movie.id}`;
    };

    row.appendChild(card);
}

/* Auto scroll with pause on hover */
function startAutoScroll(row){

    let scrollInterval = setInterval(scroll, 40);

    function scroll(){
        row.scrollLeft += 1;
        if (row.scrollLeft >= row.scrollWidth - row.clientWidth) {
            row.scrollLeft = 0;
        }
    }

    row.addEventListener("mouseenter", () => {
        clearInterval(scrollInterval);
    });

    row.addEventListener("mouseleave", () => {
        scrollInterval = setInterval(scroll, 40);
    });
}
