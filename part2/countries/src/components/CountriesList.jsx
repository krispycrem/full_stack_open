const CountriesList = ({ country, handleCountry }) => {
    return (
      <li>
        {country.name.common} 
        <button onClick={() => handleCountry(country)}>show</button>
      </li>
    )
  }
  
  export default CountriesList