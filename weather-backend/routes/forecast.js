var express = require('express');
var router = express.Router();
const dotenv = require('dotenv').config();

/* GET forecast */
router.get('/', function(req, res, next) {
    let tempCards = [];

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${req.query.lat}&lon=${req.query.long}&units=${req.query.unit}&appid=${process.env.OPEN_WEATHER_API_KEY}`) // 
    .then(response => response.json())
    .then(json => { 
      json.list.forEach(element => {
        let d = new Date(element.dt_txt);
        //hoursArr.push(d.toLocaleString('en-US', {hour: 'numeric', hourCycle: 'h12'}));

        if(element.weather[0].main === "Clear") {
          tempCards.push({hour: d.toLocaleString('en-US', {hour: 'numeric', hourCycle: 'h12'}), url: "sun-icon.png", title: "Clear", temp: element.main.temp.toFixed(0)});
        } else if (element.weather[0].main === "Clouds") {
          tempCards.push({hour: d.toLocaleString('en-US', {hour: 'numeric', hourCycle: 'h12'}), url: "cloudy-icon.png", title: "Cloudy", temp: element.main.temp.toFixed(0)});
        } else if (element.weather[0].main === "Rain") {
          tempCards.push({hour: d.toLocaleString('en-US', {hour: 'numeric', hourCycle: 'h12'}), url: "rainy-icon.png", title: "Rainy", temp: element.main.temp.toFixed(0)});
        }

        //setCards(tempCards);

      })
    })
    .then(() => { /*setHours(hoursArr);*/ res.json(tempCards); })
    .catch(error => console.error('Error:', error));
  
});

module.exports = router;
