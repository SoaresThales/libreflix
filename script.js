// ==============================
// Data Base (DB)
// ==============================

let movies = []; //nasce vazio e espera o back-end

async function loadMoviesFromAPI() {
    try {
        let response = await fetch('http://localhost:3000/api/movies');  // O Front-end faz o pedido para a URL      
        movies = await response.json(); // Traduz o JSON de volta
        console.log("✅ Sucesso! O Front-end puxou os filmes do Node.js!", movies);
        loadFeaturedMovie();
        loadCatalog();
    } catch (error) {        
        console.error("❌ Erro ao conectar no servidor:", error); // Se o servidor estiver desligado, ele avisa aqui
    }
}

loadMoviesFromAPI(); // Dá a partida assim que o script é carregado!

// ==============================
// LIBREFLIX ENGINE
// ==============================

function loadFeaturedMovie() {
    let featuredMovie = movies.find(function(movie) {
        return movie.featured === true;
    });

    if (featuredMovie === undefined) {
        console.log("Erro: Nenhum filme marcado como destaque no banco de dados.");
        return; // Para a execução aqui
    }

    let heroSection = document.getElementById('featured-movie');
    let titleElement = document.getElementById('featured-title');
    let plotElement = document.getElementById('featured-plot');

    titleElement.textContent = featuredMovie.title;
    plotElement.textContent = featuredMovie.plot;

    heroSection.style.backgroundImage = "url('" + featuredMovie.poster + "')";

    let infoBtn = document.getElementById('more-info-btn');    
    infoBtn.onclick = function() {
        openModal(featuredMovie.id);
    };

    let heroPlayBtn = document.getElementById('hero-play-btn');
    
    heroPlayBtn.onclick = function() {
        openModal(featuredMovie.id);
        document.getElementById('modal-play-btn').click(); 
    };
}
loadFeaturedMovie();

// ==============================
// CAROUSEL
// ==============================

function loadCatalog() {
    let animationSlider = document.getElementById('animation-slider');
    let scifiSlider = document.getElementById('scifi-slider');
    animationSlider.innerHTML = ""; 
    scifiSlider.innerHTML = ""; 

    let animations = movies.filter(function(movie) {
        return movie.genre === "Animation" && movie.featured === false;
    });

    let scifiMovies = movies.filter(function(movie) {
        return movie.genre === "Sci-Fi" && movie.featured === false;
    });

   function buildPosters(movieList, targetSlider) {
        for (let i = 0; i < movieList.length; i++) {
            let posterHtml = "<img src='" + movieList[i].poster + "' alt='" + movieList[i].title + "' class='movie-poster' onclick='openModal(" + movieList[i].id + ")'>";
            targetSlider.innerHTML += posterHtml;
        }
    }
    buildPosters(animations, animationSlider);
    buildPosters(scifiMovies, scifiSlider);
}

// ==============================
// MODAL (JANELA FLUTUANTE)
// ==============================

function openModal(idDoFilmeClicado) {
    let movieDetails = movies.find(function(movie) {
        return movie.id === idDoFilmeClicado; 
    });

    let modal = document.getElementById('movie-modal');
    let modalTitle = document.getElementById('modal-title');
    let modalPlot = document.getElementById('modal-plot');
    let modalBackdrop = document.getElementById('modal-backdrop');
    let modalVideo = document.getElementById('modal-video');
    let playBtn = document.getElementById('modal-play-btn');
    let modalInfoBox = document.getElementById('modal-info-box');

    modalTitle.textContent = movieDetails.title;
    modalPlot.textContent = movieDetails.plot;
    modalBackdrop.src = movieDetails.poster;

    playBtn.onclick = function() {
        modalBackdrop.classList.add('hidden'); 
        modalInfoBox.classList.add('hidden'); 
        modalVideo.classList.remove('hidden'); 
        modalVideo.src = movieDetails.trailer + "?autoplay=1"; 
    };
    modal.classList.remove('hidden');
}

function closeModal() {
    let modal = document.getElementById('movie-modal');
    let modalBackdrop = document.getElementById('modal-backdrop');
    let modalVideo = document.getElementById('modal-video');
    let modalInfoBox = document.getElementById('modal-info-box');

    modal.classList.add('hidden');

    modalVideo.src = ""; 
    modalVideo.classList.add('hidden'); 
    modalBackdrop.classList.remove('hidden'); 
    modalInfoBox.classList.remove('hidden'); 
}

// ==============================
// ACESSIBILIDADE (TECLADO)
// ==============================

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal(); 
    }
});

// ==============================
// REAL TIME SEARCH
// ==============================

let searchBox = document.getElementById('search-box');
searchBox.addEventListener('input', function() {
    let typedText = searchBox.value.toLowerCase();
    let searchSection = document.getElementById('search-section');
    let searchSlider = document.getElementById('search-slider');
    searchSlider.innerHTML = "";

    if (typedText === "") {
        searchSection.classList.add('hidden');
    } else {
        searchSection.classList.remove('hidden');
        let results = movies.filter(function(movie) {
            return movie.title.toLowerCase().includes(typedText);
        });
        
        for (let i = 0; i < results.length; i++) {
            let posterHtml = "<img src='" + results[i].poster + "' alt='" + results[i].title + "' class='movie-poster' onclick='openModal(" + results[i].id + ")'>";
            searchSlider.innerHTML += posterHtml;
        }
    }
});