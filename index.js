let lat, lon;
const apiKey = '1b2f6b22ca6eb628cb196ca5b7b29bc1';
let cityInput = document.querySelector("#inpt");
let dis = document.querySelector(".city");
let deg = document.getElementById("deg");
let img = document.getElementById("img");

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Function to display weather data
function displayWeatherData(data) {
    console.log("Weather data:", data);
    dis.textContent = data.name;
    deg.textContent = `${data.main.temp} Degrees`;
    let id = data.weather[0].id;

    if (id >= 200 && id < 300) {
        img.src = "Storm_light.svg";
    } else if (id >= 500 && id < 600) {
        img.src = "Rain_light.svg";
    } else if (id >= 600 && id < 700) {
        img.src = "Winter_light.svg";
    } else if (id >= 801 && id < 900) {
        img.src = "Cloud_light.svg";
    } else if (id === 800) {
        img.src = "Sun_light.svg";
    } else {
        img.src = "default_weather.svg"; // Add a default image
    }
}

// Geolocation-based weather
if (cityInput.value === "") {
    const successCallback = (position) => {
        console.log("Geolocation successful:", position);
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        getWeather1();
    };

    const errorCallback = (error) => {
        console.error("Error getting geolocation:", error);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

// City input-based weather
const debouncedGetWeather = debounce(() => {
    console.log("Debounced getWeather called with input:", cityInput.value);
    getWeather();
}, 800);

cityInput.addEventListener("input", debouncedGetWeather);

async function getWeather1() {
    try {
        console.log(`Fetching weather for coordinates: ${lat}, ${lon}`);
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const data = await res.json();
        if (res.ok) {
            displayWeatherData(data);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
    }
}

async function getWeather() {
    if (!cityInput.value.trim()) {
        console.log("City input is empty, skipping API call");
        return;
    }
    
    try {
        console.log(`Fetching weather for city: ${cityInput.value}`);
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityInput.value)}&appid=${apiKey}&units=metric`);
        const data = await res.json();
        if (res.ok) {
            displayWeatherData(data);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
    }
}