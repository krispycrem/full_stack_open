import axios from 'axios'
const baseUrl = 'https://restcountries.com/v3.1/name'

const getAllCountries = (searchCountry) => {
    const request = axios.get(`${baseUrl}/${searchCountry}`)
    return request.then(response => response.data)
}

export default { getAllCountries }