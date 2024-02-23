import { useState, useEffect } from 'react'
import weatherService from '../services/weather'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {

    const api_key = import.meta.env.VITE_OPENWEATHERMAP_API_KEY
    const weather_pic_url = 'https://openweathermap.org/img/wn'

    weatherService
    .getWeather(capital, api_key)
        .then(capitalWeather => {
            setWeather(capitalWeather)
        })
    }, [capital])

  return (
    <div>
      <h2>Weather in {capital}</h2>
      {weather ? (
        <>
          <p>temperature {weather.main.temp - 273.15} Celsius</p>
          <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}></img>
          <p>wind {weather.wind.speed} m/s</p>
        </>
      ) : (
        <p>Data weather is loading</p>
      )}
    </div>
  )
}

export default Weather
