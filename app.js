//jshint esversion:6

const express = require('express');
const https = require("https");
require('dotenv').config();

const app = express();

app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.route("/")

.get((req, res) => {
  res.render('index', {
    data: null,
    error: "Enter a city name to get weather data"
  });
})

.post((req, res) => {
  const query = req.body.cityName;
  const apiKey = process.env.OPENWEATHER_API;
  const units = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${units}&appid=${apiKey}`;

  function getDay() {
    const today = new Date();
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };
    return today.toLocaleDateString('en-US', options);
  }

  //requesting data from openWeather Servers
  https.get(url, response => {
    response.on("data", data => {

      try {
        const day = getDay();
        const weatherData = JSON.parse(data);
        const icon = weatherData.weather[0].icon;
        const image = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        res.render("index", {
          today: day,
          data: weatherData,
          img: image,
          error: null
        });

      } catch (e) {
        res.render('error', {
          data: null
        })
      }
    })
  })
})

app.listen(3000, () => {
  console.log("Server port 3000 is on")
})