// Collect user input for just the city name
// let city; 
// OpenWeather Current Weather Data URL and necessary variables
// const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

// Base URL:
// const queryURL = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={APIkey}';





// OpenWeather API key
const apiKey = 'f5719b4222054bee24b27c3877c4bc7a';
const cityInput = document.querySelector("#search-city");
const searchButton = document.querySelector("#search-button");

const getWeatherDetails = function(cityName, lat, lon) {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(WEATHER_API_URL)
    .then (function (response) {
      return response.json();
    })
    .then (function (data) {
      console.log(data);
    })
    .catch(function (error) {
      alert("An error occured while fetching the weather forecast!");
    });
}

// Function to get coordinates of an entered city
const getCityCoordinates = function() {
  const cityName = cityInput.value.trim(); // Get user entered city name and remove extra space
  if (!cityName) return; // Return if cityName is empty
  console.log(cityName);

  const GEOCODING_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

  // Get entered city coordinates (latitude, longitude, and name) from the API response
  fetch(GEOCODING_API_URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if(!data.length) {
        return alert(`No coordinates found for ${cityName}`);

      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
     }
    }).catch(function (error) {
      alert("An error occured while fetching the coordinates!");
    });
};

// eventListener for search button
searchButton.addEventListener("click", getCityCoordinates);




