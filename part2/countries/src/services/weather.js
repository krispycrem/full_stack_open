import axios from 'axios'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q='

const getWeather = (capital, api_key) => {
    const request = axios.get(`${weatherUrl}${capital}&appid=${api_key}`)
    return request.then(response => response.data)
}

export default { getWeather }