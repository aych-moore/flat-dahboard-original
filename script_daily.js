
var names = ['Etienne', 'Hayden', 'Heath'];
var urlBackground = "https://www.reddit.com/r/wallpapers/top.json?t=day&limit=1";
var urlJoke = "https://icanhazdadjoke.com/";
var days = {};

async function setup() {
	var req = await fetch("./days.json", {
		headers: {
			'Content-Type': 'application/json',
		},
	})
	days = await req.json()
}
setup()

async function dailyUpdate() {
	//background
	const Http = new XMLHttpRequest();
	const url = urlBackground;
	Http.open("GET", url);
	Http.send();

	Http.onreadystatechange = (e) => {
		var reply = Http.responseText;

		var urlImage = JSON.parse(reply).data.children[0].data.url;
		var imageTitle = JSON.parse(reply).data.children[0].data.title;
		var body = document.getElementsByTagName('body')[0];

		console.log(urlImage);
		body.style.backgroundImage = 'url(' + urlImage + ')';
		document.getElementById('backgroundTitle').innerHTML = imageTitle;
	}


	//joke
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", urlJoke, false); // false for synchronous request
	xmlHttp.setRequestHeader("Accept", "application/json");
	xmlHttp.send(null);
	var joke = JSON.parse(xmlHttp.responseText).joke;
	document.getElementById('joke').innerHTML = joke;

	var req = await fetch("./days.json", {
		headers: {
			'Content-Type': 'application/json',
		},
	})
	var days = await req.json()
	//day
	var date = new Date(Date.now())
	var formed = `${date.getDate()}-${date.getMonth() + 1}`
	var text = "";
	days[formed].forEach(e => {
		text += `${e}<br>`
	});
	document.getElementById('event').innerHTML = text

	//flat job roster
	Date.prototype.getWeek = function () {
		var onejan = new Date(this.getFullYear(), 0, 1);
		return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
	}

	var yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 2);
	var weekNumber = yesterday.getWeek();
	console.log(weekNumber);

	var rosterWeek = weekNumber % 3; //itterates weekly, 0,1,2,3 repeating

	document.getElementById('p1').innerHTML = names[rosterWeek % 3];
	document.getElementById('p2').innerHTML = names[(rosterWeek + 1) % 3];
	document.getElementById('p3').innerHTML = names[(rosterWeek + 2) % 3];


	setTimeout(dailyUpdate, 3600000); //hourly
	console.log("CLOCK");
}
function timeUpdate() {
	var now = new Date(), // current date
		months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	date = [now.getDate(),
	months[now.getMonth()],
	now.getFullYear()].join(' ');
	document.getElementById('date').innerHTML = date;

	var hours = now.getHours();
	var minutes = now.getMinutes();
	var ampm = hours >= 12 ? "PM" : "AM";
	var padMinutes = minutes < 10 ? "0" : "";
	hours = hours > 12 ? hours - 12 : hours; //convert to 12 hour
	time = hours + ":" + padMinutes + minutes + ampm;

	document.getElementById('time').innerHTML = time;


	setTimeout(timeUpdate, 1000 * 60); //repeat every 1 minute
	console.log("CLOCK TICK");
}

dailyUpdate();
timeUpdate();