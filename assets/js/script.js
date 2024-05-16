// OpenWeather API key
const apiKey = "f5719b4222054bee24b27c3877c4bc7a";

// Query Selectors
const cityFormEl = document.querySelector('#city-form');
const cityInputEl = document.querySelector("#search-city");
const searchEl = document.querySelector("#search-button");
const historyEl = document.querySelector("#history");
const cityNameEl = document.querySelector("#name");
const dateEl = document.querySelector("#date");
const iconEl = document.querySelector("#icon");
const tempEl = document.querySelector("#temp");
const humidityEl = document.querySelector("#humidity");
const windEl = document.querySelector("#wind");
const forecastEl = document.querySelector("#forecast-body");
const currentCityContEl = document.querySelector("#current-city-container");
const forecastContEl = document.querySelector("#forecast-container");
const todayWeatherEl = document.querySelector("#today-weather");

// Current weather stored within the object currentWeather
const currentWeather = {
  name:"",
  date:"",
  temp:"",
  humidity:"",
  wind:"",
  icon:""
}

//define searchCity variable
const searchCity = cityInputEl.value.trim();

// Store the forecast data as array
let forecast = [];

// use Day.js for dates
const today = dayjs();

// Array to store search history and retrieve from local Storage or initalize as empty array
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];


// getWeather function to get weather data and also display the latitude and longitude coordinates
const getWeather = function (city) {
  const apicityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  let lat = "";
  let lon = "";

  fetch(apicityUrl).then(function(response) {
    if(response.ok) {
      response.json().then(function(data) {
        //console.log(data);
        currentWeather.name = data.name + " ";
        currentWeather.date = today.format("MM/DD/YYYY");
        currentWeather.temp = data.main.temp + " &#176F";
        currentWeather.humidity = data.main.humidity+"%";
        currentWeather.wind = data.wind.speed + " MPH";
        currentWeather.icon = data.weather[0].icon;
        //console.log(currentWeather.icon);
        lat = data.coord.lat;
        lon = data.coord.lon;

        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        fetch(apiUrl)
        .then(function(coordresponse) {
          if (coordresponse.ok) {
            coordresponse.json().then(function(coordData) {
              //console.log(coordData);
              console.log(`Coordinates for ${city}: Latitude - ${lat}, Longitude - ${lon}`);
              displayWeather();
            })
          }

        }) .catch(error => {
          console.error('Error fetching data:', error);
        });

      });
    }
  })
  .catch(error => {
    console.error('Error fetching coordinates:', error);
    alert('Error fetching coordinates. Please try again.');
  });
}

// getForecast function to get 5-day forecast data
const getForecast = function (city) {
  const apicityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  fetch(apicityUrl).then(function (response) {
    if (response.ok) {
      response.json(). then(function (data) {
        //console.log(data);
        const today = today.format("MM/DD/YYYY");
        //console.log(today);
        for (let i = 0; i < data.list.length; i++) {
          const dateTime = data.list[i].dx_tx.split('');
          if (dateTime[0] !==today && dateTime[1] === "12:00:00") {
            let futureDate = {
              date: dayjs(dateTime[0]).format("MM/DD/YYYY"),
              time: dateTime[1],
              icon: data.list[i].weather[0].icon,
              temp: data.list[i].main.temp,
              humidity: data.list[i].main.humidity,
              wind: data.list[i].main.wind.speed,
            };
            forecast.push(futureDate);
          }
        }
        displayForecast();
      })
    }
  })
};

// displayForecast function to display 5-day forecast data
const displayForecast = function () {
  for (let i = 0; i < forecast.length; i++) {
    const futureContainerEl = document.createElement("div");
    futureContainerEl.classList.add("col-xl");
    futureContainerEl.classList.add("col-md-4");

    const futureCardEl = document.createElement("div");
    futureCardEl.classList.add("card");
    futureCardEl.classList.add("forecast-card");

    const futureCardBodyEl = document.createElement("div");
    futureCardBodyEl.classList.add("card-body");

    const futureDateEl = document.createElement("h5");
    futureDateEl.classList.add("card-title");
    futureDateEl.innerHTML = forecast[i].date;
    futureCardBodyEl.appendChild(futureDateEl);

    const futureiconEl = document.createElement("p");
    futureiconEl.classList.add("card-text");
    futureiconEl.innerHTML = "<img src='https://openweathermap.org/img/wn/" + forecast[i].icon + "@2x.png'></img>";
    futureCardBodyEl.appendChild(futureiconEl);

    const futuretempEl = document.createElement("p");
    futuretempEl.classList.add("card-text");
    futuretempEl.innerHTML = "Temp: " + forecast[i].temp;
    futureCardBodyEl.appendChild(futuretempEl);

    const futurehumidityEl = document.createElement("p");
    futurehumidityEl.classList.add("card-text");
    futurehumidityEl.innerHTML = "Humidity: " + forecast[i].humidity;
    futureCardBodyEl.appendChild(futurehumidityEl);

    futureCardEl.appendChild(futureCardBodyEl);
    futureContainerEl.appendChild(futureCardEl);
    forecastEl.appendChild(futureContainerEl);
  }
}


// display collected information from OpenWeather API on the page
const displayWeather = function (data) {
  todayWeatherEl.style.display = "block";
  forecastContEl.style.display = "block";
  cityNameEl.innerHTML = currentWeather.name;
  dateEl.innerHTML = currentWeather.date;
  tempEl.innerHTML = currentWeather.temp;
  humidityEl.innerHTML = currentWeather.humidity;
  windEl.innerHTML = currentWeather.wind;
  const todayWeather = currentWeather.icon;
  const todayWeatherIcon = document.createElement('img');
  todayWeatherIcon.src = `https://openweathermap.org/img/w/${todayWeather}.png`;

  //iconEl.innerHTML = "<img src='https://openweathermap.org/img/wn/" + currentWeather.icon + "@2x.png'></img>";
}

// function to display search history on the page
const displayHistory = function() {
  historyEl.innerHTML = "";
  for (let i = 0; i < searchHistory.length; i++) {
    const historyDiv = document.createElement("div");
    historyDiv.classList.add("history-item");
    historyDiv.innerHTML = "<h4>"+searchHistory[i]+"<h4>";
    historyEl.appendChild(historyDiv);
  }
}

// function to load search history from local Storage and sends it to display history function
const loadHistory = function() {
  searchHistory = JSON.parse(localStorage.getItem("history"));
  if (!searchHistory) {
    searchHistory = [];
  }
  displayHistory();
}


// clear forecast data from page and empty forecast array
const clearForecast = function() {
  forecast = [];
  forecastEl.innerHTML = "";
}

// historyClickHandler function called by event listener when click on the particular city in the search history
const historyClickHandler = function (event) {
  const historyCity = event.target.textContent;
  if (historyCity) {
    clearForecast();
    getWeather(historyCity);
  }
}

// formSubmitHandler function called by event listener when click on the search button, which gets value from form input and sends it to getWeather function
const formSubmitHandler = function(event) {
  event.preventDefault();

  const searchCity = cityInputEl.value.trim();
  if (searchCity) {
    getWeather(searchCity);
    // Update search history and local storage
    searchHistory.push(searchCity);
    localStorage.removeItem("history");
    localStorage.setItem("history", JSON.stringify(searchHistory));
    clearForecast();
    displayHistory();
    cityInputEl.value ="";
   }
  else {
    return;
  }
}

// clear data from results and hide current as well as future weather data
const clearResults = function () {
console.log("inside clearResults");
todayWeatherEl.style.display = "none";
forecastContEl.style.display = "none";
dateEl.innerHTML = "";
iconEl.html = "";
}

loadHistory();

// Event listeners for when user clicks Search button on the form or clicks on city search history name
cityFormEl.addEventListener('submit', formSubmitHandler);
historyEl.addEventListener('click', historyClickHandler);