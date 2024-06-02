var express = require('express');
var router = express.Router();
const dotenv = require('dotenv').config();

/* GET weather */
router.get('/', function(req, res, next) {

  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.long}&units=${req.query.unit}&appid=${process.env.OPEN_WEATHER_API_KEY}`) 
      .then(response => response.json())
      .then(json => {
        json.sunrise = new Date(json.sys.sunrise * 1000).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hourCycle: 'h12'});
        json.sunset = new Date(json.sys.sunset * 1000).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hourCycle: 'h12'});
        if(json.wind.gust === undefined) json.gusts = "N/A";
          else json.gusts = json.wind.gust.toFixed(0);
        json.wind = json.wind.speed.toFixed(0);
        json.conditions = json.weather[0].main;
        json.temp = json.main.temp.toFixed(0);
        json.feelsLike = json.main.feels_like.toFixed(0);
        res.json(json);
      })
      .catch(error => console.error('Error:', error));
  
});

module.exports = router;
