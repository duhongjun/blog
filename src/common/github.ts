import axios from 'axios'
import CONFIG from 'src/config/config'

const instance = axios.create({
  baseURL: 'https://api.github.com',
  // timeout: 1000 * 10,
  params: {
    client_id: CONFIG.github_client_id,
    client_secret: CONFIG.github_client_secret
  },
  withCredentials: false,
  responseType: 'json',
  headers: { Accept: 'application/json;charset=utf-8' }
})

export default instance
