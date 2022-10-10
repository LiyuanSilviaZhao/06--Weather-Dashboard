//global variables ====
var APIKey = "0dfdd54d395928d4b417913dd112c602";
//var requestUrlGeo = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + APIKey;
var requestUrl5Days = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

//var cityName 
var cityName = "Atlanta";
var lat;
var lon;
var weatherQueryResult;


//function:search for a city==========
//get the input value (cityName), use GeoCode API, GET Coordination info
//Ues 5DAY API, with Coordination info, GET weather info - [need to read API Info]
// (city name,the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed)
//call render weather info 
//call render city History 

//function:get coordination/get API Geo info 
//get the input value (cityName), use GeoCode API, GET Coordination info =========

//funcion:get weather data info =============
//Ues 5DAY API, with Coordination info, GET weather info - [need to read API Info]
//localStorage.setItem(keyname, value) key="(cityName)", value=["date" "icon""temp" .............................]

function getApi(cityName) {
    var requestUrlGeo = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + ",US&limit=5&appid=" + APIKey;
    fetch(requestUrlGeo)
        .then(function (response) {
            var result = response.json();
            console.log('first return')
            console.log(result);
            return result;
        }).then(function (geoData) {
            console.log(geoData);
            lat = geoData[0].lat;
            lon = geoData[0].lon;

            var requestUrlToday = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
            fetch(requestUrlToday)
                .then(function (response) {
                    return response.json();
                })
                .then(function(todayData) {
                    console.log(todayData); 

                    var todayInfo = {
                        Date:moment().format('l'),
                        Icon:todayData.weather[0].icon,
                        Temp:todayData.main.temp,
                        Wind:todayData.wind.speed,
                        Humidity:todayData.main.humidity
                    }

                    console.log(todayInfo);
                               
                    var requestUrl5Days = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
                    fetch(requestUrl5Days)
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function(futureData) {
                            console.log(futureData); 

                            var fiveDayInfo = [];
                            for (var i = 0; i < 5; i++) {
                                fiveDayInfo[i] = {
                                    futureDate : new Date(futureData.list[8*i + 3].dt*1000).toLocaleDateString("en-US"),
                                    futureIcon :futureData.list[8*i + 3].weather[0].icon,
                                    futureTemp : futureData.list[8*i + 3].main.temp,
                                    futureWind : futureData.list[8*i + 3].wind.speed,
                                    futureHumidity : futureData.list[8*i + 3].main.humidity,
                                }
                            }
                            console.log(fiveDayInfo);

                            var weatherInfo = {
                                todayWeather:todayInfo,
                                futureWeather:fiveDayInfo
                            };

                            localStorage.setItem(cityName,JSON.stringify(weatherInfo));

                            renderWeatherInfo(cityName);
                        })

                })
        
        });

}




getApi(cityName);




//function: render weather info =========
//var ccccc = JSON.parse(localStorage.getItem("cityName")); 
//show them in the "weather" section,
// - today, querySelector("today-weather")
//for each info data, creat a div, add data eg: xxx.textcontext = xxx; append


function renderWeatherInfo(cityName){
    var allWeatherInfo = JSON.parse(localStorage.getItem(cityName));

    var showCityName = cityName;

    var todaySection = document.querySelector("#today-weather");
    var date = document.createElement('div');
    var icon = document.createElement('div');
    var temp = document.createElement('div');
    var wind = document.createElement('div');
    var humidity = document.createElement('div');

    date.textContent = allWeatherInfo.todayWeather.Date;
    icon.textContent = allWeatherInfo.todayWeather.Icon;
    temp.textContent = allWeatherInfo.todayWeather.Temp;
    wind.textContent = allWeatherInfo.todayWeather.Wind;
    humidity.textContent = allWeatherInfo.todayWeather.Humidity;

    todaySection.append(date);
    todaySection.append(icon);
    todaySection.append(temp);
    todaySection.append(wind);
    todaySection.append(humidity);

}

// - future days, querySelectorALL("futureDay")
//    for each future day
//      add DATA - for each info data, select corresponding div, add data eg: xxx.textcontext = xxx;
// for (var i = 0; i < futureDays.length; i++) {

// }
// array.forEach(element => {
//     var keyName = 
// });


//function:render city history ==========
//get all localstorage key values, show them in the "history" secion, eg; create Element, xxx.textContent=vale, append
// for all localStorage.length; var KeyName = localStorage.key(index);
// keyName
// create div
// set div conent to be keyname
// div.onclick=function(render weather info)
// append
// 




//when form is submitted, function:search for a city , cityName = input.val
//