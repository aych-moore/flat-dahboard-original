var names = ['Shara', 'Hayden', 'Mark', 'Kyle'];
var urlBackground = "https://www.reddit.com/r/wallpapers/top.json?t=day&limit=1";
var urlJoke = "https://icanhazdadjoke.com/";

function dailyUpdate() {
	//background
	const Http = new XMLHttpRequest();
	const url=urlBackground;
	Http.open("GET", url);
	Http.send();

	Http.onreadystatechange = (e) => {
		var reply = Http.responseText;

		var urlImage = JSON.parse(reply).data.children[0].data.url;
		var imageTitle = JSON.parse(reply).data.children[0].data.title;
		var body = document.getElementsByTagName('body')[0];
		
		console.log(urlImage);
		body.style.backgroundImage = 'url('+ urlImage + ')';
		document.getElementById('backgroundTitle').innerHTML = imageTitle;
	}
    
    
    //joke
    var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", urlJoke, false ); // false for synchronous request
	xmlHttp.setRequestHeader ("Accept", "application/json");
	xmlHttp.send( null );
	var joke = JSON.parse(xmlHttp.responseText).joke;
	document.getElementById('joke').innerHTML = joke;
    
    
    
    //flat job roster
    Date.prototype.getWeek = function() {
	  var onejan = new Date(this.getFullYear(),0,1);
	  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
	}

	var yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	var weekNumber = yesterday.getWeek();
	console.log(weekNumber);

	var rosterWeek = weekNumber % 4; //itterates weekly, 0,1,2,3 repeating

	document.getElementById('p1').innerHTML = names[rosterWeek % 4];
	document.getElementById('p2').innerHTML = names[(rosterWeek + 1) % 4];
	document.getElementById('p3').innerHTML = names[(rosterWeek + 2) % 4];
	document.getElementById('p4').innerHTML = names[(rosterWeek + 3) % 4];
    
    
    setTimeout(dailyUpdate, 3600000); //hourly
	console.log("CLOCK");
}
dailyUpdate();




