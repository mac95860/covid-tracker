import { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table/Table';
import LineGraph from './components/LineGraph/LineGraph';
import "leaflet/dist/leaflet.css";
import { sortData } from './utilities/util';
import { MenuItem, FormControl, Select, CardContent, Card } from '@material-ui/core';

function App() {
  
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [imgURL, setimgURL] = useState();
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
        console.log(data);
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(5);
        setimgURL(data.countryInfo.flag)
      })
  }
  
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

          {country === 'worldwide' ? <></> :
            <div className = "country__name">
              <h1>{countryInfo.country}</h1>
              <img src = {imgURL} alt = "country's flag" className = "country__name__flag"/>
            </div>
          }      
          

          <div className = "app__stats">
                <InfoBox title = "Coronavirus cases" total = {countryInfo.cases} cases = {countryInfo.todayCases}/>
                <InfoBox title = "Recovered" total = {countryInfo.todayRecovered} cases = {countryInfo.todayRecovered}/>
                <InfoBox title = "Deaths" total = {countryInfo.deaths} cases = {countryInfo.todayDeaths}/>
                {/* vaccinated ? */}
          </div>
          
          <Map
            center = {mapCenter}
            zoom = {mapZoom}
          />
      </div>
      
      <Card className = "app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table  countries = {tableData}/>
          <h3>Worldwide new Cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    
    </div>
  );
}

export default App;
