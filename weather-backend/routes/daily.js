var express = require('express');
var router = express.Router();
const dotenv = require('dotenv').config();

/* GET forecast */
router.get('/', function(req, res, next) {
    const options = {method: 'GET', headers: {accept: 'application/json'}};

    fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${req.query.lat},${req.query.long}&timesteps=daily&units=${req.query.unit}&apikey=${process.env.TOMORROW_API_KEY}`, options) // 
        .then(response => response.json())
        .then(json => {
            let tempFiveDay = [];

            json.timelines.daily.forEach(element => {
                let d = new Date(element.time);
                tempFiveDay.push({day: d.toLocaleString('en-US', {weekday: 'short'}), 
                                hi: element.values.temperatureMax.toFixed(0), 
                                lo: element.values.temperatureMin.toFixed(0), 
                                weatherCode: element.values.weatherCodeMax});
            });

            res.json(tempFiveDay);

        })
        .catch(err => console.error(err));

    }
);

module.exports = router;
