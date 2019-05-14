'user strict';
const _API_KEY = '92938e65f13eca9833f2caa4dc62aa68';
const _SERVER_NAME = 'http://api.openweathermap.org/data/2.5';
const headers = new Headers();
const initHeaders = {
    method: 'GET',
    headers: headers,
    mode: 'cors',
    cache: 'default',
};
let weatherData

if ('geolocation' in navigator) {
    init();
} else {
    alert('Sorry but your browser does not support Geolocation');
}

async function init() {
    // getWeatherData();
    getCurrentWeather()
}

function getWeatherData() {
    const options = {
        enableHighAccuray: true,
    };
    navigator.geolocation.getCurrentPosition(pos => {
            const CALL = `${_SERVER_NAME}/forecast?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${_API_KEY}`;
            fetch(CALL, initHeaders)
                .then(data => data.json())
                .then(async json => {
                    handleWeatherData(json);
                });
        },
        error => console.error(error),
        options
    );
}


function handleWeatherData(weatherData) {
    
}

function getCurrentWeather() {
    navigator.geolocation.getCurrentPosition( pos => {
        const CALL = `${_SERVER_NAME}/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${_API_KEY}`;
        fetch(CALL, initHeaders)
            .then(data => data.json())
            .then(json => displayCurrenteLocationData(json))
            .catch(e => console.error(e))
    })
}

function displayCurrenteLocationData(data) {
    console.log(data)
    const currentCity = document.querySelector('#current-city');
    const currentTemperature = document.querySelector('#current-temperature');
    currentCity.innerHTML = `${data.name}, ${data.sys.country}`;
    currentTemperature.innerHTML = `${kelvinToCelcius(data.main.temp)}°`
}

function farenheitToCelcius(temperature) {
    return ((temperature - 32) * (5/9));
}

function kelvinToCelcius(temperature) {
    return (temperature - 273,15);
}