//API Key
var APIkey = "a17e1499228be1f9c294ac18b234c7d7";

//auto display of date when app is up
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
      + "&appid=" 
      + APIkey;

      $.ajax ({
        type: "get",
        url: queryURL,
        error: function(val) {
          //invalid city 
          alert("Error: City not found.");
        },
        success: function(val) {

          //display of current weather
          $("#current-city").text(val.name +  "(" + currentDate + ")");
          $('#wicon').attr("src", "http://openweathermap.org/img/wn/" + val.weather[0].icon + ".png");
          $("#current-temp").html(val.main.temp + " °F");
          $("#current-humidity").html(val.main.humidity + "%");
          $("#current-wind-speed").html(val.wind.speed + " MPH");
        
      var lat = val.coord.lat;
      var lon = val.coord.lon;
      var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;
            console.log(uvQueryURL)
          $.ajax ({
            type: "get",
            url: uvQueryURL,
            error: function(data) {
              console.log(data)
            },
            success: function(data) {
              console.log(data)
              $("#uv-index").html(data.value);

              if (data.value < 3) {
              $("#uv-index").addClass("low")
              } 
              else if (data.value < 6) {
                $("#uv-index").addClass("med")
              }
              else if (data.value < 9) {
                $("#uv-index").addClass("med-high")
              }
              else {
                $("#uv-index").addClass("high")
              }
            },

          })
        },
    });   








              /*
          if (history.indexOf(searchValue) === -1) {
            history.push(searchValue);
            window.localStorage.setItem("history", JSON.stringify(history));
            console.log("if History:", history);
            makeRow(searchValue);
          }

          // clear old content
          $("#current-city").empty();
          $("#five-day-forecast").empty();
*/          


/*        


      storeHistory(name);


      $("#weather-content").show();
  })
*/
};