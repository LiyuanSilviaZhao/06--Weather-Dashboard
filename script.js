var APIKey = "0dfdd54d395928d4b417913dd112c602";

var formBtn = document.querySelector('button');
var formInput = document.querySelector('#inputInfo');

formBtn.addEventListener('click', handleFormClick);

function handleFormClick(event) {
    console.log(formInput)
    event.preventDefault();
    
    getApi(formInput.value.toUpperCase());
    formInput.value="";
}

function getApi(cityName) {
    var requestUrlGeo = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + ",US&limit=5&appid=" + APIKey;
    fetch(requestUrlGeo)
        .then(function (response) {
            var result = response.json();
            return result;
        }).then(function (geoData) {
            if(geoData[0] == undefined){
                alert(cityName + "not founded");
                return;
            }else{
                lat = geoData[0].lat;
                lon = geoData[0].lon;
            }
            var requestUrlToday = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;
            fetch(requestUrlToday)
                .then(function (response) {
                    return response.json();
                })
                .then(function(todayData) {

                    var todayInfo = {
                        Date:moment().format('l'),
                        Icon:todayData.weather[0].icon,
                        Temp:todayData.main.temp,
                        Wind:todayData.wind.speed,
                        Humidity:todayData.main.humidity
                    }

                               
                    var requestUrl5Days = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;
                    fetch(requestUrl5Days)
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function(futureData) {

                            var fiveDayInfo = [];
                            for (var i = 0; i < 5; i++) {
                                fiveDayInfo[i] = {
                                    Date : new Date(futureData.list[8*i + 3].dt*1000).toLocaleDateString("en-US"),
                                    Icon :futureData.list[8*i + 3].weather[0].icon,
                                    Temp : futureData.list[8*i + 3].main.temp,
                                    Wind : futureData.list[8*i + 3].wind.speed,
                                    Humidity : futureData.list[8*i + 3].main.humidity,
                                }
                            }

                            var weatherInfo = {
                                todayWeather:todayInfo,
                                futureWeather:fiveDayInfo
                            };

                            populateLocalStorageWithCityName(cityName);

                            renderWeatherInfo(weatherInfo, cityName);

                            renderSearchHistory();
                        })

                })
        
        });

}

function renderWeatherInfo(weatherInfo, cityName){
    var allWeatherInfo = weatherInfo;
    var todaySection = document.querySelector("#today-weather");

    todaySection.classList.add("today-box");
    todaySection.textContent = "";

    var name = document.createElement('span')
    var date = document.createElement('span');
    var icon = document.createElement('img');
    var temp = document.createElement('div');
    var wind = document.createElement('div');
    var humidity = document.createElement('div');

    name.textContent = cityName;
    name.classList.add("todayTitle");
    date.classList.add("todayTitle");  
    temp.classList.add("weatherInfoDiv");
    wind.classList.add("weatherInfoDiv");
    humidity.classList.add("weatherInfoDiv");

    date.textContent = "(" + allWeatherInfo.todayWeather.Date + ")";
    var a = allWeatherInfo.todayWeather.Icon;
    icon.src = "https://openweathermap.org/img/w/"+ a + ".png";
    temp.textContent = "Temp: " + allWeatherInfo.todayWeather.Temp + "°F";
    wind.textContent = "Wind: " + allWeatherInfo.todayWeather.Wind + " MPH";
    humidity.textContent = "Humidity: " + allWeatherInfo.todayWeather.Humidity + " %";


    todaySection.append(name);
    todaySection.append(date);
    todaySection.append(icon);
    todaySection.append(temp);
    todaySection.append(wind);
    todaySection.append(humidity);

    var fiveDaysTitle = document.querySelector("#future-weather-title")
    fiveDaysTitle.textContent = "5 Days forecast";

    var futureSection = document.querySelector("#future-weather");
    futureSection.textContent = "";

    for(var i=0; i< allWeatherInfo.futureWeather.length; i++){
        var futureDay = document.createElement('div');
        futureDay.classList.add("futureDay");

        var date = document.createElement('div');
        var icon = document.createElement('img');
        var temp = document.createElement('div');
        var wind = document.createElement('div'); 
        var humidity = document.createElement('div');

        date.classList.add("futureDate");
        temp.classList.add("futureInfoDiv");
        wind.classList.add("futureInfoDiv");
        humidity.classList.add("futureInfoDiv");

        date.textContent = allWeatherInfo.futureWeather[i].Date;
        icon.textContent = allWeatherInfo.futureWeather[i].Icon;
        var b = allWeatherInfo.futureWeather[i].Icon;
        icon.src = "https://openweathermap.org/img/w/"+ b + ".png";
        temp.textContent = "Temp: " + allWeatherInfo.futureWeather[i].Temp + "°F";
        wind.textContent = "Wind: " + allWeatherInfo.futureWeather[i].Wind + " MPH";
        humidity.textContent = "Humidity: " + allWeatherInfo.futureWeather[i].Humidity + " %";

        futureDay.append(date);
        futureDay.append(icon);
        futureDay.append(temp);
        futureDay.append(wind);
        futureDay.append(humidity);

        futureSection.append(futureDay);
    } 
}

function renderSearchHistory(){
    var searchedCities = document.querySelector("#checked-cities");
    searchedCities.textContent = "";
    for (var i = 0; i < localStorage.length; i++) {
        var keyName = document.createElement('div');
        keyName.classList.add("cityNameList");
        keyName.textContent = localStorage.key(i);
        keyName.addEventListener('click', historyClick, false);
        searchedCities.append(keyName);
    }
}

function historyClick(event) {
    getApi(event.target.textContent);
}

function populateLocalStorageWithCityName(cityName) {
    if (localStorage.getItem(cityName) === null) {
        localStorage.setItem(cityName, "");
    }
}

renderSearchHistory();