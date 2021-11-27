var names = ['Etienne', 'Hayden', 'Heath'];
var urlBackground = "https://www.reddit.com/r/wallpapers/top.json?t=day&limit=1";
var urlJoke = "https://icanhazdadjoke.com/";


async function setImg() {
	var res = (await (await fetch(urlBackground)).json())
	const firstEntry = res.data.children[0].data
	let back = firstEntry.url


	console.log(firstEntry)

	// find first image in post (since update allows multiple images)
	if (firstEntry.media_metadata) {
		back = Object.entries(firstEntry.media_metadata)[0][1].s.u.replaceAll("&amp;", "&")
	}

	document.getElementById('backgroundTitle').innerHTML = firstEntry.title;
	document.getElementsByTagName('body')[0].style.backgroundImage = `url(${back})`;
}

async function setJoke(currentDate) {
	// only update every 5 min
	if (lastUpdatedJoke?.getTime() + (1000 * 60 * 5) > currentDate.getTime()) return
	lastUpdatedJoke = currentDate;

	const res = await (await fetch("https://icanhazdadjoke.com/", {
		headers: {
			Accept: "application/json"
		}
	})).json()
	document.getElementById('joke').innerHTML = res["joke"]
}

async function setDay() {
	var req = await fetch("./days.json", {
		headers: {
			'Content-Type': 'application/json',
		},
	})
	var days = await req.json()
	var date = new Date(Date.now())
	var text = "";
	days[`${date.getDate()}-${date.getMonth() + 1}`].forEach(e => {
		text += `${e}<br>`
	});
	document.getElementById('event').innerHTML = text
}

async function dailyUpdate() {
	//Set Image, Day, and Joke
	setImg();
	setJoke();
	setDay();

	//flat job roster
	Date.prototype.getWeek = function () {
		var onejan = new Date(this.getFullYear(), 0, 1);
		return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
	}

	var yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 2);
	var weekNumber = yesterday.getWeek();
	console.log(weekNumber);

	var rosterWeek = weekNumber % 3; //iterates weekly, 0,1,2 repeating

	document.getElementById('p1').innerHTML = names[rosterWeek % 3];
	document.getElementById('p2').innerHTML = names[(rosterWeek + 1) % 3];
	document.getElementById('p3').innerHTML = names[(rosterWeek + 2) % 3];
}

function timeUpdate() {
	var now = new Date(), // current date
		months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	date = [now.getDate(),
	months[now.getMonth()],
	now.getFullYear()].join(' ');
	document.getElementById('date').innerHTML = date;
	var day = now.getDate()

	var hours = now.getHours();
	var minutes = now.getMinutes();
	var ampm = hours >= 12 ? "PM" : "AM";
	var padMinutes = minutes < 10 ? "0" : "";
	hours = hours > 12 ? hours - 12 : hours; //convert to 12 hour
	time = hours + ":" + padMinutes + minutes + ampm;

	if (now.getMinutes() < 2) {
		if (now.getHours() == 0) {
			dailyUpdate()
		} else {
			setJoke()
		}
	}
	document.getElementById('time').innerHTML = time;

	setTimeout(timeUpdate, 1000 * 60); //repeat every 1 minute
	console.log("CLOCK TICK");
}

timeUpdate();
dailyUpdate();