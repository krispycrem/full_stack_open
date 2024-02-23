import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import CountryDetails from './components/CountryDetails'
import CountriesList from './components/CountriesList'
import Weather from './components/Weather'
import countryService from './services/countries'


const App = () => {
  const [searchCountry, setSearchCountry] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (searchCountry === '') {
      setCountries([])
      setSelectedCountry(null)
      return
    }
    countryService
    .getAllCountries(searchCountry)
      .then(initialCountries => {
        if (initialCountries.length > 10) {
          addNotification('Too many matches, specify another filter')
          setCountries([])
          setSelectedCountry(null)
        } else if (initialCountries.length > 1) {
          setCountries(initialCountries)
          setSelectedCountry(null)
        } else if (initialCountries.length === 1) {
          setCountries([])
          setSelectedCountry(initialCountries[0])
        } else {
          setCountries([])
          setSelectedCountry(null)
        }
      })
  }, [searchCountry])

  const addNotification = (message, duration = 2000) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, duration)
  }

  const handleSearchChange = (event) => {
    setSearchCountry(event.target.value)
  }

  const handleCountry = (country) => {
    setSelectedCountry(country)
  }
  
  return (
    <div>
      <div>
        <label htmlFor="searchInput">find countries </label>
        <input
          type="text"
          id="searchInput"
          value={searchCountry}
          onChange={handleSearchChange}
        />
      </div>
      {notification && <Notification message={notification} />}
      {countries.length > 0 && (
        <div>
          <ul>
            {countries.map((country) => (
              <CountriesList key={country.name.common} country={country} handleCountry={handleCountry} />
            ))}
          </ul>
        </div>
      )}
      {selectedCountry && (
        <div>
          <CountryDetails country={selectedCountry} />
          <Weather capital={selectedCountry.capital} />
        </div>
      )}
    </div>
  )}
  

export default App
