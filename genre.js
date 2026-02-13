const API_KEY = "39a4874c97beaa43dabc9beb45d56593";

const params = new URLSearchParams(window.location.search);
const genres = params.get("genres");

async function loadGenreMovies() {

    const container = document.getElementById("genreResults");
    container.innerHTML = "<h3 style='padding:20px'>Finding movies for your mood...</h3>";

    try {

        let allMovies = [];

        // Load first 3 pages
        for (let page = 1; page <= 3; page++) {

            const res = await fetch(
                `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genres}&page=${page}`
            );

            const data = await res.json();

            if (data.results) {
                allMovies = allMovies.concat(data.results);
            }
        }

        container.innerHTML = "";

        allMovies
            .filter(movie => movie.poster_path)
            .slice(0, 30)
            .forEach(movie => {

                const img = document.createElement("img");
                img.src = "https://image.tmdb.org/t/p/w342" + movie.poster_path;
                img.style.width = "180px";
                img.style.margin = "10px";
                img.style.cursor = "pointer";

                img.onclick = () => {
                    window.location.href = `movie.html?id=${movie.id}`;
                };

                container.appendChild(img);
            });

    } catch (error) {
        console.log(error);
        container.innerHTML = "<h3 style='padding:20px'>Error loading movies</h3>";
    }
}

loadGenreMovies();
