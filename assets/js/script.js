// Initialization START

//API Key
var APIkey = "a17e1499228be1f9c294ac18b234c7d7";

//history
var searchHistoryArr = [];

//auto display of date when app is up
var currentDate = moment().format("L");
$("#current-date").text("(" + currentDate + ")");


//clickable search btn w/input text
$('#search-list').on('click', 'li', function() {
  var cityNameHistory = $(this).text();
  getWeather(cityNameHistory);
});

  // Clear old searched cities from localStorage event listener
  $("#clear-history").on("click", (event) => {
    localStorage.clear();
    searchHistoryArr.length = 0;
    $('#search-list').empty();
  });

  displayHistory();

  if (searchHistoryArr.length > 0) {
    getWeather(searchHistoryArr[searchHistoryArr.length - 1].city);
  }

//Initialization END

//******************FUNCTIONS******************/

function getWeatherFromSearchCity(event) {
  citySearch = $("#search-city")
    .val()
    .trim();

  if (citySearch === "") {
    return;
  }

  $("#search-city").val("");
  getWeather(citySearch);

  if (event.type == 'submit') {
    event.preventDefault();
  }
}

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
      //saveCity(val.name);
      storeHistory(val.name);
      //display of current weather
      $("#current-city").text(val.name +  "(" + currentDate + ")");
      $("#wicon").attr("src", "http://openweathermap.org/img/wn/" + val.weather[0].icon + ".png");
      $("#current-temp").html(val.main.temp + " °F");
      $("#current-humidity").html(val.main.humidity + "%");
      $("#current-wind-speed").html(val.wind.speed + " MPH");
      
      //data pulled for uv
      var lat = val.coord.lat;
      var lon = val.coord.lon;
      var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" 
      + lat + "&lon=" + lon 
      + "&appid=" + APIkey;

      //console.log("uvQueryURL: " + uvQueryURL);

      $.ajax ({
        type: "get",
        url: uvQueryURL,
        //cannot retrieve data
        error: function(data) {
          alert("Error: Data not provided.");
        },  
        //display uv index & color
        success: function(data) {
          $("#uv-index").html(data.value);

          $("#uv-index").removeClass();
          
          if (data.value < 3) {
            $("#uv-index").addClass("low");
          } 
          else if (data.value < 6) {
            $("#uv-index").addClass("med");
          }
          else if (data.value < 9) {
            $("#uv-index").addClass("med-high");
          }
          else {
            $("#uv-index").addClass("high");
          }
        },
      });

      //data pulled for 5 day forecast info
      var futureQueryURL = "https://api.openweathermap.org/data/2.5/onecall"
        + "?lat=" + lat 
        + "&lon=" + lon 
        + "&units=imperial"
        + "&exclude=minutely,hourly,current,alerts" 
        + "&appid=" + APIkey;

      //console.log("futureQueryURL: " + futureQueryURL);

      $.ajax ({
        type: "get",
        url: futureQueryURL,
        //cannot retrieve data
        error: function(fdata) {
          alert("Error: Future forecast not provided.");
        },  
        //display uv index & color
        success: function(fdata) {
          //console.log("future data success");
          for (var i=1; i < 6; i++) {
            var individual = fdata.daily[i];             
            var itemDateTime = new Date(individual.dt * 1000);
            //visible data 5 day              
            $("#"+ (i) +" h5").text(itemDateTime.toLocaleDateString());   
            $("#wicon" + i).attr("src", "http://openweathermap.org/img/wn/" 
            + individual.weather[0].icon 
            + ".png");
            $("#temp" + i).html(individual.temp.day + " °F");
            $("#humi" + i).html(individual.humidity + "%");

            //console.log(itemDateTime.toLocaleDateString());
          }
        },
      });
    },
  });   

  // Render the searched cities
//  renderCities();
};

function saveCity(newCity) {
  let cityExists = false;
  // Check if City exists in local storage
  for (let i = 0; i < localStorage.length; i++) {
      if (localStorage["cities" + i] === newCity) {
          cityExists = true;
          break;
      }
  }
  // Save to localStorage if city is new
  if (cityExists === false) {
      localStorage.setItem('cities' + localStorage.length, newCity);
  }
}

  // Render the list of searched cities
function renderCities() {
    $('#search-list').empty();
    // If localStorage is empty
    if (localStorage.length===0){
      if (lastCity){
          $('#search-city').attr("value", lastCity);
      } else {
          $('#search-city').attr("value", "");
      }
  } else {
      // Build key of last city written to localStorage
      let lastCityKey="cities"+(localStorage.length-1);
      lastCity=localStorage.getItem(lastCityKey);
      // Set search input to last city searched
      $('#search-city').attr("value", lastCity);
      // Append stored cities to page
      for (let i = 0; i < localStorage.length; i++) {
          let city = localStorage.getItem("cities" + i);
          let cityEl;

          // Append city to page
          $('#search-list').prepend(cityEl);
      }
  }  
}

function storeHistory(citySearchName) {
  var searchHistoryObj = {};

  if (searchHistoryArr.length === 0) {
    searchHistoryObj['city'] = citySearchName;
    searchHistoryArr.push(searchHistoryObj);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArr));
  } else {
    var checkHistory = searchHistoryArr.find(
      ({ city }) => city === citySearchName
    );

    if (searchHistoryArr.length < 5) {
      if (checkHistory === undefined) {
        searchHistoryObj['city'] = citySearchName;
        searchHistoryArr.push(searchHistoryObj);
        localStorage.setItem(
          'searchHistory',
          JSON.stringify(searchHistoryArr)
        );
      }
    } else {
      if (checkHistory === undefined) {
        searchHistoryArr.shift();
        searchHistoryObj['city'] = citySearchName;
        searchHistoryArr.push(searchHistoryObj);
        localStorage.setItem(
          'searchHistory',
          JSON.stringify(searchHistoryArr)
        );
      }
    }
  }
  $('#search-list').empty();
  displayHistory();
}

function displayHistory() {
  var getLocalSearchHistory = localStorage.getItem('searchHistory');
  var localSearchHistory = JSON.parse(getLocalSearchHistory);

  if (getLocalSearchHistory === null) {
    createHistory();
    getLocalSearchHistory = localStorage.getItem('searchHistory');
    localSearchHistory = JSON.parse(getLocalSearchHistory);
  }

  for (var i = 0; i < localSearchHistory.length; i++) {
    var historyLi = $('<li>');
    historyLi.addClass('list-group-item');
    historyLi.text(localSearchHistory[i].city);
    $('#search-list').prepend(historyLi);
    $('#history-container').show();
  }
  return (searchHistoryArr = localSearchHistory);
}

function createHistory() {
  searchHistoryArr.length = 0;
  localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArr));
}






