import { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table/Table';
import { sortData } from './utilities/util';
import { MenuItem, FormControl, Select, CardContent, Card} from '@material-ui/core';

function App() {
  // https://disease.sh/v3/covid-19/countries
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
// =============================== Set the Default Results to "WorldWide" =============================
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(res => res.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])

  // -----------------------------Get List of Countries-------------------------------------------------
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
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        })
    }
    getCountriesData();
  }, []);
  
// =============================== Set the results to the selected country from the dropdown ===========
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    setCountry(countryCode);
    const url = countryCode === "worldwide" ? 'https://disease.sh/v3/covid-19/countries/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(res => res.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
      })
  }

  //console.log('COUntrY INFO >>>>', countryInfo);
  
  return (
    <div className="app">
      <div className = "app__left">
        
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
                <InfoBox title = "Coronavirus cases" total = {countryInfo.cases} cases = {countryInfo.todayCases}/>
                <InfoBox title = "Recovered" total = {countryInfo.todayRecovered} cases = {countryInfo.todayRecovered}/>
                <InfoBox title = "Deaths" total = {countryInfo.deaths} cases = {countryInfo.todayDeaths}/>
                {/* vaccinated ? */}
          </div>
          
          <Map/>
      </div>
      
      <Card className = "app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table  countries = {tableData}/>
          <h3>Worldwide new Cases</h3>
          {/* Graph */}
        </CardContent>
      </Card>
    
    </div>
  );
}

export default App;
