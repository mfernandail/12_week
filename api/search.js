export default async function (req, res) {
  const { query, page } = req.query
  const API_KEY = process.env.OMDB_API_KEY

  if (!query) {
    return res.status(400).json({ error: 'No query provided' })
  }

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=${page}`
    )
    const data = await response.json()

    if (data.Response === 'False') {
      return res.status(404).json({ error: data.Error })
    }

    return res.status(200).json(data)
  } catch (error) {
    return res.status(400).json({ error: 'Server error' })
  }
}
