import { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './components/InfoBox';
import { MenuItem, FormControl, Select} from '@material-ui/core';

function App() {
  // https://disease.sh/v3/covid-19/countries
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ))
          setCountries(countries);
        })
    }
    getCountriesData();
  }, [])

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    setCountry(countryCode);
  }
  
  return (
    <div className="App">
      <div className = "app__header">
        <h1>COVID 19 TRACKER</h1>
        <FormControl className = "app__dropdown">
          <Select variant = "outlined" onChange = {onCountryChange} value = {country}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {
              countries.map(country => (
                <MenuItem value = {country.value}>{country.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </div>

      <div className = "app__stats">
            <InfoBox/>
      </div>
      
   
    {/* Table */}
    {/* Graph */}
    {/* Map */}
    
    </div>
  );
}

export default App;
