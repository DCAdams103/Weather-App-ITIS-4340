import logo from './logo.svg';
import './App.css';
import {useState, useRef, useEffect} from 'react';
import {motion, useTransform, useScroll} from 'framer-motion';
import {MdChevronRight, MdChevronLeft} from 'react-icons/md';
import Switch from 'react-switch';

function App() {

  const [inflate, setInflate] = useState(false);
  const [deflate, setDeflate] = useState(false);
  const [fade, setFade] = useState(false);
  const [text, setText] = useState('View More');
  const [selected, setSelected] = useState([]);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const[currentWeather, setCurrentWeather] = useState({city: '', conditions: '', temp: -99, feelsLike: -99, sunrise: '', sunset: '', gusts: -99, wind: -99});
  const [cards, setCards] = useState([{url: "sunset-icon.png", title: "Title 1", temp: -99}]);
  const [fiveDay, setFiveDay] = useState([{day: "Monday", hi: -99, lo: -99, weatherCode: 1001},{day: "Monday", hi: -99, lo: -99, weatherCode: 1001},{day: "Monday", hi: -99, lo: -99, weatherCode: 1001}, {day: "Monday", hi: -99, lo: -99, weatherCode: 1001},{day: "Monday", hi: -99, lo: -99, weatherCode: 1001},{day: "Monday", hi: -99, lo: -99, weatherCode: 1001}]);
  const [checked, setChecked] = useState(false);
  const [unit, setUnit] = useState('imperial');

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

  function showViewMap() {
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

  const createHours = () => {

    var hours = [];
    var currDate = new Date();
    var currHour = new Date().toLocaleString('en-US', {hour: 'numeric', hourCycle: 'h12'});
    hours.push(currHour);

    for(var i = parseInt(currHour); i < parseInt(currHour) + 12; i++) {
      currDate.setTime(currDate.getTime() + 60*60*1000);
      hours.push(currDate.toLocaleString('en-US', {hour: 'numeric', hourCycle: 'h12'}));
    }

    return hours;
  };

  const [hours, setHours] = useState([]);

  async function getLocation() {

    navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });

  };

  getLocation();


  {/* -------------------- Grab current weather data -------------------- */}
  useEffect(() => {
    if(lat != 0 && long != 0) {
      let hoursArr = [];
      let tempCards = [];

      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=${unit}&appid=e7d090a36c9c0d105b9c70f0906f9592`)
      .then(response => response.json())
      .then(json => {
        let sunrise = new Date(json.sys.sunrise * 1000).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hourCycle: 'h12'});
        let sunset = new Date(json.sys.sunset * 1000).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hourCycle: 'h12'});
        setCurrentWeather({city: json.name, conditions: json.weather[0].main, 
                          temp: json.main.temp.toFixed(0), feelsLike: json.main.feels_like.toFixed(0),
                          sunrise: sunrise, sunset: sunset, gusts: json.wind.gust.toFixed(0), wind: json.wind.speed.toFixed(0)}); 
      })
      .catch(error => console.error('Error:', error));

      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=${unit}&appid=e7d090a36c9c0d105b9c70f0906f9592`)
      .then(response => response.json())
      .then(json => { 
        json.list.forEach(element => {
          let d = new Date(element.dt_txt);
          hoursArr.push(d.toLocaleString('en-US', {hour: 'numeric', hourCycle: 'h12'}));

          if(element.weather[0].main == "Clear") {
            tempCards.push({url: "sun-icon.png", title: "Clear", temp: element.main.temp.toFixed(0)});
          } else if (element.weather[0].main == "Clouds") {
            tempCards.push({url: "cloudy-icon.png", title: "Cloudy", temp: element.main.temp.toFixed(0)});
          } else if (element.weather[0].main == "Rain") {
            tempCards.push({url: "rainy-icon.png", title: "Rainy", temp: element.main.temp.toFixed(0)});
          }

          setCards(tempCards);

        })
      })
      .then(setHours(hoursArr))
      .catch(error => console.error('Error:', error));

      const options = {method: 'GET', headers: {accept: 'application/json'}};
      console.log('test');
      // fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${lat},${long}&timesteps=daily&units=imperial&apikey={API_KEY}`, options)
      //   .then(response => response.json())
      //   .then(json => {
      //     console.log(json);
      //     let tempFiveDay = [];

      //     json.timelines.daily.forEach(element => {
      //       let d = new Date(element.time);
      //       tempFiveDay.push({day: d.toLocaleString('en-US', {weekday: 'short'}), hi: element.values.temperatureMax.toFixed(0), lo: element.values.temperatureMin.toFixed(0), weatherCode: element.values.weatherCodeMax});
      //     });

      //     console.log(tempFiveDay);
      //     setFiveDay(tempFiveDay);

      //   })
      //   .catch(err => console.error(err));

    }
  }, [lat, long, unit]);

  function WeatherPicture(props) {
    const conditions = props.conditions;

    if(conditions == "Clear") {
      return <img src="sun-icon.png" className="w-[300px] pl-[100px]" alt='sun-icon' />
    } else if (conditions == "Clouds") {
      return <img src="cloudy-icon.png" className="w-[300px] pl-[100px]" alt='cloudy-icon' />
    } else if (conditions == "Rain") {
      return <img src="rainy-icon.png" className="w-[300px] pl-[100px]" alt='rainy-icon' />
    }

  }

  function ForecastPicture(props) {
    const weatherCode = props.weatherCode;
    if(weatherCode <= 1000 || weatherCode >= 1100 || weatherCode == 1103) {
      return <img src="sun-icon.png" className="w-[100px] pl-[5%] pr-[3%]" alt='sun-icon' />
    } else if (weatherCode == 1101 || weatherCode == 1102 || weatherCode == 1001 ) {
      return <img src="cloudy-icon.png" className="w-[100px] pl-[5%] pr-[3%]" alt='cloudy-icon' />
    } else if (weatherCode <= 4000 || weatherCode >= 4212) {
      return <img src="rainy-icon.png" className="w-[100px] pl-[5%] pr-[3%]" alt='rainy-icon' />
    }
  }

  function ForecastText(props) {
    const weatherCode = props.weatherCode;

    if(weatherCode <= 1000 || weatherCode >= 1100 || weatherCode == 1103) {
      return <h3 className="forecast-text pr-[5%]">Clear</h3>
    } else if (weatherCode == 1101 || weatherCode == 1102 || weatherCode == 1001 ) {
      return <h3 className="forecast-text pr-[5%]">Clouds</h3>
    } else if (weatherCode <= 4000 || weatherCode >= 4212) {
      return <h3 className="forecast-text pr-[5%]">Rainy</h3>
    }

  }

  function handleChange() {
    setChecked(!checked);

    if(unit == 'imperial') {
      setUnit('metric');
    } else {
      setUnit('imperial');
    }

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

        <div className="grid-container">

            {/* ------------ Left Column ------------ */}
            <div className="grid-item-1">
              {/* ------------ Logo and Title ------------ */}
              <div className="logo-container">
                <img src='skywatch-logo.png' className="logo" alt="logo" />
                <h1 className='title'>SkyWatch</h1>
              </div>

              <Switch onChange={handleChange} onColor='#8EB1D3' offColor='#D9D9D9' checkedIcon={<h3 className="pl-[28%]">C°</h3>} uncheckedIcon={<h3 className="pl-[28%]">F°</h3>}  checked={checked} />

            </div>
            
            {/* ------------ Middle Column ------------ */}
            <div className="grid-item-2">
              
              {/* ------------ Location Information ------------ */}
              <div className="location-container">
                <div className="float-left w-[100%]">
                  <div className="float-left">
                    {!currentWeather.city ? <h1 className="location-title float-left">Loading...</h1> : <h1 className="location-title float-left">{currentWeather.city}</h1> }
                    {!currentWeather.conditions ? <h3 className="conditions">Loading...</h3> : <h3 className="percipitation">{currentWeather.conditions}</h3> }
                    {currentWeather.temp == -99 ? <h1 className="temperature">Loading...</h1> : <h1 className="temperature">{currentWeather.temp}°</h1>}
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
                  <div className="view-radar-container">
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
                          <h3 className="">{hours[index]}</h3>
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
                        {currentWeather.feelsLike == -99 ? <h1 className="extra-content-subtitle">Loading...</h1> : <h1 className="extra-content-subtitle">{currentWeather.feelsLike}°</h1> }
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
                        {currentWeather.sunrise == '' ? <h1 className="extra-content-subtitle">Loading...</h1> : <h1 className="extra-content-subtitle">{currentWeather.sunrise}</h1> }
                        {/* <h1 className="extra-content-subtitle">7:03am</h1> */}
                      </div>

                      {(fade) && (
                        <div className={inflate ? deflate ? "extra-content-container-col-2-row-2-fade-out" : "extra-content-container-col-2-row-2-fade-in" : "extra-content-container-col-2-row-2"}>
                          {currentWeather.wind == -99 ? <h1 className='wind-speed-text'>Loading...</h1> : <h1 className='wind-speed-text'>{currentWeather.wind}</h1> }

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
                        {currentWeather.sunset == '' ? <h1 className="extra-content-subtitle">Loading...</h1> : <h1 className="extra-content-subtitle">{currentWeather.sunset}</h1> }
                        </div>

                      {(fade) &&(
                        <div className={inflate ? deflate ? "extra-content-container-col-2-row-2-fade-out" : "extra-content-container-col-2-row-2-fade-in" : "extra-content-container-col-2-row-2"}>
                          {currentWeather.gusts == -99 ? <h1 className='wind-speed-text'>Loading...</h1> : <h1 className='wind-speed-text'>{currentWeather.gusts}</h1> }

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
                          {currentWeather.gusts == -99 ? <h1 className='wind-speed-text'>Loading...</h1> : <h1 className='wind-speed-text'>{currentWeather.gusts}</h1> }

                          <div className="wind-gusts-container">
                            {unit == 'imperial' ? <h3 className="wind-speed-subtitle">mph</h3> : <h3 className="wind-speed-subtitle">km/h</h3>}
                            <br/>
                            <h3 className="wind-speed-subtitle">Gusts</h3>
                          </div>
                        </div>
                        

                      <div className="view-map-container">
                        <h3 className="view-map-text">View Map</h3>
                        
                        <img src='arrow-icon.png' className={inflate ? deflate ? "view-more-icon-rotate-b" : "view-more-icon-rotate-f" : "view-more-icon"} onClick={showViewMap} alt='arrow-icon'></img>
                      </div>

                    </div>

                    <div className="extra-content-container">

                      <div className={inflate ? deflate ? "extra-2-content-fade-in" : "extra-2-content-fade-out" : "extra-2-content"}>
                          {currentWeather.wind == -99 ? <h1 className='wind-speed-text'>Loading...</h1> : <h1 className='wind-speed-text'>{currentWeather.wind}</h1> }

                          <div className="wind-speed-container">
                            {unit == 'imperial' ? <h3 className="wind-speed-subtitle">mph</h3> : <h3 className="wind-speed-subtitle">km/h</h3>}
                            <br/>
                            <h3 className="wind-speed-subtitle">Wind</h3>
                          </div>
                        </div>

                    </div>
                
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
                    <h3 className="forecast-text pl-[20%]">{day.hi}° / {day.lo}°</h3>
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
