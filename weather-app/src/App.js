import logo from './logo.svg';
import './App.css';
import {useState} from 'react';

function App() {

  const [inflate, setInflate] = useState(false);
  const [deflate, setDeflate] = useState(false);
  const [text, setText] = useState('View More');

  function timeout(delay) {
      return new Promise( res => setTimeout(res, delay) );
  }

  async function showViewMore() {
    
    if(!inflate) {
      setInflate(true);
      setText('View Less');
      setDeflate(false);
    } else {
      setDeflate(true);
      setText('View More')
      await timeout(1000);
      setInflate(false);
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
            </div>
            
            {/* ------------ Middle Column ------------ */}
            <div className="grid-item-2">
              
              {/* ------------ Location Information ------------ */}
              <div className="location-container">
                <h1 className="location-title">Charlotte, NC</h1>
                <h3 className="percipitation">Chance of Percipitation</h3>
                <h1 className="temperature">50°</h1>
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
                        <h1 className="extra-content-subtitle">50°</h1>
                      </div>

                      {(inflate && !deflate) && (
                        <div className="extra-content-container-col-2-row-1">
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
                        <h1 className="extra-content-subtitle">7:03am</h1>
                      </div>

                      {(inflate && !deflate) && (
                        <div className="extra-content-container-col-2-row-2">
                          <h1 className='wind-speed-text'>7</h1>

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
                        <h1 className="extra-content-subtitle">7:33pm</h1>
                      </div>

                      {(inflate && !deflate) &&(
                        <div className="extra-content-container-col-2-row-2">
                          <h1 className='wind-speed-text'>14</h1>

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
                
                </div>
                
              </div>

            </div>

            {/* ------------ Right Column ------------ */}
            <div className="grid-item-3">
                
              {/* ------------ 7-Day Forecast ------------ */}
              <div className="seven-day-title-container">
                <h3 className="seven-day-title">7-Day Forecast</h3>
                <h3 className="seven-day-hi-lo">Hi/Lo</h3>
              </div>
            
            </div>

          </div>
      </div>

    </>

  );
}

export default App;
