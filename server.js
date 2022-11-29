require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const app = express();
const moment = require("moment");
const PORT = process.env.PORT || 8080;
const openweathermap_apikey = process.env.API_KEY;

const CORSOption = {
  /* Add CORS option if you wish */
};

/* Either day, afternoon (named sunset), or night */
let timeofdayint = (hr) => {
  return hr >= 0 && hr <= 6
    ? "night"
    : hr >= 7 && hr <= 12
    ? "day"
    : hr >= 13 && hr <= 18
    ? "sunset"
    : hr >= 19 && hr <= 23
    ? "night"
    : null;
};

/* Get the users current time from the UTC offset from OpenWeatherAPI */
let currTimeFromUTC = (utc_seconds) => {
  const nowInUTC = new Date().getTime();
  let currSec = parseInt((nowInUTC / 1000).toFixed(0)) - utc_seconds;
};

/* Weather conditions to consider: https://openweathermap.org/weather-conditions */
checkCondition = (description) => {
  return description.includes("sky")
    ? "sky"
    : description.includes("cloudy") || description.includes("clouds")
    ? "cloudy"
    : description.includes("rain")
    ? "rain"
    : description.includes("storm")
    ? "storm"
    : description.includes("snow")
    ? "snow"
    : description.includes("mist")
    ? "mist"
    : null;
};

/* Properly format the input */
UpperCaseSentence = (input) =>
  input.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });

/* Messages to the user */
methodResponse = (input, city_null_check) => {
  return input == "for"
    ? "We had trouble finding your postal so instead, we are showing you the weather for "
    : city_null_check != "" && input == "geo"
    ? "According to your browsers GPS coordinates, you are located in "
    : city_null_check == "" && input == "geo"
    ? "Weather at the moment based on your browsers GPS coordinates "
    : input == "ip"
    ? "According to your Internet Provider, it seems you are located in "
    : input == "zip"
    ? "The Zip You Enterered Is "
    : null;
};

/* Guide to understanding OpenWeatherAPI: https://openweathermap.org/current */
function prepareData(weather_response, method) {
  let timezoneUser = weather_response["timezone"];
  let UTCTime = moment.utc();
  let time = moment(UTCTime - timezoneUser).format("H");
  let infoData = {};
  infoData = {
    status: 1,
    weather_response: {
      msg_user: methodResponse(method, weather_response["name"]),
      city_name: UpperCaseSentence(weather_response["name"]),
      current_temp: weather_response["main"]["temp"] + " °F",
      current_feels_like: weather_response["main"]["feels_like"] + " °F",
      current_weather_descp: UpperCaseSentence(
        weather_response["weather"][0]["description"]
      ),
      current_min: weather_response["main"]["temp_min"] + " °F",
      current_max: weather_response["main"]["temp_max"] + " °F",
      current_wind_speed: weather_response["wind"]["speed"] + " m/h",
      weather_icon: `https://openweathermap.org/img/w/${weather_response["weather"][0]["icon"]}.png`,
    },
  };

  const jsonFile = require("./public/media/themes.json");
  let cssAdd =
    jsonFile[timeofdayint(time)][
      checkCondition(weather_response["weather"][0]["description"])
    ];
  infoData["css"] = cssAdd;
  infoData["api"] = {
    time: timeofdayint(time),
    conditions: checkCondition(weather_response["weather"][0]["description"]),
  };

  return infoData;
}

app.get("/api/getWeather", cors(), async (req, res) => {
  /* We got a zip code as a parameter */
  if (req.query["zip"]) {
    if (
      req.query["countrySelect"].length !== 2 &&
      !/^[a-zA-Z]*$/g.test(req.query["countrySelect"]) &&
      req.query["zip"].length <= 5
    ) {
      res.send({ status: 0, message: "Error on retrieving country code" });
    } else {
      try {
        console.log(
          `Attempting to get data from zip code: ${req.query["zip"]} in ${req.query["countrySelect"]}`
        );
        const getResp = await axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?zip=${req.query["zip"]},${req.query["countrySelect"]}&units=imperial&appid=${openweathermap_apikey}`
          )
          .then((resp) => resp.data);

        res.send(prepareData(getResp, "zip"));
      } catch (e) {
        console.error(`There was an error attempting to fetch the data`, e);
        const getResp = await axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?zip=10010,us&units=imperial&appid=${openweathermap_apikey}`
          )
          .then((resp) => resp.data);
        res.send(prepareData(getResp, "for"));
      }
    }
  } else if (req.query["ip"]) {
    /* We got an IP as a parameter */
    let methodSend = "ip";
    if (
      !req.query["ip"].match(
        "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$"
      )
    ) {
      res.send({
        status: 0,
        message: "Invalid IP Input (Only IPv4 IP addresses are supported)",
      });
    } else {
      axios
        .get(`http://ip-api.com/json/${req.query["ip"]}`)
        .then((resp) => resp.data)
        .catch((error) => console.error("IP Fetch Failed: " + error))
        .then((data) =>
          axios.get(
            `https://api.openweathermap.org/data/2.5/weather?zip=${data["zip"]},${data["countryCode"]}&units=imperial&appid=${openweathermap_apikey}`
          )
        )
        .catch((error) => {
          //If we run into trouble getting the users location, just fetch New York City as a default
          methodSend = "for";
          return axios.get(
            `https://api.openweathermap.org/data/2.5/weather?zip=10010,us&units=imperial&appid=${openweathermap_apikey}`
          );
        })
        .then((resp) => resp.data)
        .then((data) => res.send(prepareData(data, methodSend)))
        .catch((error) => console.error(error));
    }
  } else if (req.query["geoip"]) {
    /* We got a geolocation as a parameter */
    regex_lat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
    regex_long = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
    let geosplit = req.query["geoip"].split(",");
    if (geosplit[0].match(regex_lat) && geosplit[1].match(regex_long)) {
      let geosplit = req.query["geoip"].split(",");
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${geosplit[0]}&lon=${geosplit[1]}&units=imperial&appid=${openweathermap_apikey}`
        )
        .then((resp) => resp.data)
        .then((data) => res.send(prepareData(data, "geo")))
        .catch((error) => console.error(error));
    } else {
      res.send({ status: 0, message: "Invalid Coordinates" });
    }
  }
});

/* Weather Icon needs direct pathing */
app.get("/favicon.ico", cors(), (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "media", "weather_icon.ico"));
});

if (openweathermap_apikey !== undefined) {
  /* Set a static folder to serve */
  app.use(cors(), express.static(path.join(__dirname, "public")));

  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
} else {
  console.error(
    "Please enter your OpenWeatherMap API Key in the config.json file"
  );
}
