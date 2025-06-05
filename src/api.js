import axios from 'axios'

const API_KEY = 'd2dec425e1747a8bbe998fe7fe10ed0a'
const BASE_URL = 'https://api.themoviedb.org/3'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'ru-RU',
  },
})

export const searchMovies = async (query, page) => {
  const response = await axiosInstance.get('/search/movie', {
    params: {
      query,
      page,
    }
  })
  return response.data
}

export const getMovieDetails = async (id) => {
  const response = await axiosInstance.get(`/movie/${id}`)
  return response.data
}

export const getPopularMovies = async () => {
  const response = await axiosInstance.get('/movie/popular')
  return response.data.results
}
