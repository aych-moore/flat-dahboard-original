const names = ['Etienne', 'Hayden', 'Heath'];
const urlBackground = "https://www.reddit.com/r/wallpapers/top.json?t=day&limit=1";
const urlJoke = "https://icanhazdadjoke.com/";
let daysJson;
let lastUpdatedDay;
let lastUpdatedJoke;


async function setImg() {
	var res = (await (await fetch(urlBackground)).json())
	const firstEntry = res.data.children[0].data
	let back = firstEntry.url

	// find first image in post (since update allows multiple images)
	if (firstEntry.media_metadata) {
		back = Object.entries(firstEntry.media_metadata)[0][1].s.u.replaceAll("&amp;", "&")
	}

	document.getElementById('backgroundTitle').innerHTML = firstEntry.title;
	document.getElementsByTagName('body')[0].style.backgroundImage = `url(${back})`;
}

async function setJoke(currentDate) {
	// only update every 5 min
	if (lastUpdatedJoke && lastUpdatedJoke.getTime() + (1000 * 60 * 5) > currentDate.getTime()) return;
	lastUpdatedJoke = currentDate;

	const res = await (await fetch("https://icanhazdadjoke.com/", {
		headers: {
			Accept: "application/json"
		}
	})).json()
	document.getElementById('joke').innerHTML = res["joke"]
}

async function setWackyDay(currentDate) {
	if (daysJson === undefined) {
		daysJson = await ((await fetch("./days.json", {
			headers: {
				'Content-Type': 'application/json',
			},
		})).json())
	}
	let text = "";
	daysJson[`${currentDate.getDate()}-${currentDate.getMonth() + 1}`].forEach(e => {
		text += `<p class="done-${e.complete}">${e.day}<p>`
	});
	document.getElementById('event').innerHTML = text
}

function setDay(currentDate) {
	if (lastUpdatedDay && lastUpdatedDay.getDate() === currentDate.getDate()) return;
	lastUpdatedDay = currentDate;

	// set date
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const date = `${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
	document.getElementById('date').innerHTML = date;

	setImg();
	setWackyDay(currentDate);
	// setRoster(currentDate);
}

function setRoster(currentDate) {
	const getWeek = () => {
		const oneJan = new Date(currentDate.getFullYear(), 0, 1);
		return Math.ceil((((currentDate - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
	}

	var weekNumber = getWeek();
	var rosterWeek = weekNumber % 3; //iterates weekly, 0,1,2 repeating

	document.getElementById('p1').innerHTML = names[rosterWeek % 3];
	document.getElementById('p2').innerHTML = names[(rosterWeek + 1) % 3];
	document.getElementById('p3').innerHTML = names[(rosterWeek + 2) % 3];
}

function setTime(currentDate) {
	const hours = currentDate.getHours();
	let minutes = currentDate.getMinutes();
	minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

	if (hours > 12) {
		time = `${hours - 12}:${minutes}PM`;
	} else {
		time = `${hours}:${minutes}AM`;
	}
	document.getElementById('time').innerHTML = time;
}

function loop() {
	const currentDate = new Date();

	setDay(currentDate);
	setJoke(currentDate);
	setTime(currentDate);

	setTimeout(loop, 1000 * 5); //repeat every 5 seconds
}

async function refresh() {
	const currentDate = new Date();
	lastUpdatedJoke = undefined;
	lastUpdatedDay = undefined;

	setDay(currentDate);
	setJoke(currentDate);
	setTime(currentDate);
}

loop();