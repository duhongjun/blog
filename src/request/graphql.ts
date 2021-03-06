import axios from 'axios'

export default function(query = '') {
  return () => {
    return axios.post(
      `https://api.github.com/graphql`,
      { query },
      {
        withCredentials: false,
        responseType: 'json',
        headers: {
          Accept: 'application/json;charset=utf-8',
          Authorization: `bearer ${atob('ODE5ZWNhYTYyZDlkNWE5MjAzM2ZjMGQzYjEzOGUyMWM3ODQ1ODJlOA==')}`
        }
      }
    )
  }
}
