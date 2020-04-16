showError = (errormsg) => {
    document.getElementById("msg_user").textContent = errormsg;
    document.getElementById("cityname").textContent = "";
    document.getElementById("msg_user").setAttribute("style", "font-weight: bold; color: red;");
}

//Load on first run
function loadFirstTime()
{
   axios.get(`https://ipv4.icanhazip.com/`)
   .then(resp => resp.data)
   .then(resp => resp.replace(/(\r\n|\n|\r)/gm,""))
   .then(data => {
    return axios.get(`${window.location.origin}/api/getWeather?ip=${data}`)
   })
   .then(resp => changeStyle(resp.data))
   .catch(error => console.error(error));
}

//Load on user entering a zipcode
function callOnZip()
{
    let zip = document.getElementById("zipCodeForm").value; 

    axios.get(`${window.location.origin}/api/getWeather?zip=${zip}`)
    .then(resp => resp)
    .then(resp => changeStyle(resp.data))
    .catch(error => console.error(error));
}

//---- EVERYTHING HERE FOR GEO ---
function geoError()
{
    document.getElementById("msg_user").textContent = "Unable to get your location. Did you decline the permission box?";
    document.getElementById("city_name").textContent = "";
    document.getElementById("msg_user").setAttribute("style", "font-weight: bold; color: red;");
}

function geoProcess(position) {
    document.getElementById("msg_user").textContent = "Getting Data...";
    document.getElementById("weather_icon").setAttribute("src", "./media/loading.gif");
    document.getElementById("msg_user").setAttribute("style", "font-weight: bold; color: silver;");
    document.getElementById("city_name").textContent = "";

    let positionArray = [(position.coords.latitude).toFixed(7), (position.coords.longitude).toFixed(7)];

    console.log(`${window.location.origin}/api/getWeather?geoip=${positionArray[0]},${positionArray[1]}`)

    axios.get(`${window.location.origin}/api/getWeather?geoip=${positionArray[0]},${positionArray[1]}`)
    .then(resp => resp)
    .then(resp => changeStyle(resp.data))
    .catch(error => console.error(error));
}

function callOnGeo()
{
    //Check if geolocation is supported on the browser
    if(!navigator.geolocation)
    {
        showError("Geolocation is not supported for your browser")
    }
    else
    {
        document.getElementById("msg_user").textContent = "Attempting to get your location..."
        document.getElementById("msg_user").setAttribute("style", "font-weight: bold; color: silver;")
        document.getElementById("city_name").textContent = "";
        navigator.geolocation.getCurrentPosition(geoProcess, geoError);
    }
}


//Change the actual style
function changeStyle(results)
{
    document.getElementById("msg_user").setAttribute("style", "")

    if(results['status'] == 1)
    {
        //Show Weather Data       
        for (var key of Object.keys(results['weather_response'])) 
        {
            if(key != "weather_icon")
            {
                document.getElementById(key).textContent = results['weather_response'][key];
            }
            else if(key == "weather_icon")
            {
                document.getElementById(key).setAttribute("src", results['weather_response'][key]);
            }
        }
        //Edit CSS
        console.log(results)
        for (var key of Object.keys(results['css'])) 
        {
            try {
                if(results['css'][key][0] == "src")
                {
                    document.getElementById(key).setAttribute("src", results['css'][key][1])
                }
                else if(results['css'][key][0] == "style")
                {
                    document.getElementById(key).setAttribute("style", results['css'][key][1])
                }
                else if(results['css'][key][0] == "txt")
                {
                    document.getElementById(key).textContent = results['css'][key][1]
                }
                else if(results['css'][key][0] == "style-class")
                {
                    var allClassesNames = document.getElementsByClassName(key);
                    for (var i = 0; i < allClassesNames.length; i++) {
                        allClassesNames[i].setAttribute("style", results['css'][key][1]);
                    }
                }
            }
            catch(err)
            {
                console.log("ERROR: " + err + " -> " + key)
            }

        }
    }
    else if(results['status'] == 0)
    {
        document.getElementById("msg_user").textContent = "There was an error: " + results['message'];
        document.getElementById("city_name").textContent = "";
        document.getElementById("msg_user").setAttribute("style", "font-weight: bold; color: red;");
    }
}