"user strict";

const _API_KEY = "92938e65f13eca9833f2caa4dc62aa68";
const _SERVER_NAME = "http://api.openweathermap.org/data/2.5";
const headers = new Headers();
const initHeaders = {
	method: "GET",
	headers: headers,
	mode: "cors",
	cache: "default"
};
const weekDays = [
	"Domingo",
	"Segunda-Feira",
	"Terça-Feira",
	"Quarta-Feira",
	"Quinta-Feira",
	"Sexta-Feira",
	"Sábado"
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
	"Dezembro"
];
const ONE_MINUTE = 60000;
const WEATHER_UPDATE = 480000;
let shouldDisplayCurrentDate = true;

if ("geolocation" in navigator) {
	init();
} else {
	alert("Sorry but your browser does not support Geolocation");
}

function init() {
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
		enableHighAccuracy: true
	};
	navigator.geolocation.getCurrentPosition(
		pos => {
			const CALL = `${_SERVER_NAME}/forecast?lat=${
				pos.coords.latitude
				}&lon=${pos.coords.longitude}&appid=${_API_KEY}`;
			fetch(CALL, initHeaders)
				.then(data => data.json())
				.then(weatherData => handleWeatherData(weatherData))
				.catch(err => console.error(err));
		},
		error => console.error(error),
		options
	);
}

function handleWeatherData(weatherData) {
	if (!weatherData) return;
	const filteredDays = this.filterDays(weatherData);
	const daysMinMax = this.getMinMaxTemp(filteredDays, weatherData);
	const templateList = this.mountTemplateForecast(daysMinMax);
	this.displayWeekForecast(templateList);
}

function filterDays(weatherData) {
	let nextDay = new Date();
	const days = weatherData.list.map(el => {
		return { timestamp: el.dt * 1000 };
	});

	const singleDays = [];
	days.forEach(el => {
		let today = new Date();
		today = today.getDate();

		let day = new Date(el.timestamp);
		weekday = day.getDay();
		day = day.getDate();

		if (day !== today) {
			if (day !== nextDay) {
				nextDay = day;
				singleDays.push({
					monthday: nextDay,
					weekday
				});
			}
		}
	});
	return singleDays;
}

function getMinMaxTemp(filteredDays, weatherData) {
	const daysMinMax = [];
	let minTemp;
	let maxTemp;

	for (let i = 0; i < filteredDays.length; i++) {

		minTemp = weatherData.list[i].main.temp_min;
		maxTemp = weatherData.list[i].main.temp_max;

		for (let o = 0; o < weatherData.list.length; o++) {

			const day = new Date(weatherData.list[o].dt * 1000);

			if (filteredDays[i].monthday === day.getDate()) {
				if (weatherData.list[o].main.temp_min < minTemp) {
					minTemp = weatherData.list[o].main.temp_min;
				}
				if (weatherData.list[o].main.temp_max > maxTemp) {
					maxTemp = weatherData.list[o].main.temp_max;
				}
			}
		}

		daysMinMax.push({
			monthday: filteredDays[i].monthday,
			weekday: filteredDays[i].weekday,
			minTemp,
			maxTemp,
		});
	}
	return daysMinMax;
}

function mountTemplateForecast(days) {
	console.log(days)
	const template = [];
	days.forEach(day => {
		template.push(`
            <div class="week-days-info">
                <span>
                    <span>${day.monthday}</span>
                    <span>${weekDays[day.weekday]}</span>
				</span>
				<span class="temp-container">
                    <div><img src="./public/img/high-temperature.png" width="25px"/></div>
                    <span>${parseInt(this.kelvinToCelcius(day.maxTemp))}°</span>
                </span>
                <span class="temp-container">
                    <div><img src="./public/img/low-temperature.png" width="25px"/></div>
                    <span>${parseInt(this.kelvinToCelcius(day.minTemp))}°</span>
                </span>
                
            </div>
        `);
	});
	return template;
}

function displayWeekForecast(template) {
	const footerInfo = document.querySelector("#footer-info");
	footerInfo.innerHTML = "";
	template.forEach(el => (footerInfo.innerHTML += el));
}

// CURRENT WEATHER DATA
function getCurrentWeather() {
	navigator.geolocation.getCurrentPosition(pos => {
		const CALL = `${_SERVER_NAME}/weather?lat=${pos.coords.latitude}&lon=${
			pos.coords.longitude
			}&appid=${_API_KEY}`;
		fetch(CALL, initHeaders)
			.then(data => data.json())
			.then(json => displayCurrenteLocationData(json))
			.catch(e => console.error(e));
	});
}

function displayCurrenteLocationData(data) {
	const imgURL = "./public/img/icons/";
	let time = 100;

	const currentWeatherIcon = document.querySelector("#weather-icon");
	const currentWeatherIconImg = document.querySelector("#weather-icon img");
	const currentCity = document.querySelector("#current-city");
	const currentTemperature = document.querySelector("#current-temperature");
	const thermometerIcon = document.querySelector("#thermometer-icon");
	const secondaryInfo = document.querySelector("#secondary-info");

	const array = [
		currentWeatherIcon,
		currentCity,
		currentTemperature,
		thermometerIcon,
		secondaryInfo
	];

	array.forEach(el => {
		el.classList.add("loading");
		setTimeout(() => {
			el.classList.add("animation-loading-done");
		}, (time += 100));
	});

	currentWeatherIconImg.setAttribute(
		"SRC",
		`${imgURL}${data.weather[0].icon}.png`
	);
	currentCity.innerHTML = `${data.name}, ${data.sys.country}`;
	currentTemperature.innerHTML = `${parseInt(kelvinToCelcius(data.main.temp))}°c`;
	secondaryInfo.children[0].children[0].children[0].innerHTML = `${parseInt(this.kelvinToCelcius(
		data.main.temp_max
	))}°c`;
	secondaryInfo.children[0].children[1].children[0].innerHTML = `${parseInt(this.kelvinToCelcius(
		data.main.temp_min
	))}°c`;
	secondaryInfo.children[1].children[0].children[0].innerHTML = `${
		data.main.humidity
		}%`;
	secondaryInfo.children[1].children[1].children[0].innerHTML = `${
		data.main.pressure
		}`;
}

// TIME FUNCTIONS
function getCurrentTime() {
	const agora = Date.now();
	const now = new Date(agora);
	weekday = weekDays[now.getDay()];
	month = months[now.getMonth()];

	return {
		month: month,
		weekday: weekday,
		day: now.getDate(),
		hour: now.getHours() > 9 ? now.getHours() : `0${now.getHours()}`,
		minutes:
			now.getMinutes() > 9 ? now.getMinutes() : `0${now.getMinutes()}`,
		seconds:
			now.getSeconds() > 9 ? now.getSeconds() : `0${now.getSeconds()}`
	};
}

function displayCurrentTime() {
	const timeInfoHTML = document.querySelector("#time-info");
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
	let day = document.querySelector("#day")
		? parseInt(document.querySelector("#day").innerHTML)
		: null;

	if (shouldDisplayCurrentDate) {
		shouldDisplayCurrentDate = false;
		handleDisplayCurrentDate();
	}

	if (!day) return;

	if (timeData.day !== day) {
		handleDisplayCurrentDate();
	}
}

function handleDisplayCurrentDate() {
	const dateInfoHTML = document.querySelector("#date-info");
	dateInfoHTML.innerHTML = `
        <span>${timeData.weekday}</span>, <span id="day">${
		timeData.day
		}</span> de <span>${timeData.month}</span>
    `;
}

function updateDisplays(displayToUpdate, timeInterval) {
	setInterval(displayToUpdate, timeInterval);
}

// Temperature convertion funcs
function farenheitToCelcius(temperature) {
	return (temperature - 32) * (5 / 9);
}

function kelvinToCelcius(temperature) {
	return temperature - 273.15;
}
