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
const WEATHER_UPDATE = 480000;
let shouldDisplayCurrentDate = true;

if ('geolocation' in navigator) {
    init();
} else {
    alert('Sorry but your browser does not support Geolocation');
}

async function init() {
    getWeatherData();
    getCurrentWeather();
    displayCurrentTime();
    displayCurrentDate();
    updateDisplays(displayCurrentDate, 1000);
    updateDisplays(displayCurrentTime, 1000);
    updateDisplays(getCurrentWeather, WEATHER_UPDATE);
}

// Weather forecast for 6 days
function getWeatherData() {
    const options = {
        enableHighAccuracy: true,
    };
    navigator.geolocation.getCurrentPosition(pos => {
            const CALL = `${_SERVER_NAME}/forecast?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${_API_KEY}`;
            fetch(CALL, initHeaders)
                .then(data => data.json())
                .then(weatherData => {
                    console.log(weatherData);
                    handleWeatherData(weatherData.list);
                })
                .catch(err => console.error(err));
        },
        error => console.error(error),
        options
    );
}

function handleWeatherData(weatherData) {
    if (!weatherData) return;

    weatherData.filter((el, index, array) => {
        const day = el.dt_txt.substr(8, 2);
        const otherDay = array[index].dt_txt.substr(8, 2);
        if (day !== otherDay) {
            displayWeekForecast(otherDay)
        }
    });
}

function displayWeekForecast(weekForecast) {
    console.log(weekForecast)
   
}

// CURRENT WEATHER DATA 
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
    console.log(data)
    const imgURL = './public/img/icons/';
    let time = 200;

    const currentWeatherIcon = document.querySelector('#weather-icon');
    const currentWeatherIconImg = document.querySelector('#weather-icon img');
    const currentCity = document.querySelector('#current-city');
    const currentTemperature = document.querySelector('#current-temperature');
    const thermometerIcon = document.querySelector('#thermometer-icon');
    const secondaryInfo = document.querySelector('#secondary-info');

    const array = [
        currentWeatherIcon,
        currentCity,
        currentTemperature,
        thermometerIcon,
        secondaryInfo,
    ];

    array.forEach( el => {
        el.classList.add('loading');
        setTimeout(() => {
            el.classList.add('animation-loading-done');
        }, time+= 200);
    });

    currentWeatherIconImg.setAttribute('SRC', `${imgURL}${data.weather[0].icon}.png`)
    currentCity.innerHTML = `${data.name}, ${data.sys.country}`;
    currentTemperature.innerHTML = `${kelvinToCelcius(data.main.temp).toFixed(1, 10)}°c`
    secondaryInfo.children[0].children[0].children[0].innerHTML = `${this.kelvinToCelcius(data.main.temp_max).toFixed(1, 10)}°c`;
    secondaryInfo.children[0].children[1].children[0].innerHTML = `${this.kelvinToCelcius(data.main.temp_min).toFixed(1, 10)}°c`;
    secondaryInfo.children[1].children[0].children[0].innerHTML = `${data.main.humidity}%`;
    secondaryInfo.children[1].children[1].children[0].innerHTML = `${data.main.pressure}`;
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
    let currentTime;
    if (timeInfoHTML.children.length > 0) {
        currentTime = timeInfoHTML.children[1].innerHTML;
    }
    timeData = getCurrentTime();
    if (parseInt(currentTime) !== parseInt(timeData.minutes)) {
        timeInfoHTML.innerHTML = `
            <span>${timeData.hour}</span>:<span>${timeData.minutes}</span>
        `;
    }
}

function displayCurrentDate() {
    const timeData = getCurrentTime();
    let day = document.querySelector('#day') ? parseInt(document.querySelector('#day').innerHTML) : null;

    if (shouldDisplayCurrentDate) {
        shouldDisplayCurrentDate = false;
        handleDisplay();
    }

    if (!day) return;

    if (timeData.day !== day) {
        handleDisplay();
    }

}

function handleDisplay() {
    const dateInfoHTML = document.querySelector('#date-info');
    dateInfoHTML.innerHTML = `
        <span>${timeData.weekday}</span>, <span id="day">${timeData.day}</span> de <span>${timeData.month}</span>
    `;
}

function updateDisplays(displayToUpdate, timeInterval) {
    setInterval(displayToUpdate, timeInterval);
}

// Temperature convertion funcs
function farenheitToCelcius(temperature) {
    return ((temperature - 32) * (5 / 9));
}

function kelvinToCelcius(temperature) {
    return (temperature - 273.15);
}