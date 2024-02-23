const CountryDetails = ({ country }) => {
    return (
        <div>
        <h2>{country.name.common}</h2>
        <p>capital {country.capital}</p>
        <p>area {country.area}</p>
        <h2>Languages</h2>
        <ul>
              {Object.values(country.languages).map((language, index) => (
                <li key={index}>{language}</li>
              ))}
        </ul>
        <img src={country.flags.png} />
      </div>
    )
  }

  export default CountryDetails