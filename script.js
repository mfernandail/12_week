const btnForm = document.querySelector('.form_btn')
const inputForm = document.querySelector('.form_inputSearch')
const result = document.querySelector('#results')

const pagination = document.querySelector('.pagination')
const prevBtn = document.getElementById('prevBtn')
const nextBtn = document.getElementById('nextBtn')
const pageInfo = document.getElementById('pageInfo')

let currentPage = 1
let totalPages = 1
let currentQuery = ''

btnForm.addEventListener('click', searchMovie)

inputForm.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchMovie(e)
})

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
        : '.imeges/no_found.png'

    const card = document.createElement('article')
    card.classList.add('result_card')

    card.innerHTML = `
      <h1 class="card_title">${movie.Title}</h1>
      <img src=${poster} alt=${movie.Title} class="card_image" onerror="this.onerror=null; this.src='./images/no_found.png';" />
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
