// CONFIGURAÇÕES
// 1. Crie uma conta em https://www.themoviedb.org/
// 2. Vá em Configurações > API e gere uma chave.
// 3. Cole a chave abaixo entre as aspas:
const API_KEY = '8265bd1679663a7ea12ac168da84d2e8'; 

const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
const IMG_SMALL = 'https://image.tmdb.org/t/p/w500';

// Verifica se a chave foi configurada
if (API_KEY === 'SUA_CHAVE_AQUI') {
    alert('ERRO: Você precisa colocar sua chave da API do TMDB no arquivo script.js!');
}

// Função para buscar dados
async function fetchMovies(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=pt-BR`);
    if (!res.ok) throw new Error('Falha na requisição');
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    return { results: [] };
  }
}

// Cria o elemento visual do filme
function createMovieElement(movie) {
  const div = document.createElement('div');
  div.classList.add('movie');
  
  // Tratamento caso não tenha imagem
  const imgPath = movie.poster_path ? IMG_SMALL + movie.poster_path : 'https://via.placeholder.com/200x300?text=Sem+Imagem';
  
  div.innerHTML = `
    <img src="${imgPath}" alt="${movie.title || movie.name}">
    <div class="movie-title">${movie.title || movie.name}</div>
  `;
  
  div.addEventListener('click', () => openPlayer(movie));
  return div;
}

// Carrega as linhas de filmes
async function loadRow(id, endpoint) {
  const data = await fetchMovies(endpoint);
  const container = document.getElementById(id);
  container.innerHTML = '';
  
  if(data.results) {
      data.results.forEach(movie => {
        container.appendChild(createMovieElement(movie));
      });
  }
}

// Carrega o Banner Principal (Hero)
async function loadHero() {
  const data = await fetchMovies('/trending/movie/week');
  if (data.results && data.results.length > 0) {
      // Pega um filme aleatório dos top 5 para variar o banner
      const randomIndex = Math.floor(Math.random() * 5);
      const movie = data.results[randomIndex];
      
      const hero = document.getElementById('hero');
      const heroContent = document.getElementById('hero-content');
      
      hero.style.backgroundImage = `url(${IMG_URL + movie.backdrop_path})`;
      
      // Limita o texto da descrição
      const overview = movie.overview ? movie.overview.substring(0, 150) + '...' : 'Descrição indisponível.';

      hero.innerHTML = `
        <div class="hero-info">
          <h1>${movie.title}</h1>
          <p>${overview}</p>
          <button class="btn" id="heroBtn">▶ Assistir Agora</button>
        </div>
      `;

      // Adiciona o evento de clique no botão criado dinamicamente
      document.getElementById('heroBtn').addEventListener('click', () => openPlayer(movie));
  }
}

// --- PLAYER LOGIC --- //

function openPlayer(movie) {
  const modal = document.getElementById('playerModal');
  const iframe = document.getElementById('videoFrame');

  // URL DE EMBED (Usando SuperEmbed ou VidSrc como exemplo)
  // Nota: Isso funciona melhor para filmes. Séries precisam de Temporada/Episódio.
  // API Exemplo: https://vidsrc.to/embed/movie/{tmdb_id}
  
  const embedUrl = `https://vidsrc.xyz/embed/movie/${movie.id}`;
  
  iframe.src = embedUrl;
  
  modal.style.display = 'flex';
  // Pequeno delay para animação CSS
  setTimeout(() => modal.classList.add('show'), 10);
  document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
}

// Fechar Modal
document.querySelector('.close').addEventListener('click', closeModal);
document.getElementById('playerModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('playerModal')) {
        closeModal();
    }
});

function closeModal() {
  const modal = document.getElementById('playerModal');
  const iframe = document.getElementById('videoFrame');
  
  modal.classList.remove('show');
  setTimeout(() => {
      modal.style.display = 'none';
      iframe.src = ''; // Para o vídeo limpando o src
      document.body.style.overflow = 'auto'; // Destrava o scroll
  }, 300);
}

// Inicialização
loadHero();
loadRow('trending', '/trending/movie/week');
loadRow('popular', '/movie/popular');
loadRow('top-rated', '/movie/top_rated');

// Efeito Scroll no Header
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  header.classList.toggle('scrolled', window.scrollY > 50);
});
