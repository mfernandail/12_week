const btnForm = document.querySelector('.form_btn')
const inputForm = document.querySelector('.form_inputSearch')
const result = document.querySelector('#results')
const favorites = document.querySelector('#favorites')
const titleForm = document.querySelector('main h1')
const changeView = document.querySelector('#changeView')

const formSearch = document.querySelector('#form_search')

const pagination = document.querySelector('.pagination')
const prevBtn = document.getElementById('prevBtn')
const nextBtn = document.getElementById('nextBtn')
const pageInfo = document.getElementById('pageInfo')

let currentPage = 1
let totalPages = 1
let currentQuery = ''

let favoritesLocalStorage =
  JSON.parse(localStorage.getItem('moviesFavorites')) || []

titleForm.addEventListener('click', () => {
  result.innerHTML = ''
  pagination.classList.add('hideBtn')
  inputForm.value = ''
})

btnForm.addEventListener('click', searchMovie)

inputForm.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchMovie(e)
})

changeView.addEventListener('click', changeViewFn)

result.addEventListener('click', addFn)
favorites.addEventListener('click', remFn)

function changeViewFn(e) {
  if (e.target.value === 'Favorites') {
    favorites.classList.remove('hide_resultFav')
    result.classList.add('hide_resultFav')
    formSearch.classList.add('hide_resultFav')
    pagination.classList.add('hide_resultFav')

    e.target.value = 'Search movies'

    createCardFavorites()
    // favoritesLocalStorage.forEach((fav) => {
    //   const card = document.createElement('article')
    //   card.classList.add('result_card')

    //   card.innerHTML = `
    //     <h1 class="card_title">${fav.title}</h1>
    //     <img src=${fav.poster} alt=${fav.title} class="card_image" onerror="this.onerror=null; this.src='./images/no_found.png';" />
    //     <a href="#" data-id=${fav.imdbID} class="addRem">Remove</a>
    //   `
    //   favorites.appendChild(card)
    // })
  } else {
    e.target.value = 'Favorites'
    favorites.classList.add('hide_resultFav')
    result.classList.remove('hide_resultFav')
    formSearch.classList.remove('hide_resultFav')
    pagination.classList.remove('hide_resultFav')
  }
}

function createCardFavorites() {
  favorites.innerHTML = ''
  favoritesLocalStorage.forEach((fav) => {
    const card = document.createElement('article')
    card.classList.add('result_card')

    card.innerHTML = `
        <h1 class="card_title">${fav.title}</h1>
        <img src=${fav.poster} alt=${fav.title} class="card_image" onerror="this.onerror=null; this.src='./images/no_found.png';" />
        <a href="#" data-id=${fav.imdbID} class="addRem">Remove</a>
      `
    favorites.appendChild(card)
  })
}

function remFn(e) {
  e.preventDefault()
  const movie = e.target.parentElement

  if (e.target.classList.contains('addRem')) {
    const imdbID = movie.querySelector('a').getAttribute('data-id')
    console.log(imdbID)

    favoritesLocalStorage = favoritesLocalStorage.filter(
      (movie) => movie.imdbID !== imdbID
    )

    localStorage.setItem(
      'moviesFavorites',
      JSON.stringify(favoritesLocalStorage)
    )

    createCardFavorites()
  }
}

function addFn(e) {
  e.preventDefault()

  const movie = e.target.parentElement

  const existFav = favoritesLocalStorage.some(
    (fav) => fav.imdbID === movie.querySelector('a').getAttribute('data-id')
  )

  if (existFav) return

  if (e.target.classList.contains('addFav')) {
    const poster =
      movie.querySelector('img').src && movie.querySelector('img').src !== 'N/A'
        ? movie.querySelector('img').src
        : './imeges/no_found.png'

    const infoMovie = {
      title: movie.querySelector('h1').textContent,
      poster: poster, //movie.querySelector('img').src,
      imdbID: movie.querySelector('a').getAttribute('data-id'),
    }
    favoritesLocalStorage = [...favoritesLocalStorage, infoMovie]

    localStorage.setItem(
      'moviesFavorites',
      JSON.stringify(favoritesLocalStorage)
    )
  }
}

function searchMovie(e) {
  e.preventDefault()

  const movie = inputForm.value.trim()
  if (!movie) return

  currentQuery = movie
  currentPage = 1
  fetchMovie(currentQuery, currentPage)
}

const isLocalDev =
  location.hostname === '127.0.0.1' || location.hostname === 'localhost'

async function fetchMovie(title, page = 1) {
  try {
    const url = isLocalDev
      ? `https://www.omdbapi.com/?apikey=${API_KEY}&s=${title}&page=${page}`
      : `/api/search?query=${encodeURIComponent(title)}&page=${page}`

    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`Error de red: ${res.status}`)
    }

    const data = await res.json()

    if (data.Response === 'False') {
      result.innerHTML = `<p>No results were found for <strong>${title}</strong>.</p>`
      pagination.classList.add('hideBtn')
      pageInfo.textContent = ''
      prevBtn.disabled = true
      nextBtn.disabled = true

      return
    }

    createCardMovie(data.Search)

    totalPages = Math.ceil(data.totalResults / 10)

    updatePagination()

    pagination.classList.remove('hideBtn')
  } catch (e) {
    console.error('Error al buscar película:', e)
    result.innerHTML = `<p>Error loading results. Please try again later.</p>`
    pagination.classList.add('hideBtn')
  }
}

function createCardMovie(data) {
  result.innerHTML = ''
  data.forEach((movie) => {
    const poster =
      movie.Poster && movie.Poster !== 'N/A'
        ? movie.Poster
        : './imeges/no_found.png'

    const card = document.createElement('article')
    card.classList.add('result_card')

    card.innerHTML = `
      <h1 class="card_title">${movie.Title}</h1>
      <img src=${poster} alt=${movie.Title} class="card_image" onerror="this.onerror=null; this.src='./images/no_found.png';" />
      <a href="#" data-id=${movie.imdbID} class="addFav">❤️</a>
      `
    result.appendChild(card)
  })
}

function updatePagination() {
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`
  prevBtn.disabled = currentPage === 1
  nextBtn.disabled = currentPage === totalPages
}

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--
    fetchMovie(currentQuery, currentPage)
    console.log('-')
  }
})

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++
    fetchMovie(currentQuery, currentPage)
    console.log('+')
  }
})
