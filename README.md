![Project Logo](https://raw.githubusercontent.com/zibdie/OpenWeatherPanel/master/exter-assets/project-logo.png)

Open Weather Panel is a small hobby project that displays the weather of a given geolocation, zip code, or even the user's IP address, utilizing OpenWeatherMap.org's API key.

While many universities and online courses many offer the same project, they neglect the style and interactivity of the website, often just judging the student to be able to call the API, read the JSON output, and use minimal javascript to change the text to output the information.

My "Open Weather Panel" goes a step further. Upon visiting the site, the users IP address will be fetched to show relevant weather based on their location. If for some reason the user's information cannot be fetched, it falls back on showing New York City, with a relevant message telling the user. The search parameters include entering a zip code or even using the users geolocation (should they allow it of course).

The panel color will change depending on the time of day the user is located and a background video will play depending on the users weather conditions and time of day.

This is my first frontend project in NodeJS and the first time I heavily used JavaScript as my previous projects were focused more towards the backend.

## Setup Requirements

In order for this to work correctly, you must get an API key from https://openweathermap.org/api (requires signing up for their service) and pasting it in the .env file (Remember to rename .env-sample to .env)

If you wish to run this (without Docker), you must have NodeJS & npm installed. If you have Docker, you can spin up a container without needing to install NodeJS + NPM on your PC.

## Live Demo

You can see a live demostration by clicking on the icon:

[![Live Demo](./exter-assets/demo-button.png)](https://openweatherpanel.onrender.com/)

Or by typing/copying and pasting:

```
https://openweatherpanel.onrender.com/
```

## From the command line

To run it from the commandline, navigate to the directory the project is located and type

```
npm run start
```

or

```
node server.js
```

You can change the port in the ".env" file

## From Docker

Docker is the easiest way to test drive the project since all dependancies will be installed and the server will be spun up. At the time of this writing, this was tested with Docker Version 19.03.8 on Ubuntu Server 18.04 LTS

To run, simply navigate to the directory where the project is located and type:

```
docker build -t open_weather_panel .
```

Once its built, you can run it by typing

```
docker container run open_weather_panel
```

### DockerHub

You can now pull the latest image from DockerHub by typing this command:

```
docker pull zibdie/openweatherpanel:latest
```

You can find the DockerHub page here: https://hub.docker.com/r/zibdie/openweatherpanel

### Notice

Icons provided by icons8
