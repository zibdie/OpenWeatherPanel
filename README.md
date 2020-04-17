![Project Logo](project-logo.png)

Open Weather Panel is a small hobby project that displays the weather of a given geolocation, zip code, or even the user's IP address, utilizing OpenWeatherMap.org's API key.

While many universities and online courses many offer the same project, they neglect the style and interactivity of the website, often just judging the student to be able to call the API, read the JSON output, and use minimal javascript to change the text to output the information. 

My "Open Weather Panel" goes a step further. Upon visiting the site, the users IP address will be fetched to show relevant weather based on their location. If for some reason the user's information cannot be fetched, it falls back on showing New York City, with a relevant message telling the user. The search parameters include entering a zip code or even using the users geolocation (should they allow it of course).

The panel color will change depending on the time of day the user is located and a background video will play depending on the users weather conditions and time of day.

This is my first frontend project in NodeJS and the first time I heavily used JavaScript as my previous projects were focused more towards the backend.

## To-do:
- ~~Allow the user to search zip by any country (currently only works for the United States)~~
- ~~Move JS and CSS files locally~~
- Cut the background video sizes so the files are smaller and can be easily loaded
- Upload a live demo
- ~~Create a Dockerfile to easily launch the project~~
- (Optional) Rewrite the backend in Python and create a Dockerfile for that