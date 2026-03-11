// ==============================
// Data Base (DB)
// ==============================

const movies = [
    {
        id: 1,
        title: "Steamboat Willie",
        year: 1928,
        genre: "Animation",
        plot: "Mickey Mouse pilots a steamboat and turns everything into musical instruments in his first official appearance.",
        poster: "https://image.tmdb.org/t/p/original/xEur3v9kMfw4zDueCh4wrUuhW5A.jpg",
        trailer: "https://www.youtube.com/embed/8LdpvQHg3e0?si=TVuuOCMdWiv2YanF",
        featured: false
    },
    {
        id: 2,
        title: "The Kid",
        year: 1921,
        genre: "Comedy / Drama",
        plot: "The Tramp cares for an abandoned child, but events put that relationship in jeopardy.",
        poster: "https://image.tmdb.org/t/p/original/cvWzCDo3pQyoasvqzRIP7oHK3qn.jpg",
        trailer: "https://www.youtube.com/embed/9pIyRBDpdAM?si=nlO24g7xSXp6Z8MN",
        featured: true
    },
    {
        id: 3,
        title: "Felix in Hollywood",
        year: 1923,
        genre: "Animation",
        plot: "Felix the Cat travels to Hollywood and meets the greatest stars of the silent film era.",
        poster: "https://image.tmdb.org/t/p/original/3P3ztTCe5jL0Rza8m5ZsUT5NhH7.jpg",
        trailer: "https://www.youtube.com/embed/7eSE5hzTyIo",
        featured: false
    },
    {
        id: 4,
        title: "Minnie the Moocher",
        year: 1932,
        genre: "Animation",
        plot: "Betty Boop runs away from home and ends up in a spooky cave with Cab Calloway.",
        poster: "https://image.tmdb.org/t/p/original/k6D27wXkz0hufbi9EtEqRXFXbcm.jpg",
        trailer: "https://www.youtube.com/embed/qFhMuFEtIh4?si=HSH-dyki13YEc6ya",
        featured: false
    },
    {
        id: 5,
        title: "A Trip to the Moon",
        year: 1902,
        genre: "Sci-Fi",
        plot: "A group of astronomers travel to the Moon in a cannon-propelled capsule and explore its surface.",
        poster: "https://image.tmdb.org/t/p/original/acBq3tmTcBAHCjbH7Wi5nt8jnfA.jpg",
        trailer: "https://www.youtube.com/embed/qcyZ70tO9-Q",
        featured: false
    }
];

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
console.log("LibreFlix DB loaded. Total movies: " + movies.length);
loadCatalog();

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