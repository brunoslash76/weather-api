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
const weekDays = [
    "Domingo-Feira",
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado-Feira",
];
const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];
const ONE_MINUTE = 60000;
const ONE_DAY = 1440000;
const WEATHER_UPDATE = 180000;
let weatherData

if ('geolocation' in navigator) {
    init();
} else {
    alert('Sorry but your browser does not support Geolocation');
}

async function init() {
    // getWeatherData();
    getCurrentWeather();
    displayCurrentTime();
    displayCurrentDate();
    updateDisplays(displayCurrentDate, ONE_DAY);
    updateDisplays(displayCurrentTime, ONE_MINUTE);
    updateDisplays(getCurrentWeather, WEATHER_UPDATE);
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

function getCurrentWeather() {
    navigator.geolocation.getCurrentPosition(pos => {
        const CALL = `${_SERVER_NAME}/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${_API_KEY}`;
        fetch(CALL, initHeaders)
            .then(data => data.json())
            .then(json => displayCurrenteLocationData(json))
            .catch(e => console.error(e))
    })
}

function displayCurrenteLocationData(data) {
    const currentCity = document.querySelector('#current-city');
    const currentTemperature = document.querySelector('#current-temperature');
    currentCity.innerHTML = `${data.name}, ${data.sys.country}`;
    currentTemperature.innerHTML = `${kelvinToCelcius(data.main.temp).toFixed(1, 10)}°`
}


// TIME FUNCTIONS 
function getCurrentTime() {

    const agora = Date.now();
    const now = new Date(agora);
    weekday = weekDays[now.getDay()];
    month = months[now.getMonth()]

    return {
        month: month,
        weekday: weekday,
        day: now.getDate(),
        hour: now.getHours() > 9 ? now.getHours() : `0${now.getHours()}`,
        minutes: now.getMinutes() > 9 ? now.getMinutes() : `0${now.getMinutes()}`,
        seconds: now.getSeconds() > 9 ? now.getSeconds() : `0${now.getSeconds()}`,
    };
}

function displayCurrentTime() {
    const timeInfoHTML = document.querySelector('#time-info');
    timeData = getCurrentTime();
    timeInfoHTML.innerHTML = `
        <span>${timeData.hour}</span>:<span>${timeData.minutes}</span>
    `;
}

function displayCurrentDate() {
    const dateInfoHTML = document.querySelector('#date-info');
    timeData = getCurrentTime();
    dateInfoHTML.innerHTML = `
        <span>${timeData.weekday}</span>, <span>${timeData.day}</span> de <span>${timeData.month}</span>
    `;
}

function updateDisplays(displayToUpdate, timeInterval) {
    setInterval(displayToUpdate, timeInterval);
}

function farenheitToCelcius(temperature) {
    return ((temperature - 32) * (5 / 9));
}

function kelvinToCelcius(temperature) {
    console.log(temperature)
    return (temperature - 273.15);
}