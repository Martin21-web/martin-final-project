const cityInput = document.querySelector(".city-input")
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather")

const API_KEY = "8bc9036419217e39ca6e0041dbaab0c2"; // api key for openweathermap API

const createWeatherCard = (cityName, weatherItem, index) =>{
    if(index === 0){//HTML for the main weather card
            return `<div class="dertails">
                        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                         <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}&deg;C</h4>
                         <h4>Wind: ${weatherItem.wind.speed} m/s</h4>
                        <h4>Humidity: ${weatherItem.main.humidity} %</h4>
                    </div>
                     <div class="weather-icon">
                        <img src=" https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather icon">
                        <h4>${weatherItem.weather[0].description}</h4>
                     </div>`;
    }else{// HTML for the other five days forecast card
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src=" https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather icon">
                    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}&deg;C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} m/s</h4>
                    <h4>Humidity: ${weatherItem.main.humidity} %</h4>
            </li>`;
    }
     
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        //Filter the forecast to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast =>{
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
               return uniqueForecastDays.push(forecastDate);
            }
        })

        //clearing previous weather data
        cityInput.value = "";
        weatherCardsDiv.innerHTML = "";
        currentWeatherDiv.innerHTML = "";

        // Creating weather card and adding the to the DOM
        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
           
        });

    }).catch(() => {
        alert("An error occured while fetching the weather forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); //get user enterred city name removed extra spaces 
    if(!cityName) return; // return city if cityname is empty
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;


    // Get entered city coordinates (latitudes, longitudes, and name) from the api response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
       if(!data.length) return alert(`No coordinates found for ${cityName}`);
       const {name, lat, lon } = data[0];
       getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occured while fetching the coordinates");
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

            //Get city name from coordinates using reverse location geocoding API
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
             }).catch(() => {
                 alert("An error occured while fetching the city!");
             });
        },
        error => {
            if(error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.")
            }
        }
        
    );
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getUserCoordinates())

// NAVBAR FUNCTIONALITY
const toggleButton = document.getElementsByClassName("toggle-button")[0]
const navbarLinks =document.getElementsByClassName("navbar-links")[0]

toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
})