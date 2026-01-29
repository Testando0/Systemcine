const API_KEY = '8265bd1679663a7ea12ac168da84d2e8'; // <-- Cola tua chave aqui!
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
const IMG_SMALL = 'https://image.tmdb.org/t/p/w500';

async function fetchMovies(endpoint) {
  const res = await fetch(`\( {BASE_URL} \){endpoint}?api_key=${API_KEY}&language=pt-BR`);
  return res.json();
}

function createMovieElement(movie) {
  const div = document.createElement('div');
  div.classList.add('movie');
  div.innerHTML = `
    <img src="\( {IMG_SMALL + movie.poster_path}" alt=" \){movie.title || movie.name}">
    <div class="movie-title">${movie.title || movie.name}</div>
  `;
  div.addEventListener('click', () => openPlayer(movie));
  return div;
}

async function loadRow(id, endpoint) {
  const data = await fetchMovies(endpoint);
  const container = document.getElementById(id);
  container.innerHTML = '';
  data.results.slice(0, 10).forEach(movie => {
    container.appendChild(createMovieElement(movie));
  });
}

async function loadHero() {
  const data = await fetchMovies('/trending/movie/week');
  const movie = data.results[0];
  const hero = document.getElementById('hero');
  hero.style.backgroundImage = `url(${IMG_URL + movie.backdrop_path})`;
  hero.innerHTML = `
    <div class="hero-info">
      <h1>${movie.title}</h1>
      <p>${movie.overview.substring(0, 200)}...</p>
      <button class="btn">▶ Assistir Agora</button>
    </div>
  `;
}

// Player (sem ads, usa Video.js)
let player;
function openPlayer(movie) {
  const modal = document.getElementById('playerModal');
  const video = document.getElementById('videoPlayer');

  // Exemplo de link: troca pelo teu embed dublado (VidSrc, SuperEmbed, etc.)
  // Use movie.id ou imdb_id pra gerar link dinâmico
  const streamUrl = `https://embed.vidsrc.me/${movie.imdb_id || movie.id}`; // ou HLS teu: 'https://teucdn/filme.m3u8'

  if (player) player.dispose();
  player = videojs(video, {
    autoplay: false,
    controls: true,
    fluid: true,
    sources: [{ src: streamUrl, type: 'application/x-mpegURL' }]
  });

  modal.style.display = 'flex';
  player.play();
}

// Fecha modal
document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('playerModal').style.display = 'none';
  if (player) player.pause();
});

// Carrega tudo
loadHero();
loadRow('trending', '/trending/movie/week');
loadRow('popular', '/movie/popular');
loadRow('top-rated', '/movie/top_rated');

// Header scroll effect
window.addEventListener('scroll', () => {
  document.querySelector('header').classList.toggle('scrolled', window.scrollY > 100);
});
