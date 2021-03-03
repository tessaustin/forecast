//API Key
var APIkey = "a17e1499228be1f9c294ac18b234c7d7";

//display current date in title
var currentDate = moment().format("L");
$("#current-date").text("(" + currentDate + ")");

//clickable search btn
//function search() {
  $('#search-btn').on('click', function() {
    citySearch = $('#search-city')
      .val()
      .trim();

    if (citySearch === '') {
      return;
    }
    $('#search-city').val('');
    getWeather(citySearch);
  });
//}

//retreive current weather
function getWeather(search) {
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="
      + search
      + "&units=imperial"
      + APIkey;

      $.ajax ({
        type: "get",
        url: queryURL,
        error: function(val) {
          console.log('ERROR');
        },
        success: function(val) {
          console.log('SUCCESS');
        }
      });



};

//getWeather(saltLakeCity);