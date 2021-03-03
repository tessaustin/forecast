//API Key
var APIkey = "a17e1499228be1f9c294ac18b234c7d7";

//display current date next to current city
var currentDate = moment().format("L");
$("#current-date").text("(" + currentDate + ")");

//clickable search btn w/input text
$("#search-btn").on("click", function() {
  citySearch = $("#search-city")
    .val()
    .trim();

  if (citySearch === "") {
    return;
  }

  $("#search-city").val("");
  getWeather(citySearch);
   
});

//retreive current weather
function getWeather(search) {
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="
      + search
      + "&units=imperial"
      + "&appid=" + APIkey;

      $.ajax ({
        type: "get",
        url: queryURL,
        error: function(val) {
          console.log('ERROR');
        },
        success: function(val) {
          console.log("-- || Open Weather Map Data || --");
          console.log("City Name:", val.name);
          console.log("Time of data calculation, unix, UTC:", val.dt);
          console.log("Weather Icon:", val.weather[0].icon);
          console.log("Temperature:", val.main.temp, "°F");
          console.log("Humidity:", val.main.humidity, "%");
          console.log("Wind Speed:", val.wind.speed, "MPH");

          $("#current-city").text(val.name);
          $("#current-temp").html(val.main.temp + ' °F');
          $("#current-humidity").html(val.main.humidity + '%');
          $("#current-wind-speed").html(val.wind.speed + ' MPH');

        }
      });
 

};