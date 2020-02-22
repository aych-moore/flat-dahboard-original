//var urlTime = "http://api.timezonedb.com/v2.1/get-time-zone?key=1TZX9KRE1K6R&format=json&by=zone&zone=Pacific/Auckland";

function timeUpdate(){
  var now = new Date(), // current date
      months = ['January', 'February', 'March','April','May','June','July','August','September','October','November','December'];
  date = [now.getDate(), 
              months[now.getMonth()],
              now.getFullYear()].join(' ');
  document.getElementById('date').innerHTML = date;
  
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  var padMinutes = hours < 10 ? "0" : "";
  hours = hours > 12 ? hours-12 : hours; //convert to 12 hour
  time = hours + ":" + padMinutes + minutes + ampm;
  
  document.getElementById('time').innerHTML = time;
    
    
  setTimeout(timeUpdate, 1000*60); //repeat every 1 min
	console.log("CLOCK TICK");
}
timeUpdate();