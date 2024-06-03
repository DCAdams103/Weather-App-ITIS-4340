import './App.css';
import {useState, useEffect} from 'react';
import {MdChevronRight, MdChevronLeft} from 'react-icons/md';
import Switch from 'react-switch';
import { SearchBar } from './components/SearchBar';
import { SearchResultsList } from './components/SearchResultsList';
import L from 'leaflet'
import './leaflet-openweathermap'
import './leaflet-openweathermap.css'
import 'leaflet/dist/leaflet.css'
import markerIconPng from 'leaflet/dist/images/marker-icon.png'
import {Icon} from 'leaflet'
import ReportMap from './WindyMap'

function App() {

  const [inflate, setInflate] = useState(false);
  const [deflate, setDeflate] = useState(false);
  const [fade, setFade] = useState(false);
  const [text, setText] = useState('View More');
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [currentWeather, setCurrentWeather] = useState({city: '', conditions: '', temp: -99, feelsLike: -99, sunrise: '', sunset: '', gusts: -99, wind: -99});
  const [cards, setCards] = useState([{url: "sunset-icon.png", title: "Title 1", temp: -99}]);
  const [fiveDay, setFiveDay] = useState([]);
  const [checked, setChecked] = useState(false);
  const [unit, setUnit] = useState('imperial');
  const [results, setResults] = useState([]);

  const [showRadar, setShowRadar] = useState(false);
  const [showWindy, setShowWindy] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState("Current Location");

  const [recent, setRecent] = useState([])

  function timeout(delay) {
      return new Promise( res => setTimeout(res, delay) );
  }

  async function showViewMore() {
    
    if(!inflate) {
      setInflate(true);
      setFade(true);
      setText('View Less');
      setDeflate(false);
    } else {
      setDeflate(true);
      setText('View More')
      await timeout(500);
      setFade(false)
      await timeout(500);
      setInflate(false);
      setDeflate(false);
    }

  }

  const slideLeft = () => {
    var slider = document.getElementById('slider');
    slider.scrollLeft = slider.scrollLeft - 200;
  };

  const slideRight = () => {
    var slider = document.getElementById('slider');
    slider.scrollLeft = slider.scrollLeft + 200;
  };

  const wheelScroll = (e) => {
    if(e.deltaY > 0) {
      slideRight();
    } else {
      slideLeft();
    }
  };

  useEffect(() => {

    async function getLocation() {
      if(selectedLocation === "Current Location") {
        navigator.geolocation.getCurrentPosition((position) => {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
          setRecent([...recent, {name: "Current Location", lat: position.coords.latitude, long: position.coords.longitude}])
        });
  
      }
  
    }
  
    getLocation();

  }, []);


  /* -------------------- Grab current weather data -------------------- */
  useEffect(() => {
    if(lat !== 0 && long !== 0) {

      // // Current Weather
      fetch(`${process.env.REACT_APP_EXPRESS_JS_BACKEND_URL}/weather?lat=${lat}&long=${long}&unit=${unit}`)
        .then(res => res.json())
        .then(json => {
          setCurrentWeather({city: json.name, conditions: json.conditions, 
            temp: json.temp, feelsLike: json.feelsLike,
            sunrise: json.sunrise, sunset: json.sunset, gusts: json.gusts, wind: json.wind}); 
        });
      
      // Hourly Forecast
      fetch(`${process.env.REACT_APP_EXPRESS_JS_BACKEND_URL}/forecast?lat=${lat}&long=${long}&unit=${unit}`)
        .then(res => res.json())
        .then(json => {
          
          setCards(json);
          
        })
        .catch(error => console.error('Error:', error));

      // Daily Forecast
      fetch(`${process.env.REACT_APP_EXPRESS_JS_BACKEND_URL}/daily?lat=${lat}&long=${long}&unit=${unit}`)
        .then(res => res.json())
        .then(json => {
          
          setFiveDay(json);
          
        });

    }
  }, [lat, long, unit]);

  function WeatherPicture(props) {
    const conditions = props.conditions;

    if(conditions === "Clear") {
      return <img src="sun-icon.png" className="w-[300px] pl-[100px]" alt='sun-icon' />
    } else if (conditions === "Clouds") {
      return <img src="cloudy-icon.png" className="w-[300px] pl-[100px]" alt='cloudy-icon' />
    } else if (conditions === "Rain") {
      return <img src="rainy-icon.png" className="w-[300px] pl-[100px]" alt='rainy-icon' />
    }

  }

  function ForecastPicture(props) {
    const weatherCode = props.weatherCode;
    if(weatherCode <= 1000 || weatherCode >= 1100 || weatherCode === 1103) {
      return <img src="sun-icon.png" className="w-[100px] pl-[5%] pr-[3%]" alt='sun-icon' />
    } else if (weatherCode === 1101 || weatherCode === 1102 || weatherCode === 1001 ) {
      return <img src="cloudy-icon.png" className="w-[100px] pl-[5%] pr-[3%]" alt='cloudy-icon' />
    } else if (weatherCode <= 4000 || weatherCode >= 4212) {
      return <img src="rainy-icon.png" className="w-[100px] pl-[5%] pr-[3%]" alt='rainy-icon' />
    }
  }

  function ForecastText(props) {
    const weatherCode = props.weatherCode;

    if(weatherCode <= 1000 || weatherCode >= 1100 || weatherCode === 1103) {
      return <h3 className="forecast-text pr-[5%]">Clear</h3>
    } else if (weatherCode === 1101 || weatherCode === 1102 || weatherCode === 1001 ) {
      return <h3 className="forecast-text pr-[5%]">Clouds</h3>
    } else if (weatherCode <= 4000 || weatherCode >= 4212) {
      return <h3 className="forecast-text pr-[5%]">Rainy</h3>
    }

  }

  /* ----------------------------- RADAR Functios ----------------------------- */

  function RadarWindow() {
    return (
      <div style={{backgroundColor: '#A9D0F6'}} className="w-[95vw] h-[95vh] z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="">
          <h3 className="inline float-left pt-[1%] pl-[2%] text-3xl" onClick={() => setShowRadar(false)}>{"<-"} Back</h3>
          <h1 className="inline text-center text-5xl pr-[10%]">Radar</h1>
          <div className="flex justify-center h-[80vh] ml-[10%] mt-[10px] w-[80vw]" id='map'>
            <></>
          </div>
        </div>
      </div>
    );
  }

  function mapData() {
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18, attribution: '[insert correct attribution here!]' });

    var clouds = L.OWM.clouds({showLegend: false, opacity: 1, appId: 'ac6430ad27a7fb708d37dd474543b091'});
    var precipitation = L.OWM.precipitation({showLegend: false, opacity: 0.75, appId: 'ac6430ad27a7fb708d37dd474543b091'});
    var temperature = L.OWM.temperature({showLegend: false, opacity: 0.75, appId: 'ac6430ad27a7fb708d37dd474543b091'});

    var map = L.map('map', { center: new L.LatLng(lat, long), zoom: 12, layers: [osm], scrollWheelZoom: false });
    var baseMaps = { "OSM Standard": osm };
    var overlayMaps = { "Clouds": clouds, "Precipitation": precipitation, "Temperature": temperature };
    var marker = L.marker([lat, long], {icon: new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}).addTo(map);
    var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
    map.addLayer(clouds);
    map.addLayer(precipitation);
  }

  async function showRadarHandler() {
    setShowRadar(!showRadar);
    await timeout(500);
    mapData();
  }

  function handleChange() {
    setChecked(!checked);

    if(unit === 'imperial') {
      setUnit('metric');
    } else {
      setUnit('imperial');
    }

  }

  /* ----------------------------- Windy Map Functios ----------------------------- */
  
  async function showWindyMapHandler() {
    setShowWindy(!showWindy); 
  }

  function WindyMap() {
    return (
      <div style={{backgroundColor: '#A9D0F6'}} className="w-[95vw] h-[95vh] z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="">
          <h3 className="inline float-left pt-[1%] pl-[2%] text-3xl" onClick={() => setShowWindy(false)}>{"<-"} Back</h3>
          <h1 className="inline text-center text-5xl pr-[10%]">Windy</h1>
          <ReportMap lat={lat} long={long} />
        </div>
        
      </div>
    )
  }



  return (
    <>
      {/* ------------ Import font ------------ */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap" rel="stylesheet" />

      </head>

      <div className="App">
        {showRadar && <RadarWindow />}
        {lat !== 0 && long !== 0 && showWindy && <WindyMap />}
        <div className="grid-container">

            {/* ------------ Left Column ------------ */}
            <div className="grid-item-1">
              {/* ------------ Logo and Title ------------ */}
              <div className="logo-container">
                <img src='skywatch-logo.png' className="logo" alt="logo" />
                <h1 className='title'>SkyWatch</h1>
              </div>

              <Switch onChange={handleChange} onColor='#8EB1D3' offColor='#D9D9D9' checkedIcon={<h3 className="pl-[28%]">C°</h3>} uncheckedIcon={<h3 className="pl-[28%]">F°</h3>}  checked={checked} />
             
              <div className="search-bar-container">
                <SearchBar setResults={setResults}/>
                <SearchResultsList results={results} lat={setLat} long={setLong} location={setSelectedLocation} recent={recent} setRecent={setRecent} />
              </div>

              <div className='my-[5%]'>
                <h3 className="title">Recent Locations:</h3>
                <ul>
                  {recent.map((location, index) => (
                    <li key={index} onClick={()=>{
                      setLat(location.lat);
                      setLong(location.long);
                      setSelectedLocation(location.name);
                    
                    }}>- {location.name}</li>
                  ))}
                </ul>
              </div>

            </div>
            
            {/* ------------ Middle Column ------------ */}
            <div className="grid-item-2">
              
              {/* ------------ Location Information ------------ */}
              <div className="location-container">
                <div className="float-left w-[100%]">
                  <div className="float-left">
                    {!currentWeather.city ? <h1 className="location-title float-left">Loading...</h1> : <h1 className="location-title float-left">{currentWeather.city}</h1> }
                    {!currentWeather.conditions ? <h3 className="precipitation">Loading...</h3> : <h3 className="percipitation">{currentWeather.conditions}</h3> }
                    {currentWeather.temp === -99 ? <h1 className="temperature">Loading...</h1> : <h1 className="temperature">{currentWeather.temp}°</h1>}
                  </div>
                  
                  {currentWeather.conditions && <WeatherPicture conditions={currentWeather.conditions} />}
                  
                </div>
                <br className="clear-both" />
              </div>

              {/* ------------ Hourly Forecast ------------ */}
              <div className="hourly-forecast-container">
                <div className="hourly-forecast-title-container">

                  <h3 className="hourly-forecast-title">Hourly Forecast</h3>

                  {/* ------------ View Radar ------------ */}
                  <div className="view-radar-container" onClick={() => {
                      showRadarHandler();

                      }}>
                    <h3 className="view-radar-title">View Radar</h3>
                    <img src='radar-icon.png' className="radar-icon" alt="radar-icon" />
                  </div>

                </div>

                <div className="relative flex items-center">
                  {cards.length > 39 && (
                    <>
                    <MdChevronLeft className="opacity-50 cursor-pointer hover:opacity-100" size={40} onClick={slideLeft}  />
                    <div id="slider" className="w-full h-full overflow-x-scroll scroll overscroll-none whitespace-nowrap scroll-smooth scrollbar-hide" onWheel={(e) => wheelScroll(e)}>
                      {cards.map((card, index) => (
                        <div className="inline-block px-[20px] pt-[15px]">
                          <h3 className="">{card.hour}</h3>
                          <img className="w-[75px] inline-block p-2 cursor-pointer hover:scale-105 ease-in-out duration-300 p-0" src={card.url} alt='/' />
                          <h3 className="">{card.temp}°</h3>
                        </div>
                      ))}
                    </div>
                    <MdChevronRight className="opacity-50 cursor-pointer hover:opacity-100" size={40} onClick={slideRight} />
                    </>
                  )}
                  
                </div>

              </div>

              {/* ------------ The Two Extra Boxes ------------ */}
              <div className="extras-container">

                {/* ------------ The left extra box ------------ */}
                <div className={inflate ? deflate ? "extra-1-deflate" : "extra-1-expand" : "extra-1"}>

                  <div className="extra-content-grid-container">

                    <div className="spacer"></div>
                    {/* ------------ Feels Like information ------------ */}
                    <div className="extra-content-container">
                      <img src='temperature-icon.png' className="temperature-icon" alt="temperature-icon" />
                      <div>
                        <h3 className="extra-content-title">Feels Like</h3>
                        {currentWeather.feelsLike === -99 ? <h1 className="extra-content-subtitle">Loading...</h1> : <h1 className="extra-content-subtitle">{currentWeather.feelsLike}°</h1> }
                      </div>

                      {(fade) && (
                        <div className={inflate ? deflate ? "extra-content-container-col-2-row-1-fade-out" : "extra-content-container-col-2-row-1-fade-in" : "extra-content-container-col-2-row-1"}>
                          <img src='wind-icon.png' className="wind-icon" alt="wind-icon" />

                          <div>
                            <h3 className="extra-content-title-wind">Wind</h3>
                          </div>
                        </div>
                      )}
                      
                    </div>

                    {/* ------------ Sunrise Information ------------ */}
                    <div className="extra-content-container">
                      <img src='sunrise-icon.png' className="sunrise-sunset-icon" alt="sunrise-icon" />
                      
                      <div>
                        <h3 className="extra-content-title">Sunrise</h3>
                        {currentWeather.sunrise === '' ? <h1 className="extra-content-subtitle">Loading...</h1> : <h1 className="extra-content-subtitle">{currentWeather.sunrise}</h1> }
                        {/* <h1 className="extra-content-subtitle">7:03am</h1> */}
                      </div>

                      {(fade) && (
                        <div className={inflate ? deflate ? "extra-content-container-col-2-row-2-fade-out" : "extra-content-container-col-2-row-2-fade-in" : "extra-content-container-col-2-row-2"}>
                          {currentWeather.wind === -99 ? <h1 className='wind-speed-text'>Loading...</h1> : <h1 className='wind-speed-text'>{currentWeather.wind}</h1> }

                          <div className="wind-speed-container">
                            <h3 className="wind-speed-subtitle">mph</h3>
                            <br/>
                            <h3 className="wind-speed-subtitle">Wind</h3>
                          </div>
                        </div>
                        
                      )}

                      <div className="view-more-container">
                        <h3 className="view-more-text">{text}</h3>
                        
                        <img src='arrow-icon.png' className={inflate ? deflate ? "view-more-icon-rotate-b" : "view-more-icon-rotate-f" : "view-more-icon"} onClick={showViewMore} alt='arrow-icon'></img>
                      </div>
                      
                    </div>

                    {/* ------------ Sunrise Information ------------ */}
                    <div className="extra-content-container">
                      <img src='sunset-icon.png' className="sunrise-sunset-icon" alt="sunrise-icon" />
                      <div>
                        <h3 className="extra-content-title">Sunset</h3>
                        {currentWeather.sunset === '' ? <h1 className="extra-content-subtitle">Loading...</h1> : <h1 className="extra-content-subtitle">{currentWeather.sunset}</h1> }
                        </div>

                      {(fade) &&(
                        <div className={inflate ? deflate ? "extra-content-container-col-2-row-2-fade-out" : "extra-content-container-col-2-row-2-fade-in" : "extra-content-container-col-2-row-2"}>
                          {currentWeather.gusts === -99 ? <h1 className='wind-speed-text'>Loading...</h1> : <h1 className='wind-speed-text'>{currentWeather.gusts}</h1> }

                          <div className="wind-gusts-container">
                            <h3 className="wind-speed-subtitle">mph</h3>
                            <br/>
                            <h3 className="wind-speed-subtitle">Gusts</h3>
                          </div>
                        </div>
                        
                      )}

                    </div>

                  </div>

                </div>
                
                {/* ------------ Right extra box ------------ */}
                <div className={inflate ? deflate ? "extra-2-inflate" : "extra-2-deflate" : "extra-2"}>
                    
                    {!fade && (
                     <>
                        <div className="extra-content-container">
                          <div className={inflate ? deflate ? "extra-2-content-fade-in" : "extra-2-content-fade-out" : "extra-2-content"}>
                            <img src='wind-icon.png' className="wind-icon" alt="wind-icon" />

                            <div>
                              <h3 className="extra-content-title-wind">Wind</h3>
                            </div>
                          </div>
                        </div>

                        <div className="extra-content-container">
                          
                          <div className={inflate ? deflate ? "extra-2-content-fade-in" : "extra-2-content-fade-out" : "extra-2-content"}>
                            {currentWeather.gusts === -99 ? <h1 className='wind-speed-text'>Loading...</h1> : <h1 className='wind-speed-text'>{currentWeather.gusts}</h1> }

                            <div className="wind-gusts-container">
                              {unit === 'imperial' ? <h3 className="wind-speed-subtitle">mph</h3> : <h3 className="wind-speed-subtitle">km/h</h3>}
                              <br/>
                              <h3 className="wind-speed-subtitle">Gusts</h3>
                            </div>
                          </div>
                            

                          <div className="view-map-container" onClick={() => showWindyMapHandler()}>
                            <h3 className="view-map-text">View Map</h3>
                            
                            <img src='arrow-icon.png' className={inflate ? deflate ? "view-more-icon-rotate-b" : "view-more-icon-rotate-f" : "view-more-icon"} alt='arrow-icon'></img>
                          </div>

                        </div>

                        <div className="extra-content-container">

                          <div className={inflate ? deflate ? "extra-2-content-fade-in" : "extra-2-content-fade-out" : "extra-2-content"}>
                              {currentWeather.wind === -99 ? <h1 className='wind-speed-text'>Loading...</h1> : <h1 className='wind-speed-text'>{currentWeather.wind}</h1> }

                            <div className="wind-speed-container">
                              {unit === 'imperial' ? <h3 className="wind-speed-subtitle">mph</h3> : <h3 className="wind-speed-subtitle">km/h</h3>}
                                <br/>
                                <h3 className="wind-speed-subtitle">Wind</h3>
                              </div>
                            </div>

                        </div>
                     </> 
                    )}
                    
                
                </div>
                
              </div>

            </div>

            {/* ------------ Right Column ------------ */}
            <div className="grid-item-3">
                
              {/* ------------ 5-Day Forecast Title Bar ------------ */}
              <div className="seven-day-title-container">
                <h3 className="seven-day-title">5-Day Forecast</h3>
                <h3 className="seven-day-hi-lo">Hi/Lo</h3>
              </div>
              
              <div className="">
                {fiveDay.map((day, index) => (
                  <div className="forecast-row border-solid border-0 border-b border-blue-900 pb-[3%] pt-[3%]">
                    <h3 className="forecast-text">{day.day}</h3>
                    <ForecastPicture weatherCode={day.weatherCode} />
                    {/* <img src='cloudy-icon.png' className="w-[100px] pl-[5%] pr-[3%]" alt='cloudy-icon' /> */}
                    <ForecastText weatherCode={day.weatherCode} />
                    <h3 className="forecast-text pl-[15%]">{day.hi}° / {day.lo}°</h3>
                    <br className="clear-both" />
                  </div>
                ))}
              </div>
              
            
            </div>

          </div>
      </div>

    </>

  );
}

export default App;
