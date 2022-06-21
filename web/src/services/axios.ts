import axios from 'axios'
import { parseCookies } from 'nookies'
import { EMED_TOKEN } from '../utils'

export function getAPIClient(ctx?: any) {
  const { [EMED_TOKEN]: token } = parseCookies(ctx)

  const api = axios.create({
    baseURL:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333'
        : 'https://emed-service.herokuapp.com/',
  })

  //shows the information for each request
  // api.interceptors.request.use((config) => {
  //   console.log(config);
  //   return config;
  // });

  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  return api
}
