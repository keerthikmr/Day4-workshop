const API_KEY = CONFIG.WEATHER_API_KEY;
const API_URL = "https://api.weatherapi.com/v1/current.json";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");
const errorMessage = document.getElementById("errorMessage");

// DOM elements for weather data
const locationName = document.getElementById("locationName");
const locationDetails = document.getElementById("locationDetails");
const temperature = document.getElementById("temperature");
const weatherIcon = document.getElementById("weatherIcon");
const weatherCondition = document.getElementById("weatherCondition");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");

// Event listeners
searchBtn.addEventListener("click", searchWeather);
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchWeather();
  }
});

async function searchWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name");
    return;
  }

  hideMessages();
  searchBtn.textContent = "Searching...";
  searchBtn.disabled = true;

  try {
    const response = await fetch(
      `${API_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "City not found");
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error("Weather API Error:", error);
    showError(error.message || "City not found. Please try again.");
  } finally {
    searchBtn.textContent = "Search";
    searchBtn.disabled = false;
  }
}

function displayWeather(data) {
  const { location, current } = data;

  // Update location info
  locationName.textContent = location.name;
  locationDetails.textContent = `${location.region}, ${location.country}`;

  // Update weather info
  temperature.textContent = Math.round(current.temp_c);
  weatherIcon.src = `https:${current.condition.icon}`;
  weatherIcon.alt = current.condition.text;
  weatherCondition.textContent = current.condition.text;

  // Update details
  feelsLike.textContent = Math.round(current.feelslike_c);
  humidity.textContent = current.humidity;
  wind.textContent = current.wind_kph;
  pressure.textContent = current.pressure_mb;

  // Show result
  weatherResult.classList.remove("hidden");
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  weatherResult.classList.add("hidden");
}

function hideMessages() {
  errorMessage.classList.add("hidden");
  weatherResult.classList.add("hidden");
}
