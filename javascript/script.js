let searchInp = document.querySelector('.search')

if (!localStorage.getItem('settingIp') && !localStorage.getItem('searchInput')) {
    searchInp.value = 'moscow'
    geopotision()
}

if (localStorage.getItem('settingIp') == 'true') {
    geopotision()
    localStorage.removeItem('searchInput')
    console.log()
}
if (localStorage.getItem('searchInput')) {
    searchInp.value = localStorage.getItem('searchInput')
    localStorage.removeItem('settingIp')
    document.title = `Прогноз погоды на 14 дней по пункту ${localStorage.getItem('searchInput')}`
    console.log(`Прогноз погоды на 14 дней по пункту ${localStorage.getItem('searchInput')} `)
    init()
}

function geopotision() {
    var script = document.createElement('script');
    script.src = "http://api-maps.yandex.ru/2.0/?load=package.full&lang=ru-RU";
    document.getElementsByTagName("head")[0].appendChild(script);
    var map;
    var city, country;

    function initt() {
        if (typeof ymaps === 'undefined' || typeof ymaps.geolocation === 'undefined') {
            setTimeout(initt, 100);
            return;
        }
        var geolocation = ymaps.geolocation;
        city = geolocation.city;
        country = geolocation.country;

        searchInp.value = city
        console.log(searchInp.value)

        document.title = `Прогноз погоды на 14 дней по пункту ${city} (${country})`
        console.log(`Прогноз погоды на 14 дней по пункту ${city} (${country})`)

        if (typeof city === 'undefined') {
            searchInp.value = 'Moscow'
            init()
        }//доделать
        init()

        console.log(city);
        console.log(country);
    }

    initt();
}

//https://api.openweathermap.org/data/2.5/forecast?q=london&appid=d982b206b7125a363d94918d08ebf560  несколько дней
let cityBlock = document.querySelector('#city')
let imgBlock = document.querySelector('.img-block')
/* let searchInp = document.querySelector('.search') */



var ru = 'ru'
var en = 'en'



searchInp.addEventListener('keyup', function (event) {
    if (event.code == 'Enter') {
        init()
        let coordinate = city.getBoundingClientRect()
        window.scrollTo(coordinate)

    }
});

btnGetWeather.addEventListener('click', function () {
    let coordinate = city.getBoundingClientRect()
    window.scrollTo(coordinate)
})


function init() {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${searchInp.value}&lang=ru&units=metric&appid=d56124c9a63a553d1cf6e1b4708b652c`)
        .then((resp) => { return resp.json() })
        .then((data) => {
            document.querySelector('.div-img').style.backgroundImage = `url(images/bg/${data.weather[0]['icon']}.jpg)`

            var cityData = city.textContent = `${data.name}`
            temp.innerHTML = Math.floor(data.main.temp) + '&deg;'

            //https://openweathermap.org/img/wn/04n@2x.png
            /* weatherInfo.innerHTML = `${data.weather[0]['description']}` */
            document.querySelector('.icon').innerHTML = `
        <img class='icon-image' src='images/icons/weather-icons/${data.weather[0]['icon']}.png'>
        <div>
            <p id="mainWeather" class="text"></p>
            <p id="feelsTemp"></p>    
        </div>
        `
            /* console.log(data.weather[0]['icon'])
            console.log(data.main.pressure) */


            document.querySelector('.weather-items').innerHTML = `
        <div class="weather-item">
            <img src="images/icons/icon-weter.png" alt="" width="26px" class="ico">
            <p id="windSpeed" class="result-text"></p>
        </div>

        <div class="weather-item">
            <img src="images/icons/icon-davlenie.png" alt="" width="26px" class="ico">
            <p id="pressure" class="result-text"></p>
        </div>

        <div class="weather-item">
            <img src="images/icons/icon-vlaga.png" alt="" width="26px" class="ico">
            <p id="humidity" class="result-text"></p>
        </div>
        `
            forecast5()
            if (document.querySelector('.forecasts')) {
                forecast14()
            }
            forecast16()

            feelsTemp.innerHTML = `Ощущается как:${Math.floor(data.main.feels_like) + '&deg;'}`
            mainWeather.innerHTML = `${data.weather['0']['description']}`

            let pressureMath = (data.main.pressure * 100) / 133.3
            pressure.innerHTML = `${pressureMath.toFixed(0)} мм рт. ст.`
            windSpeed.innerHTML = `${Math.floor(data.wind.speed)} м/с`
            humidity.innerHTML = `${data.main.humidity}%`


            /* 
                    function formateUnixMath(time){
                        let unix_timestamp = time
                        let date = new Date(unix_timestamp * 1000);
                        let hours = date.getHours();
                        let minutes = "0" + date.getMinutes();
                        let formattedTime = hours + ':' + minutes.substr(-2);
                        let MathTime =` ${hours}${minutes.substr(-2)}`
                        console.log(MathTime)
                        return MathTime
                    }//световой день
            
                    formateUnixMath(data.sys.sunrise)
                    let formatPreResult = ((+formateUnixMath(data.sys.sunset)) - (+formateUnixMath(data.sys.sunrise))).toString()
                    formatPreResult = ((+formatPreResult - 40) / 100).toString()
                    let formatArray = formatPreResult.split('.')
                    
                    if (formatArray[1] > 60){
                        let tempNum = formatArray[1] - 60
                        document.getElementById('dayNumbers').textContent = `${+formatArray[0]+1} ч ${tempNum} мин`//световой день
                    }
                    if(formatArray[1] < 60){
                        document.getElementById('dayNumbers').textContent = `${formatArray[0]} ч ${formatArray[1]} мин`//световой день
                    }
                
                    function formateUnix(time){
                        let unix_timestamp = time
                        let date = new Date(unix_timestamp * 1000);
                        let hours = date.getHours();
                        let minutes = "0" + date.getMinutes();
                        let formattedTime = hours + ':' + minutes.substr(-2);
                        return formattedTime
                    }//рассвет закат
            
                    console.log(formateUnix(data.sys.sunset))//закат
                    if(formatArray[0] < 0){
                        document.getElementById('dayNumbers').textContent = `${Math.abs(formatArray[0])} ч ${formatArray[1]} мин`//световой день
                        document.getElementById('sunrise').textContent = formateUnix(data.sys.sunset)//закат
                        document.getElementById('sunset').textContent = formateUnix(data.sys.sunrise)//закат
                    } 
            
                    if(formatArray[0] > 0){
                        document.getElementById('sunrise').textContent = formateUnix(data.sys.sunrise)//закат
                        document.getElementById('sunset').textContent = formateUnix(data.sys.sunset)//закат
                    } */

            document.querySelector('.wrapper_inpt').style.border = '0px solid'
            document.querySelector('.text-error').textContent = ''


        })
        .catch(() => {
            document.querySelector('.text-error').textContent = 'Введите коректное значение'
            searchInp.onfocus = function () {
                document.querySelector('.wrapper_inpt').style.border = '3px solid red'
            }
        })
}


//https://api.openweathermap.org/data/2.5/forecast?q=moscow&lang=ru&appid=d982b206b7125a363d94918d08ebf560
//https://api.openweathermap.org/data/2.5/roadrisk?appid={API key} дороги
function getDate(apiDate, dateHTML, monthHTML, numHTML) {
    var date = new Date(apiDate);
    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timezone: 'UTC',
    };
    var dateRu = date.toLocaleString("ru", options)
    var arrayDate = dateRu.split(" ");
    var months = ["Янв", "Февр", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сент", "Окт", "Нояб", "Дек"]
    /* var days =["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]; */
    var days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    /* console.log('Сегодня ' + days[date.getDay()]);//день по массиву
    console.log(months[date.getMonth()])//месяц
    console.log(arrayDate[1]) */
    dateHTML.innerHTML = `${days[date.getDay()]}`//день недели
    monthHTML.innerHTML = `${date.getDate()} ${months[date.getMonth()]} `//месяц
    /*    console.log('Сегодня '+arrayDate[1],arrayDate[2]);
       console.log(dateRu) */
}


function forecast5() {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchInp.value}&lang=ru&units=metric&appid=d56124c9a63a553d1cf6e1b4708b652c`)
        .then((resp) => { return resp.json() })
        .then((data) => {
            //fc - forecast  в сокращении
            function completionItem(dataList, fcTime, fcTemp, fcImg) {
                fcTime.innerHTML = `${(dataList.dt_txt).slice(11, 16)}`
                fcTemp.innerHTML = `${Math.floor(dataList.main.temp) + '&deg;'}`
                fcImg.setAttribute('src', `images/icons/weather-icons/${dataList.weather[0]['icon']}.png`)
            }
            completionItem(data.list[0], forecastTime1, forecastTemp1, forecastImg1)
            completionItem(data.list[1], forecastTime2, forecastTemp2, forecastImg2)
            completionItem(data.list[2], forecastTime3, forecastTemp3, forecastImg3)
            completionItem(data.list[3], forecastTime4, forecastTemp4, forecastImg4)
            completionItem(data.list[4], forecastTime5, forecastTemp5, forecastImg5)
        })
        .catch(() => {
        })
}
/* 
const weatherBitKey = 'b5c2395b868b44688abeff26638bc790' */
/* 0a114227ec774e45b5935a4ee837dbea  !22222!*/
/* eb6bdd65119048a4a80e55dbe229a701 */
function forecast16() {
    BtnForecast14.addEventListener('click', function () {
        if (!document.querySelector('.table')) {
            document.querySelector('.all-frc').insertAdjacentHTML('afterbegin', `

            <div class="forecasts">
                                <div class="pd-none boolleanTable">



                                    <div class="info-block"
                                        style="display: flex; align-items: center; padding: 42px; justify-content: space-between;">
                                        <div class="w-frc"
                                            style="border-right: 1px solid #eee;padding: 20px; width: 950px;">
                                            <table class="table">

                                                <tbody>

                                                    <tr style="border-bottom: 2px solid #eee;">

                                                        <th style="position: relative;">
                                                            <div class="td-content"
                                                                style="position: absolute; top: -12px;">
                                                                <p class="day-num today-color" id="dayNum"></p>
                                                                <div style="display: flex; flex-direction: column;">
                                                                    <p class="day-month today-color" id="dayMonth"></p>
                                                                    <p class="day-week today-color" id="dayWeek">cегодня
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </th>
                                                        <th></th>


                                                        <th style="padding-bottom: 32px;">
                                                            Давление<br>
                                                            мм рт. ст.</th>
                                                        <th style="padding-bottom: 32px;">Влажность</th>
                                                        <th style="padding-bottom: 32px;">Ветер м/c</th>
                                                        <th style="padding-bottom: 32px;">Ощущается как</th>
                                                    </tr>

                                                    <tr>
                                                        <td><span class="day-month">Утро</span> <br>
                                                            <p class="tb-text" id="tempMorning"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoMorning" alt="">
                                                                <p class="toot-text" id="descriptionMorning"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureMorning"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityMorning"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windMorning"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempMorning"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">День</span> <br>
                                                            <p class="tb-text" id="tempDay" style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoDay" alt="">
                                                                <p class="toot-text" id="descriptionDay"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureDay"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityDay"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windDay" style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempDay"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Вечер</span> <br>
                                                            <p class="tb-text" id="tempEvening"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoEvening" alt="">
                                                                <p class="toot-text" id="descriptionEvening"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureEvening"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityEvening"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windEvening"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempEvening"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>



                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Ночь</span> <br>
                                                            <p class="tb-text" id="tempNight"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoNigth" alt="">
                                                                <p class="toot-text" id="descriptionNight"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureNight"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityNight"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windNight"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempNight"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>


                                                </tbody>

                                            </table>
                                        </div>


                                        <div>
                                            <div class="astro-bl">
                                                <div>
                                                    <p class="astro-text text-align-c">Световой день</p>
                                                    <br>
                                                    <p id="dayNumbers" class="text-align-c sun-time"></p>
                                                    <div class="astro-mage"></div>
                                                    <div class="astro-content">
                                                        <div>
                                                            <!-- <img src="/images/icons/sunsire.png" alt="" srcset=""> -->
                                                            <p id="sunrise" class="sun-text"></p>
                                                        </div>

                                                        <img src="images/icons/planet.png" class="astro-img"
                                                            width="148px" alt="" srcset="">

                                                        <div>
                                                            <!-- <img src="images/icons/sunset.png" alt="" srcset=""> -->
                                                            <p id="sunset" class="sun-text"></p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                    <!-- 2 -->

                                    <div class="info-block"
                                        style="display: flex; align-items: center; padding: 42px; justify-content: space-between;">
                                        <div class="w-frc"
                                            style="border-right: 1px solid #eee;padding: 20px; width: 950px;">
                                            <table>

                                                <tbody>

                                                    <tr style="border-bottom: 2px solid #eee;">

                                                        <th style="position: relative;">
                                                            <div class="td-content"
                                                                style="position: absolute; top: -12px;">
                                                                <p class="day-num today-color" id="dayNum1"></p>
                                                                <div style="display: flex; flex-direction: column;">
                                                                    <p class="day-month today-color" id="dayMonth1"></p>
                                                                    <p class="day-week today-color" id="dayWeek1">Завтра
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </th>
                                                        <th></th>


                                                        <th style="padding-bottom: 32px;">
                                                            Давление<br>
                                                            мм рт. ст.</th>
                                                        <th style="padding-bottom: 32px;">Влажность</th>
                                                        <th style="padding-bottom: 32px;">Ветер м/c</th>
                                                        <th style="padding-bottom: 32px;">Ощущается как</th>
                                                    </tr>

                                                    <tr>
                                                        <td><span class="day-month">Утро</span> <br>
                                                            <p class="tb-text" id="tempMorning1"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoMorning1" alt="">
                                                                <p class="toot-text" id="descriptionMorning1"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureMorning1"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityMorning1"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windMorning1"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempMorning1"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">День</span> <br>
                                                            <p class="tb-text" id="tempDay1"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoDay1" alt="">
                                                                <p class="toot-text" id="descriptionDay1"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureDay1"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityDay1"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windDay1"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempDay1"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Вечер</span> <br>
                                                            <p class="tb-text" id="tempEvening1"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoEvening1" alt="">
                                                                <p class="toot-text" id="descriptionEvening1"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureEvening1"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityEvening1"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windEvening1"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempEvening1"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>



                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Ночь</span> <br>
                                                            <p class="tb-text" id="tempNight1"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoNigth1" alt="">
                                                                <p class="toot-text" id="descriptionNight1"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureNight1"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityNight1"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windNight1"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempNight1"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>


                                                </tbody>

                                            </table>
                                        </div>


                                        <div>
                                            <div class="astro-bl">
                                                <div>
                                                    <p class="astro-text text-align-c">Световой день</p>
                                                    <br>
                                                    <p id="dayNumbers1" class="text-align-c sun-time"></p>
                                                    <div class="astro-mage"></div>
                                                    <div class="astro-content">
                                                        <div>
                                                            <!-- <img src="/images/icons/sunsire.png" alt="" srcset=""> -->
                                                            <p id="sunrise1" class="sun-text"></p>
                                                        </div>

                                                        <img src="images/icons/planet.png" class="astro-img"
                                                            width="148px" alt="" srcset="">

                                                        <div>
                                                            <!-- <img src="images/icons/sunset.png" alt="" srcset=""> -->
                                                            <p id="sunset1" class="sun-text"></p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>


                                    <!-- 3 -->

                                    <div class="info-block"
                                        style="display: flex; align-items: center; padding: 42px; justify-content: space-between;">
                                        <div class="w-frc"
                                            style="border-right: 1px solid #eee;padding: 20px; width: 950px;">
                                            <table>

                                                <tbody>

                                                    <tr style="border-bottom: 2px solid #eee;">

                                                        <th style="position: relative;">
                                                            <div class="td-content"
                                                                style="position: absolute; top: -12px;">
                                                                <p class="day-num" id="dayNum2"></p>
                                                                <div style="display: flex; flex-direction: column;">
                                                                    <p class="day-month" id="dayMonth2"></p>
                                                                    <p class="day-week" id="dayWeek2">Завтра</p>
                                                                </div>
                                                            </div>
                                                        </th>
                                                        <th></th>


                                                        <th style="padding-bottom: 32px;">
                                                            Давление<br>
                                                            мм рт. ст.</th>
                                                        <th style="padding-bottom: 32px;">Влажность</th>
                                                        <th style="padding-bottom: 32px;">Ветер м/c</th>
                                                        <th style="padding-bottom: 32px;">Ощущается как</th>
                                                    </tr>

                                                    <tr>
                                                        <td><span class="day-month">Утро</span> <br>
                                                            <p class="tb-text" id="tempMorning2"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoMorning2" alt="">
                                                                <p class="toot-text" id="descriptionMorning2"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureMorning2"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityMorning2"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windMorning2"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempMorning2"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">День</span> <br>
                                                            <p class="tb-text" id="tempDay2"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoDay2" alt="">
                                                                <p class="toot-text" id="descriptionDay2"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureDay2"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityDay2"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windDay2"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempDay2"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Вечер</span> <br>
                                                            <p class="tb-text" id="tempEvening2"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoEvening2" alt="">
                                                                <p class="toot-text" id="descriptionEvening2"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureEvening2"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityEvening2"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windEvening2"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempEvening2"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>



                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Ночь</span> <br>
                                                            <p class="tb-text" id="tempNight2"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoNigth2" alt="">
                                                                <p class="toot-text" id="descriptionNight2"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureNight2"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityNight2"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windNight2"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempNight2"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>


                                                </tbody>

                                            </table>
                                        </div>


                                        <div>
                                            <div class="astro-bl">
                                                <div>
                                                    <p class="astro-text text-align-c">Световой день</p>
                                                    <br>
                                                    <p id="dayNumbers2" class="text-align-c sun-time"></p>
                                                    <div class="astro-mage"></div>
                                                    <div class="astro-content">
                                                        <div>
                                                            <!-- <img src="/images/icons/sunsire.png" alt="" srcset=""> -->
                                                            <p id="sunrise2" class="sun-text"></p>
                                                        </div>

                                                        <img src="images/icons/planet.png" class="astro-img"
                                                            width="148px" alt="" srcset="">

                                                        <div>
                                                            <!-- <img src="images/icons/sunset.png" alt="" srcset=""> -->
                                                            <p id="sunset2" class="sun-text"></p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                    <!-- 4 -->

                                    <div class="info-block"
                                        style="display: flex; align-items: center; padding: 42px; justify-content: space-between;">
                                        <div class="w-frc"
                                            style="border-right: 1px solid #eee;padding: 20px; width: 950px;">
                                            <table>

                                                <tbody>

                                                    <tr style="border-bottom: 2px solid #eee;">

                                                        <th style="position: relative;">
                                                            <div class="td-content"
                                                                style="position: absolute; top: -12px;">
                                                                <p class="day-num" id="dayNum3"></p>
                                                                <div style="display: flex; flex-direction: column;">
                                                                    <p class="day-month" id="dayMonth3"></p>
                                                                    <p class="day-week" id="dayWeek3">Завтра</p>
                                                                </div>
                                                            </div>
                                                        </th>
                                                        <th></th>


                                                        <th style="padding-bottom: 32px;">
                                                            Давление<br>
                                                            мм рт. ст.</th>
                                                        <th style="padding-bottom: 32px;">Влажность</th>
                                                        <th style="padding-bottom: 32px;">Ветер м/c</th>
                                                        <th style="padding-bottom: 32px;">Ощущается как</th>
                                                    </tr>

                                                    <tr>
                                                        <td><span class="day-month">Утро</span> <br>
                                                            <p class="tb-text" id="tempMorning3"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoMorning3" alt="">
                                                                <p class="toot-text" id="descriptionMorning3"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureMorning3"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityMorning3"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windMorning3"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempMorning3"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">День</span> <br>
                                                            <p class="tb-text" id="tempDay3"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoDay3" alt="">
                                                                <p class="toot-text" id="descriptionDay3"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureDay3"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityDay3"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windDay3"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempDay3"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Вечер</span> <br>
                                                            <p class="tb-text" id="tempEvening3"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoEvening3" alt="">
                                                                <p class="toot-text" id="descriptionEvening3"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureEvening3"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityEvening3"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windEvening3"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempEvening3"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>



                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Ночь</span> <br>
                                                            <p class="tb-text" id="tempNight3"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoNigth3" alt="">
                                                                <p class="toot-text" id="descriptionNight3"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureNight3"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityNight3"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windNight3"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempNight3"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>


                                                </tbody>

                                            </table>
                                        </div>


                                        <div>
                                            <div class="astro-bl">
                                                <div>
                                                    <p class="astro-text text-align-c">Световой день</p>
                                                    <br>
                                                    <p id="dayNumbers3" class="text-align-c sun-time"></p>
                                                    <div class="astro-mage"></div>
                                                    <div class="astro-content">
                                                        <div>
                                                            <!-- <img src="/images/icons/sunsire.png" alt="" srcset=""> -->
                                                            <p id="sunrise3" class="sun-text"></p>
                                                        </div>

                                                        <img src="images/icons/planet.png" class="astro-img"
                                                            width="148px" alt="" srcset="">

                                                        <div>
                                                            <!-- <img src="images/icons/sunset.png" alt="" srcset=""> -->
                                                            <p id="sunset3" class="sun-text"></p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                    <!-- 5 -->

                                    <div class="info-block"
                                        style="display: flex; align-items: center; padding: 42px; justify-content: space-between;">
                                        <div class="w-frc"
                                            style="border-right: 1px solid #eee;padding: 20px; width: 950px;">
                                            <table>

                                                <tbody>

                                                    <tr style="border-bottom: 2px solid #eee;">

                                                        <th style="position: relative;">
                                                            <div class="td-content"
                                                                style="position: absolute; top: -12px;">
                                                                <p class="day-num" id="dayNum4"></p>
                                                                <div style="display: flex; flex-direction: column;">
                                                                    <p class="day-month" id="dayMonth4"></p>
                                                                    <p class="day-week" id="dayWeek4">Завтра</p>
                                                                </div>
                                                            </div>
                                                        </th>
                                                        <th></th>


                                                        <th style="padding-bottom: 32px;">
                                                            Давление<br>
                                                            мм рт. ст.</th>
                                                        <th style="padding-bottom: 32px;">Влажность</th>
                                                        <th style="padding-bottom: 32px;">Ветер м/c</th>
                                                        <th style="padding-bottom: 32px;">Ощущается как</th>
                                                    </tr>

                                                    <tr>
                                                        <td><span class="day-month">Утро</span> <br>
                                                            <p class="tb-text" id="tempMorning4"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoMorning4" alt="">
                                                                <p class="toot-text" id="descriptionMorning4"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureMorning4"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityMorning4"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windMorning4"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempMorning4"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">День</span> <br>
                                                            <p class="tb-text" id="tempDay4"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoDay4" alt="">
                                                                <p class="toot-text" id="descriptionDay4"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureDay4"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityDay4"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windDay4"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempDay4"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Вечер</span> <br>
                                                            <p class="tb-text" id="tempEvening4"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoEvening4" alt="">
                                                                <p class="toot-text" id="descriptionEvening4"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureEvening4"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityEvening4"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windEvening4"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempEvening4"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>



                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Ночь</span> <br>
                                                            <p class="tb-text" id="tempNight4"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoNigth4" alt="">
                                                                <p class="toot-text" id="descriptionNight4"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureNight4"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityNight4"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windNight4"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempNight4"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>


                                                </tbody>

                                            </table>
                                        </div>


                                        <div>
                                            <div class="astro-bl">
                                                <div>
                                                    <p class="astro-text text-align-c">Световой день</p>
                                                    <br>
                                                    <p id="dayNumbers4" class="text-align-c sun-time"></p>
                                                    <div class="astro-mage"></div>
                                                    <div class="astro-content">
                                                        <div>
                                                            <!-- <img src="/images/icons/sunsire.png" alt="" srcset=""> -->
                                                            <p id="sunrise4" class="sun-text"></p>
                                                        </div>

                                                        <img src="images/icons/planet.png" class="astro-img"
                                                            width="148px" alt="" srcset="">

                                                        <div>
                                                            <!-- <img src="images/icons/sunset.png" alt="" srcset=""> -->
                                                            <p id="sunset4" class="sun-text"></p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                    <!-- 6 -->


                                    <div class="info-block"
                                        style="display: flex; align-items: center; padding: 42px; justify-content: space-between;">
                                        <div class="w-frc"
                                            style="border-right: 1px solid #eee;padding: 20px; width: 950px;">
                                            <table>

                                                <tbody>

                                                    <tr style="border-bottom: 2px solid #eee;">

                                                        <th style="position: relative;">
                                                            <div class="td-content"
                                                                style="position: absolute; top: -12px;">
                                                                <p class="day-num" id="dayNum5"></p>
                                                                <div style="display: flex; flex-direction: column;">
                                                                    <p class="day-month" id="dayMonth5"></p>
                                                                    <p class="day-week" id="dayWeek5">Завтра</p>
                                                                </div>
                                                            </div>
                                                        </th>
                                                        <th></th>


                                                        <th style="padding-bottom: 32px;">
                                                            Давление<br>
                                                            мм рт. ст.</th>
                                                        <th style="padding-bottom: 32px;">Влажность</th>
                                                        <th style="padding-bottom: 32px;">Ветер м/c</th>
                                                        <th style="padding-bottom: 32px;">Ощущается как</th>
                                                    </tr>

                                                    <tr>
                                                        <td><span class="day-month">Утро</span> <br>
                                                            <p class="tb-text" id="tempMorning5"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoMorning5" alt="">
                                                                <p class="toot-text" id="descriptionMorning5"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureMorning5"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityMorning5"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windMorning5"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempMorning5"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">День</span> <br>
                                                            <p class="tb-text" id="tempDay5"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoDay5" alt="">
                                                                <p class="toot-text" id="descriptionDay5"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureDay5"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityDay5"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windDay5"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempDay5"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Вечер</span> <br>
                                                            <p class="tb-text" id="tempEvening5"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoEvening5" alt="">
                                                                <p class="toot-text" id="descriptionEvening5"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureEvening5"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityEvening5"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windEvening5"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempEvening5"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>



                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Ночь</span> <br>
                                                            <p class="tb-text" id="tempNight5"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoNigth5" alt="">
                                                                <p class="toot-text" id="descriptionNight5"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureNight5"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityNight5"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windNight5"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempNight5"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>


                                                </tbody>

                                            </table>
                                        </div>


                                        <div>
                                            <div class="astro-bl">
                                                <div>
                                                    <p class="astro-text text-align-c">Световой день</p>
                                                    <br>
                                                    <p id="dayNumbers5" class="text-align-c sun-time"></p>
                                                    <div class="astro-mage"></div>
                                                    <div class="astro-content">
                                                        <div>
                                                            <!-- <img src="/images/icons/sunsire.png" alt="" srcset=""> -->
                                                            <p id="sunrise5" class="sun-text"></p>
                                                        </div>

                                                        <img src="images/icons/planet.png" class="astro-img"
                                                            width="148px" alt="" srcset="">

                                                        <div>
                                                            <!-- <img src="images/icons/sunset.png" alt="" srcset=""> -->
                                                            <p id="sunset5" class="sun-text"></p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>


                                    <!-- 6 -->

                                    <div class="info-block"
                                        style="display: flex; align-items: center; padding: 42px; justify-content: space-between;">
                                        <div class="w-frc"
                                            style="border-right: 1px solid #eee;padding: 20px; width: 950px;">
                                            <table>

                                                <tbody>

                                                    <tr style="border-bottom: 2px solid #eee;">

                                                        <th style="position: relative;">
                                                            <div class="td-content"
                                                                style="position: absolute; top: -12px;">
                                                                <p class="day-num" id="dayNum6"></p>
                                                                <div style="display: flex; flex-direction: column;">
                                                                    <p class="day-month" id="dayMonth6"></p>
                                                                    <p class="day-week" id="dayWeek6">Завтра</p>
                                                                </div>
                                                            </div>
                                                        </th>
                                                        <th></th>


                                                        <th style="padding-bottom: 32px;">
                                                            Давление<br>
                                                            мм рт. ст.</th>
                                                        <th style="padding-bottom: 32px;">Влажность</th>
                                                        <th style="padding-bottom: 32px;">Ветер м/c</th>
                                                        <th style="padding-bottom: 32px;">Ощущается как</th>
                                                    </tr>

                                                    <tr>
                                                        <td><span class="day-month">Утро</span> <br>
                                                            <p class="tb-text" id="tempMorning6"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoMorning6" alt="">
                                                                <p class="toot-text" id="descriptionMorning6"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureMorning6"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityMorning6"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windMorning6"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempMorning6"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">День</span> <br>
                                                            <p class="tb-text" id="tempDay6"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoDay6" alt="">
                                                                <p class="toot-text" id="descriptionDay6"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureDay6"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityDay6"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windDay6"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempDay6"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Вечер</span> <br>
                                                            <p class="tb-text" id="tempEvening6"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoEvening6" alt="">
                                                                <p class="toot-text" id="descriptionEvening6"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureEvening6"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityEvening6"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windEvening6"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempEvening6"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>



                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Ночь</span> <br>
                                                            <p class="tb-text" id="tempNight6"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoNigth6" alt="">
                                                                <p class="toot-text" id="descriptionNight6"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureNight6"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityNight6"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windNight6"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempNight6"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>


                                                </tbody>

                                            </table>
                                        </div>


                                        <div>
                                            <div class="astro-bl">
                                                <div>
                                                    <p class="astro-text text-align-c">Световой день</p>
                                                    <br>
                                                    <p id="dayNumbers6" class="text-align-c sun-time"></p>
                                                    <div class="astro-mage"></div>
                                                    <div class="astro-content">
                                                        <div>
                                                            <!-- <img src="/images/icons/sunsire.png" alt="" srcset=""> -->
                                                            <p id="sunrise6" class="sun-text"></p>
                                                        </div>

                                                        <img src="images/icons/planet.png" class="astro-img"
                                                            width="148px" alt="" srcset="">

                                                        <div>
                                                            <!-- <img src="images/icons/sunset.png" alt="" srcset=""> -->
                                                            <p id="sunset6" class="sun-text"></p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                    <!-- 7 -->

                                    <div class="info-block"
                                        style="display: flex; align-items: center; padding: 42px; justify-content: space-between;">
                                        <div class="w-frc"
                                            style="border-right: 1px solid #eee;padding: 20px; width: 950px;">
                                            <table>

                                                <tbody>

                                                    <tr style="border-bottom: 2px solid #eee;">

                                                        <th style="position: relative;">
                                                            <div class="td-content"
                                                                style="position: absolute; top: -12px;">
                                                                <p class="day-num" id="dayNum7"></p>
                                                                <div style="display: flex; flex-direction: column;">
                                                                    <p class="day-month" id="dayMonth7"></p>
                                                                    <p class="day-week" id="dayWeek7">Завтра</p>
                                                                </div>
                                                            </div>
                                                        </th>
                                                        <th></th>


                                                        <th style="padding-bottom: 32px;">
                                                            Давление<br>
                                                            мм рт. ст.</th>
                                                        <th style="padding-bottom: 32px;">Влажность</th>
                                                        <th style="padding-bottom: 32px;">Ветер м/c</th>
                                                        <th style="padding-bottom: 32px;">Ощущается как</th>
                                                    </tr>

                                                    <tr>
                                                        <td><span class="day-month">Утро</span> <br>
                                                            <p class="tb-text" id="tempMorning7"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoMorning7" alt="">
                                                                <p class="toot-text" id="descriptionMorning7"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureMorning7"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityMorning7"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windMorning7"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempMorning7"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">День</span> <br>
                                                            <p class="tb-text" id="tempDay7"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoDay7" alt="">
                                                                <p class="toot-text" id="descriptionDay7"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureDay7"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityDay7"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windDay7"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempDay7"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Вечер</span> <br>
                                                            <p class="tb-text" id="tempEvening7"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoEvening7" alt="">
                                                                <p class="toot-text" id="descriptionEvening7"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureEvening7"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityEvening7"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windEvening7"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempEvening7"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>



                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Ночь</span> <br>
                                                            <p class="tb-text" id="tempNight7"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoNigth7" alt="">
                                                                <p class="toot-text" id="descriptionNight7"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureNight7"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityNight7"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windNight7"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempNight7"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>


                                                </tbody>

                                            </table>
                                        </div>


                                        <div>
                                            <div class="astro-bl">
                                                <div>
                                                    <p class="astro-text text-align-c">Световой день</p>
                                                    <br>
                                                    <p id="dayNumbers7" class="text-align-c sun-time"></p>
                                                    <div class="astro-mage"></div>
                                                    <div class="astro-content">
                                                        <div>
                                                            <!-- <img src="/images/icons/sunsire.png" alt="" srcset=""> -->
                                                            <p id="sunrise7" class="sun-text"></p>
                                                        </div>

                                                        <img src="images/icons/planet.png" class="astro-img"
                                                            width="148px" alt="" srcset="">

                                                        <div>
                                                            <!-- <img src="images/icons/sunset.png" alt="" srcset=""> -->
                                                            <p id="sunset7" class="sun-text"></p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>



                                    <!-- 8 -->

                                    <div class="info-block"
                                        style="display: flex; align-items: center; padding: 42px; justify-content: space-between;">
                                        <div class="w-frc"
                                            style="border-right: 1px solid #eee;padding: 20px; width: 950px;">
                                            <table>

                                                <tbody>

                                                    <tr style="border-bottom: 2px solid #eee;">

                                                        <th style="position: relative;">
                                                            <div class="td-content"
                                                                style="position: absolute; top: -12px;">
                                                                <p class="day-num" id="dayNum8"></p>
                                                                <div style="display: flex; flex-direction: column;">
                                                                    <p class="day-month" id="dayMonth8"></p>
                                                                    <p class="day-week" id="dayWeek8">Завтра</p>
                                                                </div>
                                                            </div>
                                                        </th>
                                                        <th></th>


                                                        <th style="padding-bottom: 32px;">
                                                            Давление<br>
                                                            мм рт. ст.</th>
                                                        <th style="padding-bottom: 32px;">Влажность</th>
                                                        <th style="padding-bottom: 32px;">Ветер м/c</th>
                                                        <th style="padding-bottom: 32px;">Ощущается как</th>
                                                    </tr>

                                                    <tr>
                                                        <td><span class="day-month">Утро</span> <br>
                                                            <p class="tb-text" id="tempMorning8"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoMorning8" alt="">
                                                                <p class="toot-text" id="descriptionMorning8"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureMorning8"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityMorning8"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windMorning8"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempMorning8"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">День</span> <br>
                                                            <p class="tb-text" id="tempDay8"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoDay8" alt="">
                                                                <p class="toot-text" id="descriptionDay8"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureDay8"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityDay8"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windDay8"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempDay8"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Вечер</span> <br>
                                                            <p class="tb-text" id="tempEvening8"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoEvening8" alt="">
                                                                <p class="toot-text" id="descriptionEvening8"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureEvening8"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityEvening8"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windEvening8"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempEvening8"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>



                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Ночь</span> <br>
                                                            <p class="tb-text" id="tempNight8"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoNigth8" alt="">
                                                                <p class="toot-text" id="descriptionNight8"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureNight8"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityNight8"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windNight8"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempNight8"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>


                                                </tbody>

                                            </table>
                                        </div>


                                        <div>
                                            <div class="astro-bl">
                                                <div>
                                                    <p class="astro-text text-align-c">Световой день</p>
                                                    <br>
                                                    <p id="dayNumbers8" class="text-align-c sun-time"></p>
                                                    <div class="astro-mage"></div>
                                                    <div class="astro-content">
                                                        <div>
                                                            <!-- <img src="/images/icons/sunsire.png" alt="" srcset=""> -->
                                                            <p id="sunrise8" class="sun-text"></p>
                                                        </div>

                                                        <img src="images/icons/planet.png" class="astro-img"
                                                            width="148px" alt="" srcset="">

                                                        <div>
                                                            <!-- <img src="images/icons/sunset.png" alt="" srcset=""> -->
                                                            <p id="sunset8" class="sun-text"></p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                    <!-- 9 -->

                                    <div class="info-block"
                                        style="display: flex; align-items: center; padding: 42px; justify-content: space-between;">
                                        <div class="w-frc"
                                            style="border-right: 1px solid #eee;padding: 20px; width: 950px;">
                                            <table>

                                                <tbody>

                                                    <tr style="border-bottom: 2px solid #eee;">

                                                        <th style="position: relative;">
                                                            <div class="td-content"
                                                                style="position: absolute; top: -12px;">
                                                                <p class="day-num" id="dayNum9"></p>
                                                                <div style="display: flex; flex-direction: column;">
                                                                    <p class="day-month" id="dayMonth9"></p>
                                                                    <p class="day-week" id="dayWeek9">Завтра</p>
                                                                </div>
                                                            </div>
                                                        </th>
                                                        <th></th>


                                                        <th style="padding-bottom: 32px;">
                                                            Давление<br>
                                                            мм рт. ст.</th>
                                                        <th style="padding-bottom: 32px;">Влажность</th>
                                                        <th style="padding-bottom: 32px;">Ветер м/c</th>
                                                        <th style="padding-bottom: 32px;">Ощущается как</th>
                                                    </tr>

                                                    <tr>
                                                        <td><span class="day-month">Утро</span> <br>
                                                            <p class="tb-text" id="tempMorning9"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoMorning9" alt="">
                                                                <p class="toot-text" id="descriptionMorning9"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureMorning9"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityMorning9"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windMorning9"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempMorning9"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">День</span> <br>
                                                            <p class="tb-text" id="tempDay9"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoDay9" alt="">
                                                                <p class="toot-text" id="descriptionDay9"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureDay9"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityDay9"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windDay9"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempDay9"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Вечер</span> <br>
                                                            <p class="tb-text" id="tempEvening9"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoEvening9" alt="">
                                                                <p class="toot-text" id="descriptionEvening9"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureEvening9"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityEvening9"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windEvening9"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempEvening9"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>



                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Ночь</span> <br>
                                                            <p class="tb-text" id="tempNight9"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoNigth9" alt="">
                                                                <p class="toot-text" id="descriptionNight9"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureNight9"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityNight9"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windNight9"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempNight9"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>


                                                </tbody>

                                            </table>
                                        </div>


                                        <div>
                                            <div class="astro-bl">
                                                <div>
                                                    <p class="astro-text text-align-c">Световой день</p>
                                                    <br>
                                                    <p id="dayNumbers9" class="text-align-c sun-time"></p>
                                                    <div class="astro-mage"></div>
                                                    <div class="astro-content">
                                                        <div>
                                                            <!-- <img src="/images/icons/sunsire.png" alt="" srcset=""> -->
                                                            <p id="sunrise9" class="sun-text"></p>
                                                        </div>

                                                        <img src="images/icons/planet.png" class="astro-img"
                                                            width="148px" alt="" srcset="">

                                                        <div>
                                                            <!-- <img src="images/icons/sunset.png" alt="" srcset=""> -->
                                                            <p id="sunset9" class="sun-text"></p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>


                                    <!-- 10 -->

                                    <div class="info-block"
                                        style="display: flex; align-items: center; padding: 42px; justify-content: space-between;">
                                        <div class="w-frc"
                                            style="border-right: 1px solid #eee;padding: 20px; width: 950px;">
                                            <table>

                                                <tbody>

                                                    <tr style="border-bottom: 2px solid #eee;">

                                                        <th style="position: relative;">
                                                            <div class="td-content"
                                                                style="position: absolute; top: -12px;">
                                                                <p class="day-num" id="dayNum10"></p>
                                                                <div style="display: flex; flex-direction: column;">
                                                                    <p class="day-month" id="dayMonth10"></p>
                                                                    <p class="day-week" id="dayWeek10">Завтра</p>
                                                                </div>
                                                            </div>
                                                        </th>
                                                        <th></th>


                                                        <th style="padding-bottom: 32px;">
                                                            Давление<br>
                                                            мм рт. ст.</th>
                                                        <th style="padding-bottom: 32px;">Влажность</th>
                                                        <th style="padding-bottom: 32px;">Ветер м/c</th>
                                                        <th style="padding-bottom: 32px;">Ощущается как</th>
                                                    </tr>

                                                    <tr>
                                                        <td><span class="day-month">Утро</span> <br>
                                                            <p class="tb-text" id="tempMorning10"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoMorning10" alt="">
                                                                <p class="toot-text" id="descriptionMorning10"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureMorning10"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityMorning10"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windMorning10"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempMorning10"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">День</span> <br>
                                                            <p class="tb-text" id="tempDay10"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoDay10" alt="">
                                                                <p class="toot-text" id="descriptionDay10"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureDay10"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityDay10"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windDay10"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempDay10"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Вечер</span> <br>
                                                            <p class="tb-text" id="tempEvening10"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoEvening10" alt="">
                                                                <p class="toot-text" id="descriptionEvening10"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureEvening10"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityEvening10"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windEvening10"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempEvening10"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>



                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Ночь</span> <br>
                                                            <p class="tb-text" id="tempNight10"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoNigth10" alt="">
                                                                <p class="toot-text" id="descriptionNight10"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureNight10"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityNight10"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windNight10"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempNight10"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>


                                                </tbody>

                                            </table>
                                        </div>


                                        <div>
                                            <div class="astro-bl">
                                                <div>
                                                    <p class="astro-text text-align-c">Световой день</p>
                                                    <br>
                                                    <p id="dayNumbers10" class="text-align-c sun-time"></p>
                                                    <div class="astro-mage"></div>
                                                    <div class="astro-content">
                                                        <div>
                                                            <!-- <img src="/images/icons/sunsire.png" alt="" srcset=""> -->
                                                            <p id="sunrise10" class="sun-text"></p>
                                                        </div>

                                                        <img src="images/icons/planet.png" class="astro-img"
                                                            width="148px" alt="" srcset="">

                                                        <div>
                                                            <!-- <img src="images/icons/sunset.png" alt="" srcset=""> -->
                                                            <p id="sunset10" class="sun-text"></p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                    <!-- 11 -->

                                    <div class="info-block"
                                        style="display: flex; align-items: center; padding: 42px; justify-content: space-between;">
                                        <div style="border-right: 1px solid #eee;padding: 20px;width: 950px;">
                                            <table>

                                                <tbody>

                                                    <tr style="border-bottom: 2px solid #eee;">

                                                        <th style="position: relative;">
                                                            <div class="td-content"
                                                                style="position: absolute; top: -12px;">
                                                                <p class="day-num" id="dayNum11"></p>
                                                                <div style="display: flex; flex-direction: column;">
                                                                    <p class="day-month" id="dayMonth11"></p>
                                                                    <p class="day-week" id="dayWeek11">Завтра</p>
                                                                </div>
                                                            </div>
                                                        </th>
                                                        <th></th>


                                                        <th style="padding-bottom: 32px;">
                                                            Давление<br>
                                                            мм рт. ст.</th>
                                                        <th style="padding-bottom: 32px;">Влажность</th>
                                                        <th style="padding-bottom: 32px;">Ветер м/c</th>
                                                        <th style="padding-bottom: 32px;">Ощущается как</th>
                                                    </tr>

                                                    <tr>
                                                        <td><span class="day-month">Утро</span> <br>
                                                            <p class="tb-text" id="tempMorning11"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoMorning11" alt="">
                                                                <p class="toot-text" id="descriptionMorning11"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureMorning11"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityMorning11"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windMorning11"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempMorning11"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">День</span> <br>
                                                            <p class="tb-text" id="tempDay11"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoDay11" alt="">
                                                                <p class="toot-text" id="descriptionDay11"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureDay11"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityDay11"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windDay11"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempDay11"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Вечер</span> <br>
                                                            <p class="tb-text" id="tempEvening11"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoEvening11" alt="">
                                                                <p class="toot-text" id="descriptionEvening11"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureEvening11"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityEvening11"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windEvening11"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempEvening11"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>



                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Ночь</span> <br>
                                                            <p class="tb-text" id="tempNight11"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoNigth11" alt="">
                                                                <p class="toot-text" id="descriptionNight11"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureNight11"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityNight11"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windNight11"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempNight11"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>


                                                </tbody>

                                            </table>
                                        </div>


                                        <div>
                                            <div class="astro-bl">
                                                <div>
                                                    <p class="astro-text text-align-c">Световой день</p>
                                                    <br>
                                                    <p id="dayNumbers11" class="text-align-c sun-time"></p>
                                                    <div class="astro-mage"></div>
                                                    <div class="astro-content">
                                                        <div>
                                                            <!-- <img src="/images/icons/sunsire.png" alt="" srcset=""> -->
                                                            <p id="sunrise11" class="sun-text"></p>
                                                        </div>

                                                        <img src="images/icons/planet.png" class="astro-img"
                                                            width="148px" alt="" srcset="">

                                                        <div>
                                                            <!-- <img src="images/icons/sunset.png" alt="" srcset=""> -->
                                                            <p id="sunset11" class="sun-text"></p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                    <!-- 12 -->


                                    <div class="info-block"
                                        style="display: flex; align-items: center; padding: 42px; justify-content: space-between;">
                                        <div class="w-frc"
                                            style="border-right: 1px solid #eee;padding: 20px; width: 950px;">
                                            <table>

                                                <tbody>

                                                    <tr style="border-bottom: 2px solid #eee;">

                                                        <th style="position: relative;">
                                                            <div class="td-content"
                                                                style="position: absolute; top: -12px;">
                                                                <p class="day-num" id="dayNum12"></p>
                                                                <div style="display: flex; flex-direction: column;">
                                                                    <p class="day-month" id="dayMonth12"></p>
                                                                    <p class="day-week" id="dayWeek12">Завтра</p>
                                                                </div>
                                                            </div>
                                                        </th>
                                                        <th></th>


                                                        <th style="padding-bottom: 32px;">
                                                            Давление<br>
                                                            мм рт. ст.</th>
                                                        <th style="padding-bottom: 32px;">Влажность</th>
                                                        <th style="padding-bottom: 32px;">Ветер м/c</th>
                                                        <th style="padding-bottom: 32px;">Ощущается как</th>
                                                    </tr>

                                                    <tr>
                                                        <td><span class="day-month">Утро</span> <br>
                                                            <p class="tb-text" id="tempMorning12"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoMorning12" alt="">
                                                                <p class="toot-text" id="descriptionMorning12"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureMorning12"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityMorning12"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windMorning12"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempMorning12"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">День</span> <br>
                                                            <p class="tb-text" id="tempDay12"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoDay12" alt="">
                                                                <p class="toot-text" id="descriptionDay12"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureDay12"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityDay12"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windDay12"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempDay12"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Вечер</span> <br>
                                                            <p class="tb-text" id="tempEvening12"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoEvening12" alt="">
                                                                <p class="toot-text" id="descriptionEvening12"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureEvening12"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityEvening12"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windEvening12"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempEvening12"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>



                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Ночь</span> <br>
                                                            <p class="tb-text" id="tempNight12"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoNigth12" alt="">
                                                                <p class="toot-text" id="descriptionNight12"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureNight12"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityNight12"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windNight12"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempNight12"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>


                                                </tbody>

                                            </table>
                                        </div>


                                        <div>
                                            <div class="astro-bl">
                                                <div>
                                                    <p class="astro-text text-align-c">Световой день</p>
                                                    <br>
                                                    <p id="dayNumbers12" class="text-align-c sun-time"></p>
                                                    <div class="astro-mage"></div>
                                                    <div class="astro-content">
                                                        <div>
                                                            <!-- <img src="/images/icons/sunsire.png" alt="" srcset=""> -->
                                                            <p id="sunrise12" class="sun-text"></p>
                                                        </div>

                                                        <img src="images/icons/planet.png" class="astro-img"
                                                            width="148px" alt="" srcset="">

                                                        <div>
                                                            <!-- <img src="images/icons/sunset.png" alt="" srcset=""> -->
                                                            <p id="sunset12" class="sun-text"></p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>


                                    <!-- 13 -->

                                    <div class="info-block"
                                        style="display: flex; align-items: center; padding: 42px; justify-content: space-between;">
                                        <div class="w-frc"
                                            style="border-right: 1px solid #eee;padding: 20px; width: 950px;">
                                            <table>

                                                <tbody>

                                                    <tr style="border-bottom: 2px solid #eee;">

                                                        <th style="position: relative;">
                                                            <div class="td-content"
                                                                style="position: absolute; top: -12px;">
                                                                <p class="day-num" id="dayNum13"></p>
                                                                <div style="display: flex; flex-direction: column;">
                                                                    <p class="day-month" id="dayMonth13"></p>
                                                                    <p class="day-week" id="dayWeek13">Завтра</p>
                                                                </div>
                                                            </div>
                                                        </th>
                                                        <th></th>


                                                        <th style="padding-bottom: 32px;">
                                                            Давление<br>
                                                            мм рт. ст.</th>
                                                        <th style="padding-bottom: 32px;">Влажность</th>
                                                        <th style="padding-bottom: 32px;">Ветер м/c</th>
                                                        <th style="padding-bottom: 32px;">Ощущается как</th>
                                                    </tr>

                                                    <tr>
                                                        <td><span class="day-month">Утро</span> <br>
                                                            <p class="tb-text" id="tempMorning13"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoMorning13" alt="">
                                                                <p class="toot-text" id="descriptionMorning13"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureMorning13"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityMorning13"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windMorning13"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempMorning13"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">День</span> <br>
                                                            <p class="tb-text" id="tempDay13"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoDay13" alt="">
                                                                <p class="toot-text" id="descriptionDay13"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureDay13"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityDay13"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windDay13"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempDay13"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Вечер</span> <br>
                                                            <p class="tb-text" id="tempEvening13"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoEvening13" alt="">
                                                                <p class="toot-text" id="descriptionEvening13"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureEvening13"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityEvening13"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windEvening13"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempEvening13"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>



                                                    <tr>
                                                        <td class="day-month"><span class="day-month">Ночь</span> <br>
                                                            <p class="tb-text" id="tempNight13"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <div class="td-content">
                                                                <img class="frcImg" id="icoNigth13" alt="">
                                                                <p class="toot-text" id="descriptionNight13"></p>

                                                            </div>

                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="pressureNight13"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="humidityNight13"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="windNight13"
                                                                style="text-align: center;"></p>
                                                        </td>
                                                        <td>
                                                            <p class="tb-text" id="feelsTempNight13"
                                                                style="text-align: center;">
                                                            </p>
                                                        </td>
                                                    </tr>


                                                </tbody>

                                            </table>
                                        </div>


                                        <div>
                                            <div class="astro-bl">
                                                <div>
                                                    <p class="astro-text text-align-c">Световой день</p>
                                                    <br>
                                                    <p id="dayNumbers13" class="text-align-c sun-time"></p>
                                                    <div class="astro-mage"></div>
                                                    <div class="astro-content">
                                                        <div>
                                                            <!-- <img src="/images/icons/sunsire.png" alt="" srcset=""> -->
                                                            <p id="sunrise13" class="sun-text"></p>
                                                        </div>

                                                        <img src="images/icons/planet.png" class="astro-img"
                                                            width="148px" alt="" srcset="">

                                                        <div>
                                                            <!-- <img src="images/icons/sunset.png" alt="" srcset=""> -->
                                                            <p id="sunset13" class="sun-text"></p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                </div><!-- info-block -->
                            </div>
            
            `)

            /* function upDate7(){
                setDataToItem(forecastDate, forecastLongTemp,forecastPop,forecastSpeed,forecastMonth,forecastDate,forecastLongImg,0)
                setDataToItem(forecastDate2, forecastLongTemp2,forecastPop2,forecastSpeed2,forecastMonth2,forecastDate2,forecastLongImg2,1)
                setDataToItem(forecastDate3, forecastLongTemp3,forecastPop3,forecastSpeed3,forecastMonth3,forecastDate3,forecastLongImg3,2)
                setDataToItem(forecastDate4, forecastLongTemp4,forecastPop4,forecastSpeed4,forecastMonth4,forecastDate4,forecastLongImg4,3)
                setDataToItem(forecastDate5, forecastLongTemp5,forecastPop5,forecastSpeed5,forecastMonth5,forecastDate5,forecastLongImg5,4)
                setDataToItem(forecastDate6, forecastLongTemp6,forecastPop6,forecastSpeed6,forecastMonth6,forecastDate6,forecastLongImg6,5)
                setDataToItem(forecastDate7, forecastLongTemp7,forecastPop7,forecastSpeed7,forecastMonth7,forecastDate7,forecastLongImg7,6) 
            }
            upDate7()   */
            forecast14()
        }
        BtnForecast14.classList.add('forecast-btn-activated')
        BtnPastMonth.classList.remove('forecast-btn-activated');
        document.getElementById('historyWeather').classList.remove('forecast-btn-activated')
        if (document.querySelector('#cvv')) {
            document.querySelector('#cvv').remove()
        }

        if (buttonTemp = document.getElementById('buttonTemp')) {
            console.log('удалил')
            document.getElementById('buttonTemp').remove()
            document.getElementById('buttonPressure').remove()
            document.getElementById('buttonWind').remove()
            document.getElementById('buttonDavlenie').remove()

        }
        if (document.getElementById('histBl')) {
            document.getElementById('histBl').remove()
        }

    })/* forecast14 */



    BtnPastMonth.addEventListener('click', function () {

        BtnPastMonth.classList.add('forecast-btn-activated')
        BtnForecast14.classList.remove('forecast-btn-activated');
        document.getElementById('historyWeather').classList.remove('forecast-btn-activated');

        /* BtnForecast7.classList.remove('forecast-btn-activated');  */

        if (document.getElementById('histBl')) {
            document.getElementById('histBl').remove()
        }

        if (!document.querySelector('#buttonTemp')) {
            document.querySelector('.btns').insertAdjacentHTML('beforeend', `
                <button class='forecast-btn weather-btn-activated' id='buttonTemp'>Температура</button>
                `)
        }

        if (!document.querySelector('#buttonWind')) {
            document.querySelector('.btns').insertAdjacentHTML('beforeend', `
                <button class='forecast-btn' id='buttonWind'></button>
                `)
        }

        if (!document.querySelector('#buttonPressure')) {
            document.querySelector('.btns').insertAdjacentHTML('beforeend', `
                <button class='forecast-btn' id='buttonPressure'></button>
                `)
        }
        if (!document.querySelector('#buttonDavlenie')) {
            document.querySelector('.btns').insertAdjacentHTML('beforeend', `
                <button class='forecast-btn' id='buttonDavlenie'></button>
                `)
        }




        if (document.querySelector('.forecasts')) {
            document.querySelector('.forecasts').remove()
        }
        if (BtnForecast14.hasAttribute('forecast-btn-activated')) {
            BtnForecast14.classList.remove('forecast-btn-activated');
        }
        /* if(BtnForecast7.hasAttribute('forecast-btn-activated')){
            BtnForecast7.classList.remove('forecast-btn-activated'); 
        }    */
        if (!document.getElementById('myChart')) {
            document.querySelector('.cvvAdd').insertAdjacentHTML('afterbegin', `

                <div class="ccv info-block" id="cvv">
                     <canvas id="myChart" width="400" height="400"></canvas>
                </div>
               
                `)
            historyWeather()
        }

    })

}



function historyWeather() {
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchInp.value}/last30days?include=fcst%2Cobs%2Chistfcst%2Cstats&key=WWDR4ETDJE959JZFAVRAK27F2&options=preview&lang=ru&contentType=json`)
        .then((resp) => { return resp.json() })
        .then((data) => {

            const ctx = document.getElementById('myChart');
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [getMonth(data.days[0].datetime, 0), getMonth(data.days[1].datetime, 1), getMonth(data.days[2].datetime, 2), getMonth(data.days[3].datetime, 3), getMonth(data.days[4].datetime, 4), getMonth(data.days[5].datetime, 5), getMonth(data.days[6].datetime, 6), getMonth(data.days[7].datetime, 7), getMonth(data.days[8].datetime, 8), getMonth(data.days[9].datetime, 9), getMonth(data.days[10].datetime, 10), getMonth(data.days[11].datetime, 11), getMonth(data.days[12].datetime, 12), getMonth(data.days[13].datetime, 13), getMonth(data.days[14].datetime, 14), getMonth(data.days[15].datetime, 15), getMonth(data.days[16].datetime, 16), getMonth(data.days[17].datetime, 17), getMonth(data.days[18].datetime, 18), getMonth(data.days[19].datetime, 19), getMonth(data.days[20].datetime, 20), getMonth(data.days[21].datetime, 21), getMonth(data.days[22].datetime, 22), getMonth(data.days[23].datetime, 23), getMonth(data.days[24].datetime, 24), getMonth(data.days[25].datetime, 25), getMonth(data.days[26].datetime, 26)],
                    datasets: [{
                        label: `Температура `,
                        data: [convectorF(0), convectorF(1), convectorF(2), convectorF(3), convectorF(4), convectorF(5), convectorF(6), convectorF(7), convectorF(8), convectorF(9), convectorF(10), convectorF(11), convectorF(12), convectorF(13), convectorF(14), convectorF(15), convectorF(16), convectorF(17), convectorF(18), convectorF(19), convectorF(20), convectorF(21), convectorF(22), convectorF(23), convectorF(24), convectorF(25), convectorF(26),],
                        backgroundColor: [
                            '#ecf4ff'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 4
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            function sliceDateTime(daysNum) {
                return (data.days[daysNum].datetime).slice(5)
            }
            function convectorF(dayNum) {
                return Math.floor((data.days[dayNum].temp - 32) * 5 / 9)
            }
            function windSpeed(dayNum) {
                return Math.floor((data.days[dayNum].windspeed) * 0.28)

            }
            function pressure(dayNum) {
                return data.days[dayNum].normal.precip
            }
            function ConvectorMilibar(dayNum) {
                return Math.floor((data.days[dayNum].pressure * 100) / 133.3)
            }


            /* console.log(windspeed(3)) */



            for (let cityName of document.querySelectorAll('.city-name')) {
                cityName.addEventListener('click', function (event) {
                    searchInp.value = event.target.textContent
                    init()
                    myChart.destroy()
                    historyWeather()
                    let coordinate = city.getBoundingClientRect()
                    window.scrollTo(coordinate);
                })
            }

            function getMonth(apiDate, daysNum) {
                let date = new Date(apiDate);
                let options = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                    timezone: 'UTC',
                };
                let dateRu = date.toLocaleString("ru", options)
                let arrayDate = dateRu.split(" ");
                let months = ["Янв", "Февр", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сент", "Окт", "Нояб", "Дек"]
                let perem = months[date.getMonth()]

                let result = ` ${(data.days[daysNum].datetime).slice(8)} `
                return months[date.getMonth()] + result
            }

            btnGetWeather.addEventListener('click', function () {
                if (BtnPastMonth.classList.contains('forecast-btn-activated')) {
                    console.log('Attr есть')
                    myChart.destroy();//с destroy() информация обновляется и с функцией historyWeather()
                    historyWeather()
                    /* Chart.datasets.data.push([45, 45, 45, 15, 3]); */
                }
            })

            searchInp.addEventListener('keyup', function (event) {
                if (event.code == 'Enter') {

                    console.log('Attr есть')
                    if (myChart) {
                        myChart.destroy();//с destroy() информация обновляется и с функцией historyWeather()
                        historyWeather()
                    }

                    init()
                }
            });


            document.getElementById('buttonWind').addEventListener('click', function () {

                addData(myChart, [windSpeed(0), windSpeed(1), windSpeed(2), windSpeed(3), windSpeed(4), windSpeed(5), windSpeed(6), windSpeed(7), windSpeed(8), windSpeed(9), windSpeed(10), windSpeed(11), windSpeed(12), windSpeed(13), windSpeed(14), windSpeed(15), windSpeed(16), windSpeed(17), windSpeed(18), windSpeed(19), windSpeed(20), windSpeed(21), windSpeed(22), windSpeed(23), windSpeed(24), windSpeed(25), windSpeed(26)], 0);

                function addData(chart, data, datasetIndex) {
                    chart.data.datasets[datasetIndex].data = data;
                    chart.data.datasets[datasetIndex].borderColor = ["rgba(153, 102, 255, 1)"]
                    chart.data.datasets[datasetIndex].label = `Скорость ветра в м/c`
                    chart.update();
                }




                document.querySelector('#buttonWind').classList.add('weather-btn-activated')
                document.querySelector('#buttonTemp').classList.remove('weather-btn-activated');
                document.querySelector('#buttonPressure').classList.remove('weather-btn-activated');
                document.querySelector('#buttonDavlenie').classList.remove('weather-btn-activated');

                document.querySelector('#buttonWind').textContent = 'Скорость ветра'
                document.querySelector('#buttonTemp').textContent = ''
                document.querySelector('#buttonPressure').textContent = ''
                document.querySelector('#buttonDavlenie').textContent = ''

            })

            /* buttonTemp.classList.add('weather-btn-activated') */

            document.getElementById('buttonTemp').addEventListener('click', function () {
                console.log('temp')
                addData(myChart, [convectorF(0), convectorF(1), convectorF(2), convectorF(3), convectorF(4), convectorF(5), convectorF(6), convectorF(7), convectorF(8), convectorF(9), convectorF(10), convectorF(11), convectorF(12), convectorF(13), convectorF(14), convectorF(15), convectorF(16), convectorF(17), convectorF(18), convectorF(19), convectorF(20), convectorF(21), convectorF(22), convectorF(23), convectorF(24), convectorF(25), convectorF(26)], 0);

                function addData(chart, data, datasetIndex) {
                    chart.data.datasets[datasetIndex].data = data;
                    chart.data.datasets[datasetIndex].borderColor = ["rgba(255, 99, 132, 1)"]
                    chart.data.datasets[datasetIndex].label = `Температура °`
                    chart.update();
                }
                document.querySelector('#buttonWind').classList.remove('weather-btn-activated')
                document.querySelector('#buttonTemp').classList.add('weather-btn-activated');
                document.querySelector('#buttonPressure').classList.remove('weather-btn-activated');
                document.querySelector('#buttonDavlenie').classList.remove('weather-btn-activated');

                document.querySelector('#buttonWind').textContent = ''
                document.querySelector('#buttonTemp').textContent = 'Температура'
                document.querySelector('#buttonPressure').textContent = ''
                document.querySelector('#buttonDavlenie').textContent = ''
            })


            /* (data.main.pressure * 100) / 133.3 */
            document.getElementById('buttonPressure').addEventListener('click', function () {

                addData(myChart, [pressure(0), pressure(1), pressure(2), pressure(3), pressure(4), pressure(5), pressure(6), pressure(7), pressure(8), pressure(9), pressure(10), pressure(11), pressure(12), pressure(13), pressure(14), pressure(15), pressure(16), pressure(17), pressure(18), pressure(19), pressure(20), pressure(21), pressure(22), pressure(23), pressure(24), pressure(25), pressure(26)], 0);

                function addData(chart, data, datasetIndex) {
                    chart.data.datasets[datasetIndex].data = data;
                    chart.data.datasets[datasetIndex].borderColor = ["#4794ff"]
                    chart.data.datasets[datasetIndex].label = `Осадки в мм`
                    chart.update();
                }
                document.querySelector('#buttonWind').classList.remove('weather-btn-activated')
                document.querySelector('#buttonTemp').classList.remove('weather-btn-activated');
                document.querySelector('#buttonPressure').classList.add('weather-btn-activated');
                document.querySelector('#buttonDavlenie').classList.remove('weather-btn-activated');

                document.querySelector('#buttonWind').textContent = ''
                document.querySelector('#buttonTemp').textContent = ''
                document.querySelector('#buttonPressure').textContent = 'Осадки'
                document.querySelector('#buttonDavlenie').textContent = ''

            })
            document.getElementById('buttonDavlenie').addEventListener('click', function () {
                console.log('pressure')
                addData(myChart, [ConvectorMilibar(0), ConvectorMilibar(1), ConvectorMilibar(2), ConvectorMilibar(3), ConvectorMilibar(4), ConvectorMilibar(5), ConvectorMilibar(6), ConvectorMilibar(7), ConvectorMilibar(8), ConvectorMilibar(9), ConvectorMilibar(10), ConvectorMilibar(11), ConvectorMilibar(12), ConvectorMilibar(13), ConvectorMilibar(14), ConvectorMilibar(15), ConvectorMilibar(16), ConvectorMilibar(17), ConvectorMilibar(18), ConvectorMilibar(19), ConvectorMilibar(20), ConvectorMilibar(21), ConvectorMilibar(22), ConvectorMilibar(23), ConvectorMilibar(24), ConvectorMilibar(25), ConvectorMilibar(26)], 0);

                function addData(chart, data, datasetIndex) {
                    chart.data.datasets[datasetIndex].data = data;
                    chart.data.datasets[datasetIndex].borderColor = ["rgba(255, 159, 64, 1)"]
                    chart.data.datasets[datasetIndex].label = `Давление`
                    chart.update();
                }
                document.querySelector('#buttonWind').classList.remove('weather-btn-activated')
                document.querySelector('#buttonTemp').classList.remove('weather-btn-activated');
                document.querySelector('#buttonPressure').classList.remove('weather-btn-activated');
                document.querySelector('#buttonDavlenie').classList.add('weather-btn-activated');

                document.querySelector('#buttonWind').textContent = ''
                document.querySelector('#buttonTemp').textContent = ''
                document.querySelector('#buttonPressure').textContent = ''
                document.querySelector('#buttonDavlenie').textContent = 'Давление'
            })

        })
        .catch((error) => {
            /* alert('historyWeather ' + error)  */
            /*  console.log(error)   */
            if (searchInp.value == 'уфа' || searchInp.value == 'Уфа') {
                searchInp.value = 'Moscow'
                forecast16()
                forecast14()
                init()
            }
        })
}


function getDateFrc(apiDate, HTMLnum, HTMLmonth, HTMLweekDay) {
    var date = new Date(apiDate);
    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timezone: 'UTC',
    };
    var dateRu = date.toLocaleString("ru", options)
    var arrayDate = dateRu.split(" ");
    var months = ["янв", "февр", "марта", "апр", "мая", "июня", "июля", "авг", "сент", "окт", "нояб", "дек"]
    /* var days =["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]; */
    var days = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
    /*    console.log(months[date.getMonth()])//месяц
       console.log(arrayDate[1]) 
       console.log(`${days[date.getDay()]}`)//день недели
       console.log(`${date.getDate()} ${months[date.getMonth()]} `)//месяц 27 февр */
    HTMLnum.innerHTML = `${date.getDate()}`
    HTMLmonth.innerHTML = `${months[date.getMonth()]}`
    HTMLweekDay.innerHTML = `${days[date.getDay()]}`

    /*    console.log('Сегодня '+arrayDate[1],arrayDate[2]);
       console.log(dateRu) */
}
function getDateFrcTemp(apiDate, HTMLnum, HTMLmonth) {
    var date = new Date(apiDate);
    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timezone: 'UTC',
    };
    var dateRu = date.toLocaleString("ru", options)
    var arrayDate = dateRu.split(" ");
    var months = ["янв", "февр", "марта", "апр", "мая", "июня", "июля", "авг", "сент", "окт", "нояб", "дек"]
    /* var days =["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]; */
    var days = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
    /*    console.log(months[date.getMonth()])//месяц
       console.log(arrayDate[1]) 
       console.log(`${days[date.getDay()]}`)//день недели
       console.log(`${date.getDate()} ${months[date.getMonth()]} `)//месяц 27 февр */
    HTMLnum.innerHTML = `${date.getDate()}`
    HTMLmonth.innerHTML = `${months[date.getMonth()]}`
    /*     console.log(`${months[date.getMonth()]}`) */

    /*    console.log('Сегодня '+arrayDate[1],arrayDate[2]);
       console.log(dateRu) */
}

function forecast14() {
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchInp.value}?include=fcst%2Cobs%2Chistfcst%2Cstats%2Cdays%2Chours%2Ccurrent%2Calerts&key=WWDR4ETDJE959JZFAVRAK27F2&options=beta&lang=ru&contentType=json`)

        .then((resp) => { return resp.json() })
        .then((data) => {

            function convectorFF(dayNum, hour) {
                return Math.floor((data.days[dayNum].hours[hour].temp - 32) * 5 / 9)
            }
            function feelslikeconvectorFF(dayNum, hour) {
                return Math.floor((data.days[dayNum].hours[hour].feelslike - 32) * 5 / 9)
            }
            function ConvectorMilibarR(dayNum, hour) {
                return Math.floor((data.days[dayNum].hours[hour].pressure * 100) / 133.3)
            }
            function windSpeedD(dayNum, hour) {
                return Math.floor((data.days[dayNum].hours[hour].windspeed) * 0.28)

            }

            function formateUnixMath(time) {
                let unix_timestamp = time
                let date = new Date(unix_timestamp * 1000);
                let hours = date.getHours();
                let minutes = "0" + date.getMinutes();
                let formattedTime = hours + ':' + minutes.substr(-2);
                let MathTime = ` ${hours}${minutes.substr(-2)}`
                return MathTime
            }//световой день

            function formateUnix(time) {
                let unix_timestamp = time
                let date = new Date(unix_timestamp * 1000);
                let hours = date.getHours();
                let minutes = "0" + date.getMinutes();
                let formattedTime = hours + ':' + minutes.substr(-2);
                return formattedTime
            }//рассвет закат


            function completionInfo(day, hour, temp, description, pressure, humidity, wind, feels_like, img) {

                temp.innerHTML = `${convectorFF(day, hour)}&deg;`
                description.innerHTML = `${data.days[day].hours[hour].conditions}`
                pressure.innerHTML = `${ConvectorMilibarR(day, hour)}`
                humidity.innerHTML = `${Math.floor(data.days[day].hours[hour].humidity)}%`
                wind.innerHTML = `${windSpeedD(day, hour)} м/c`
                feels_like.innerHTML = `${feelslikeconvectorFF(day, hour)}&deg;`
                img.setAttribute('src', `images/icons/vs-cross-icons/${data.days[day].hours[hour].icon}.png`)



            }

            function sunset(day, dayNumbers, sunrise, sunset) {
                let formatPreResult = ((+formateUnixMath(data.days[day].sunsetEpoch)) - (+formateUnixMath(data.days[day].sunriseEpoch))).toString()
                formatPreResult = ((+formatPreResult - 40) / 100).toString()
                let formatArray = formatPreResult.split('.')


                if (formatArray[1] > 60) {
                    let tempNum = formatArray[1] - 60
                    document.getElementById(dayNumbers).textContent = `${+formatArray[0] + 1} ч ${tempNum} мин`//световой день

                }
                if (formatArray[1] < 60) {
                    document.getElementById(dayNumbers).textContent = `${formatArray[0]} ч ${formatArray[1]} мин`//световой день
                }
                if (formatArray[0] < 0) {
                    document.getElementById(dayNumbers).textContent = `${Math.abs(formatArray[0])} ч ${formatArray[1]} мин`//световой день
                    document.getElementById(sunrise).textContent = formateUnix(data.days[day].sunsetEpoch)//закат
                    document.getElementById(sunset).textContent = formateUnix(data.days[day].sunriseEpoch)//закат
                }

                if (formatArray[0] > 0) {
                    document.getElementById(sunrise).textContent = formateUnix(data.days[day].sunriseEpoch)//закат
                    document.getElementById(sunset).textContent = formateUnix(data.days[day].sunsetEpoch)//закат
                }
            }

            sunset(0, "dayNumbers", "sunrise", "sunset")

            completionInfo(0, 7, tempMorning, descriptionMorning, pressureMorning, humidityMorning, windMorning, feelsTempMorning, icoMorning)
            getDateFrcTemp(data.days[0].datetime, document.getElementById('dayNum'), document.getElementById('dayMonth'))
            completionInfo(0, 12, tempDay, descriptionDay, pressureDay, humidityDay, windDay, feelsTempDay, icoDay)//день
            completionInfo(0, 18, tempEvening, descriptionEvening, pressureEvening, humidityEvening, windEvening, feelsTempEvening, icoEvening)//вечер
            completionInfo(0, 23, tempNight, descriptionNight, pressureNight, humidityNight, windNight, feelsTempNight, icoNigth)//вечер


            sunset(1, "dayNumbers1", "sunrise1", "sunset1")
            completionInfo(1, 7, tempMorning1, descriptionMorning1, pressureMorning1, humidityMorning1, windMorning1, feelsTempMorning1, icoMorning1)
            completionInfo(1, 12, tempDay1, descriptionDay1, pressureDay1, humidityDay1, windDay1, feelsTempDay1, icoDay1)//день
            completionInfo(1, 18, tempEvening1, descriptionEvening1, pressureEvening1, humidityEvening1, windEvening1, feelsTempEvening1, icoEvening1)//вечер
            completionInfo(1, 23, tempNight1, descriptionNight1, pressureNight1, humidityNight1, windNight1, feelsTempNight1, icoNigth1)//вечер
            getDateFrcTemp(data.days[1].datetime, document.getElementById('dayNum1'), document.getElementById('dayMonth1'))



            sunset(2, "dayNumbers2", "sunrise2", "sunset2")
            completionInfo(2, 7, tempMorning2, descriptionMorning2, pressureMorning2, humidityMorning2, windMorning2, feelsTempMorning2, icoMorning2)
            completionInfo(2, 12, tempDay2, descriptionDay2, pressureDay2, humidityDay2, windDay2, feelsTempDay2, icoDay2)//день
            completionInfo(2, 18, tempEvening2, descriptionEvening2, pressureEvening2, humidityEvening2, windEvening2, feelsTempEvening2, icoEvening2)//вечер
            completionInfo(2, 23, tempNight2, descriptionNight2, pressureNight2, humidityNight2, windNight2, feelsTempNight2, icoNigth2)//вечер
            getDateFrc(data.days[2].datetime, document.getElementById('dayNum2'), document.getElementById('dayMonth2'), document.getElementById('dayWeek2'))


            sunset(3, "dayNumbers3", "sunrise3", "sunset3")
            completionInfo(3, 7, tempMorning3, descriptionMorning3, pressureMorning3, humidityMorning3, windMorning3, feelsTempMorning3, icoMorning3)
            completionInfo(3, 12, tempDay3, descriptionDay3, pressureDay3, humidityDay3, windDay3, feelsTempDay3, icoDay3)//день
            completionInfo(3, 18, tempEvening3, descriptionEvening3, pressureEvening3, humidityEvening3, windEvening3, feelsTempEvening3, icoEvening3)//вечер
            completionInfo(3, 23, tempNight3, descriptionNight3, pressureNight3, humidityNight3, windNight3, feelsTempNight3, icoNigth3)//вечер
            getDateFrc(data.days[3].datetime, document.getElementById('dayNum3'), document.getElementById('dayMonth3'), document.getElementById('dayWeek3'))


            sunset(4, "dayNumbers4", "sunrise4", "sunset4")
            completionInfo(4, 7, tempMorning4, descriptionMorning4, pressureMorning4, humidityMorning4, windMorning4, feelsTempMorning4, icoMorning4)
            completionInfo(4, 12, tempDay4, descriptionDay4, pressureDay4, humidityDay4, windDay4, feelsTempDay4, icoDay4)//день
            completionInfo(4, 18, tempEvening4, descriptionEvening4, pressureEvening4, humidityEvening4, windEvening4, feelsTempEvening4, icoEvening4)//вечер
            completionInfo(4, 23, tempNight4, descriptionNight4, pressureNight4, humidityNight4, windNight4, feelsTempNight4, icoNigth4)//вечер
            getDateFrc(data.days[4].datetime, document.getElementById('dayNum4'), document.getElementById('dayMonth4'), document.getElementById('dayWeek4'))


            sunset(5, "dayNumbers5", "sunrise5", "sunset5")
            completionInfo(5, 7, tempMorning5, descriptionMorning5, pressureMorning5, humidityMorning5, windMorning5, feelsTempMorning5, icoMorning5)
            completionInfo(5, 12, tempDay5, descriptionDay5, pressureDay5, humidityDay5, windDay5, feelsTempDay5, icoDay5)//день
            completionInfo(5, 18, tempEvening5, descriptionEvening5, pressureEvening5, humidityEvening5, windEvening5, feelsTempEvening5, icoEvening5)//вечер
            completionInfo(5, 23, tempNight5, descriptionNight5, pressureNight5, humidityNight5, windNight5, feelsTempNight5, icoNigth5)//вечер
            getDateFrc(data.days[5].datetime, document.getElementById('dayNum5'), document.getElementById('dayMonth5'), document.getElementById('dayWeek5'))


            sunset(6, "dayNumbers6", "sunrise6", "sunset6")
            completionInfo(6, 7, tempMorning6, descriptionMorning6, pressureMorning6, humidityMorning6, windMorning6, feelsTempMorning6, icoMorning6)
            completionInfo(6, 12, tempDay6, descriptionDay6, pressureDay6, humidityDay6, windDay6, feelsTempDay6, icoDay6)//день
            completionInfo(6, 18, tempEvening6, descriptionEvening6, pressureEvening6, humidityEvening6, windEvening6, feelsTempEvening6, icoEvening6)//вечер
            completionInfo(6, 23, tempNight6, descriptionNight6, pressureNight6, humidityNight6, windNight6, feelsTempNight6, icoNigth6)//вечер
            getDateFrc(data.days[6].datetime, document.getElementById('dayNum6'), document.getElementById('dayMonth6'), document.getElementById('dayWeek6'))



            sunset(7, "dayNumbers7", "sunrise7", "sunset7")
            completionInfo(7, 7, tempMorning7, descriptionMorning7, pressureMorning7, humidityMorning7, windMorning7, feelsTempMorning7, icoMorning7)
            completionInfo(7, 12, tempDay7, descriptionDay7, pressureDay7, humidityDay7, windDay7, feelsTempDay7, icoDay7)//день
            completionInfo(7, 18, tempEvening7, descriptionEvening7, pressureEvening7, humidityEvening7, windEvening7, feelsTempEvening7, icoEvening7)//вечер
            completionInfo(7, 23, tempNight7, descriptionNight7, pressureNight7, humidityNight7, windNight7, feelsTempNight7, icoNigth7)//вечер
            getDateFrc(data.days[7].datetime, document.getElementById('dayNum7'), document.getElementById('dayMonth7'), document.getElementById('dayWeek7'))


            sunset(8, "dayNumbers8", "sunrise8", "sunset8")
            completionInfo(8, 7, tempMorning8, descriptionMorning8, pressureMorning8, humidityMorning8, windMorning8, feelsTempMorning8, icoMorning8)
            completionInfo(8, 12, tempDay8, descriptionDay8, pressureDay8, humidityDay8, windDay8, feelsTempDay8, icoDay8)//день
            completionInfo(8, 18, tempEvening8, descriptionEvening8, pressureEvening8, humidityEvening8, windEvening8, feelsTempEvening8, icoEvening8)//вечер
            completionInfo(8, 23, tempNight8, descriptionNight8, pressureNight8, humidityNight8, windNight8, feelsTempNight8, icoNigth8)//вечер
            getDateFrc(data.days[8].datetime, document.getElementById('dayNum8'), document.getElementById('dayMonth8'), document.getElementById('dayWeek8'))


            sunset(9, "dayNumbers9", "sunrise9", "sunset9")
            completionInfo(9, 7, tempMorning9, descriptionMorning9, pressureMorning9, humidityMorning9, windMorning9, feelsTempMorning9, icoMorning9)
            completionInfo(9, 12, tempDay9, descriptionDay9, pressureDay9, humidityDay9, windDay9, feelsTempDay9, icoDay9)//день
            completionInfo(9, 18, tempEvening9, descriptionEvening9, pressureEvening9, humidityEvening9, windEvening9, feelsTempEvening9, icoEvening9)//вечер
            completionInfo(9, 23, tempNight9, descriptionNight9, pressureNight9, humidityNight9, windNight9, feelsTempNight9, icoNigth9)//вечер
            getDateFrc(data.days[9].datetime, document.getElementById('dayNum9'), document.getElementById('dayMonth9'), document.getElementById('dayWeek9'))


            sunset(10, "dayNumbers10", "sunrise10", "sunset10")
            completionInfo(10, 7, tempMorning10, descriptionMorning10, pressureMorning10, humidityMorning10, windMorning10, feelsTempMorning10, icoMorning10)
            completionInfo(10, 12, tempDay10, descriptionDay10, pressureDay10, humidityDay10, windDay10, feelsTempDay10, icoDay10)//день
            completionInfo(10, 18, tempEvening10, descriptionEvening10, pressureEvening10, humidityEvening10, windEvening10, feelsTempEvening10, icoEvening10)//вечер
            completionInfo(10, 23, tempNight10, descriptionNight10, pressureNight10, humidityNight10, windNight10, feelsTempNight10, icoNigth10)//вечер
            getDateFrc(data.days[10].datetime, document.getElementById('dayNum10'), document.getElementById('dayMonth10'), document.getElementById('dayWeek10'))



            sunset(11, "dayNumbers11", "sunrise11", "sunset11")
            completionInfo(11, 7, tempMorning11, descriptionMorning11, pressureMorning11, humidityMorning11, windMorning11, feelsTempMorning11, icoMorning11)
            completionInfo(11, 12, tempDay11, descriptionDay11, pressureDay11, humidityDay11, windDay11, feelsTempDay11, icoDay11)//день
            completionInfo(11, 18, tempEvening11, descriptionEvening11, pressureEvening11, humidityEvening11, windEvening11, feelsTempEvening11, icoEvening11)//вечер
            completionInfo(11, 23, tempNight11, descriptionNight11, pressureNight11, humidityNight11, windNight11, feelsTempNight11, icoNigth11)//вечер
            getDateFrc(data.days[11].datetime, document.getElementById('dayNum11'), document.getElementById('dayMonth11'), document.getElementById('dayWeek11'))



            sunset(12, "dayNumbers12", "sunrise12", "sunset12")
            completionInfo(12, 7, tempMorning12, descriptionMorning12, pressureMorning12, humidityMorning12, windMorning12, feelsTempMorning12, icoMorning12)
            completionInfo(12, 12, tempDay12, descriptionDay12, pressureDay12, humidityDay12, windDay12, feelsTempDay12, icoDay12)//день
            completionInfo(12, 18, tempEvening12, descriptionEvening12, pressureEvening12, humidityEvening12, windEvening12, feelsTempEvening12, icoEvening12)//вечер
            completionInfo(12, 23, tempNight12, descriptionNight12, pressureNight12, humidityNight12, windNight12, feelsTempNight12, icoNigth12)//вечер
            getDateFrc(data.days[12].datetime, document.getElementById('dayNum12'), document.getElementById('dayMonth12'), document.getElementById('dayWeek12'))



            sunset(13, "dayNumbers13", "sunrise13", "sunset13")
            completionInfo(13, 7, tempMorning13, descriptionMorning13, pressureMorning13, humidityMorning13, windMorning13, feelsTempMorning13, icoMorning13)
            completionInfo(13, 12, tempDay13, descriptionDay13, pressureDay13, humidityDay13, windDay13, feelsTempDay13, icoDay13)//день
            completionInfo(13, 18, tempEvening13, descriptionEvening13, pressureEvening13, humidityEvening13, windEvening13, feelsTempEvening13, icoEvening13)//вечер
            completionInfo(13, 23, tempNight13, descriptionNight13, pressureNight13, humidityNight13, windNight13, feelsTempNight13, icoNigth13)//вечер
            getDateFrc(data.days[13].datetime, document.getElementById('dayNum13'), document.getElementById('dayMonth13'), document.getElementById('dayWeek13'))

        })
        .catch((e) => {
        })

}



for (let cityName of document.querySelectorAll('.city-name')) {
    cityName.addEventListener('click', function (event) {
        let coordinate = document.querySelector('.page-content').getBoundingClientRect()
        searchInp.value = event.target.textContent
        window.scrollTo(coordinate);
        if (document.querySelector('#buttonTemp')) {
            document.querySelector('#buttonWind').classList.remove('weather-btn-activated')
            document.querySelector('#buttonTemp').classList.add('weather-btn-activated');
            document.querySelector('#buttonPressure').classList.remove('weather-btn-activated');
            document.querySelector('#buttonDavlenie').classList.remove('weather-btn-activated');
            document.querySelector('#buttonWind').textContent = ''
            document.querySelector('#buttonTemp').textContent = 'Температура'
            document.querySelector('#buttonPressure').textContent = ''
            document.querySelector('#buttonDavlenie').textContent = ''
        }
        init()
    })
}

document.getElementById('historyWeather').addEventListener('click', function () {
    BtnPastMonth.classList.remove('forecast-btn-activated')
    BtnForecast14.classList.remove('forecast-btn-activated');
    if (buttonTemp = document.getElementById('buttonTemp')) {
        document.getElementById('buttonTemp').remove()
        document.getElementById('buttonPressure').remove()
        document.getElementById('buttonWind').remove()
        document.getElementById('buttonDavlenie').remove()
    }
    document.getElementById('historyWeather').classList.add('forecast-btn-activated');
    if (!document.getElementById('histBl')) {
        document.querySelector('.histAdd').insertAdjacentHTML('afterbegin', `
        <div class="info-block hist-bl" id="histBl">
        
        <h1 id="historyTitle">Погода в городе Москва, <br>
        на 2020 год январь</h1>
        <div style="display: flex
        ; align-items: center; justify-content: space-between;" class="charts">
            <div>
                <span id="historyError" class="historyError"></span>
                <input class="write-info-css" placeholder="Название пункта" type="text"
                    id="historyInput" value="Москва" style="max-width:265px">
                <div style="position: relative;">

                    <!-- <input class="write-info-css" type="datetime-local" id="lon" min="1991-01-01T10:00"
                        max="2020-12-31T10:00" value="2020-01-01T10:00"> -->
                    <form name="form1">
                        <div style="display: flex;flex-direction: column;">
                            <select class="write-info-css selectYear" style="max-width:265px">

                                <option value="2020">2020</option>
                                <option value="2019">2019</option>
                                <option value="2018">2018</option>
                                <option value="2017">2017</option>
                                <option value="2016">2016</option>
                                <option value="2015">2015</option>
                                <option value="2014">2014</option>
                                <option value="2013">2013</option>
                                <option value="2012">2012</option>
                                <option value="2010">2010</option>
                                <option value="2009">2009</option>
                                <option value="2008">2008</option>
                                <option value="2007">2007</option>
                                <option value="2006">2006</option>
                                <option value="2005">2005</option>
                                <option value="2004">2004</option>
                                <option value="2003">2003</option>
                                <option value="2002">2002</option>
                                <option value="2001">2001</option>
                                <option value="2000">2000</option>
                                <option value="1999">1999</option>
                                <option value="1998">1998</option>
                                <option value="1997">1997</option>
                                <option value="1996">1996</option>
                                <option value="1995">1995</option>
                                <option value="1994">1994</option>
                                <option value="1993">1993</option>
                                <option value="1992">1992</option>
                                <option value="1991">1991</option>
                            </select>
                            <select class="write-info-css selectMonth" id="lon" style="max-width:265px">
                                <option value="01">Январь</option>
                                <option value="02">Февраль</option>
                                <option value="03">Март</option>
                                <option value="04">Апрель</option>
                                <option value="05">Май</option>
                                <option value="06">Июнь</option>
                                <option value="07">Июль</option>
                                <option value="08">Август</option>
                                <option value="09">Сентябрь</option>
                                <option value="10">Октябрь</option>
                                <option value="11">Ноябрь</option>
                                <option value="12">Декабрь</option>
                            </select>
                        </div>

                    </form>



                </div>
                <button id="getHistorySubmit" onclick='ifEf()' class="forecast-btn-activated">Узнать погоду</button>

            </div>
           
        </div>
        `)
    }
    if (document.querySelector('.forecasts')) {
        document.querySelector('.forecasts').remove()
    }
    if (document.querySelector('#cvv')) {
        document.querySelector('#cvv').remove()
    }
})

if (document.getElementById('lon')) {
    var dataLon = document.getElementById('lon').getAttribute('data-hist-lon')
    var dataLat = document.getElementById('lon').getAttribute('data-hist-lat')
    console.log(dataLat, dataLon)
    var lat = document.getElementById('lon').getAttribute('data-hist-lat')
    var lon = document.getElementById('lon').getAttribute('data-hist-lon')
}


if (document.querySelector('.hist-bl')) {
    ifEf()
    console.log('ifEF()')
}

function ifEf() {
    if (document.getElementById('historyInput').value) {
        document.getElementById('historyError').textContent = ''
        citySelected()
    }
    if (!document.getElementById('historyInput').value) {
        document.getElementById('historyError').textContent = 'Укажите название города'
        document.getElementById('historyTitle').textContent = ``
    }
}

/* citySelected() */
function citySelected() {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${historyInput.value}&limit=5&appid=d56124c9a63a553d1cf6e1b4708b652c`
    )
        .then(response => response.json())
        .then(data => {
            if (!document.getElementById('myHistory')) {
                document.querySelector('.charts').insertAdjacentHTML('beforeend', `
                </div>
                <div>
                    <canvas id="myHistory" width="450" height="420"></canvas>

                </div>
                <div><canvas id="myHistoryWind" width="450" height="420"></canvas>
                </div>
                `)
            }

            document.getElementById('getHistorySubmit').addEventListener('click', function () {
                if (document.getElementById('myHistory')) {
                    /* alert('citySelected') */
                    document.getElementById('myHistoryWind').remove()
                    document.getElementById('myHistory').remove()
                    citySelected()
                }
            })
            document.getElementById('lon').dataset.histLon = ((data[0].lon).toFixed(4))
            document.getElementById('lon').dataset.histLat = ((data[0].lat).toFixed(4))
            let timeStart = document.querySelector('.time-start')
            let timeEnd = document.querySelector('.time-end')
            var selectYear = document.querySelector(".selectYear");
            var selectMonth = document.querySelector('.selectMonth')
            var valueYear = selectYear.value;
            var valueMonth = selectMonth.value
            var valueMonthEnd;
            var valeuMonthPast;
            switch (valueMonth) {
                case '01':
                    valeuMonthPast = 'январь'
                    break;
                case '02':
                    valeuMonthPast = 'февраль'
                    break;
                case '03':
                    valeuMonthPast = 'март'
                    break;

                case '04':
                    valeuMonthPast = 'апрель'
                    break;

                case '05':
                    valeuMonthPast = 'май'
                    break;

                case '06':
                    valeuMonthPast = 'июнь'
                    break;

                case '07':
                    valeuMonthPast = 'июль'
                    break;

                case '08':
                    valeuMonthPast = 'август'
                    break;

                case '09':
                    valeuMonthPast = 'сентябрь'
                    break;

                case '10':
                    valeuMonthPast = 'октябрь'
                    break;

                case '11':
                    valeuMonthPast = 'ноябрь'
                    break;

                case '12':
                    valeuMonthPast = 'декабрь'
                    break;

            }
            document.getElementById('historyTitle').innerHTML = `Погода в городе ${historyInput.value}, <br> на ${valueYear} год ${valeuMonthPast}`

            switch (valueMonth) {
                case '01':
                    valueMonthEnd = '02'
                    break;
                case '02':
                    valueMonthEnd = '03'
                    break;
                case '03':
                    valueMonthEnd = '04'
                    break;

                case '04':
                    valueMonthEnd = '05'
                    break;

                case '05':
                    valueMonthEnd = '06'
                    break;

                case '06':
                    valueMonthEnd = '07'
                    break;

                case '07':
                    valueMonthEnd = '08'
                    break;

                case '08':
                    valueMonthEnd = '09'
                    break;

                case '09':
                    valueMonthEnd = '10'
                    break;

                case '10':
                    valueMonthEnd = '11'
                    break;

                case '11':
                    valueMonthEnd = '12'
                    break;

                case '12':
                    valueMonthEnd = '01'
                    break;

            }

            /* 
            
            */

            switch (Math.floor(Math.random() * 4)) {
                case 0:
                    fetchReuest(document.getElementById('lon').getAttribute('data-hist-lat'), document.getElementById('lon').getAttribute('data-hist-lon'), valueYear, valueMonth, valueMonthEnd, 'a70704fb83194496aacde57349767a7f')
                    break;
                case 1:
                    fetchReuest(document.getElementById('lon').getAttribute('data-hist-lat'), document.getElementById('lon').getAttribute('data-hist-lon'), valueYear, valueMonth, valueMonthEnd, 'b21c9eb2e3ef4edeac6f55390d7bdb5c')
                    break;
                case 2:
                    fetchReuest(document.getElementById('lon').getAttribute('data-hist-lat'), document.getElementById('lon').getAttribute('data-hist-lon'), valueYear, valueMonth, valueMonthEnd, '2115110df795410f89e66c2ff5a38b6f')
                    break;


                case 3:
                    fetchReuest(document.getElementById('lon').getAttribute('data-hist-lat'), document.getElementById('lon').getAttribute('data-hist-lon'), valueYear, valueMonth, valueMonthEnd, '34c9134f6ecb451f993899a0c7793d21')
                    break;
            }

            /* 
            a70704fb83194496aacde57349767a7f
            b21c9eb2e3ef4edeac6f55390d7bdb5c
            2115110df795410f89e66c2ff5a38b6f
            34c9134f6ecb451f993899a0c7793d21
            */

            /* 
            8244fdf56c544babbdf8df6eea1dcd2c
            88bd8c92977a4d609f0a39a5b5f3e9d7
            c3efbba6fefa4da0b60e986045f1812b
            948bdef14bd947efa5e7a0165f9112c5
            */



            /* 
            ccab65b51ba24974b214e8c572e076b8 NEW-
            2ac9187454df459688bf8267872d076d new-
            3341bc4ede1447cb98819a6ffdee6e41 NEW--
            11fd8e1bbfe54201a9cda18bf8ec8ba4 NEW--
            505d72b181dd4ae39840f736aaad5b55
            */


            /* latCoord, lonCoord, start_year, start_day,end_day, start_year */


        })
}




/* document.getElementById('getHistorySubmit').addEventListener('click', function () {
    citySelected()
    alert('citySelected')

}) */

/* historyWeatherOld()  */

/* 
   mode: 'no-cors',
        headers: {
        'Access-Control-Allow-Origin': '*'

        https://api.weatherbit.io/v2.0/normals?lat=${document.getElementById('lon').getAttribute('data-hist-lat')}&lon=${document.getElementById('lon').getAttribute('data-hist-lon')}&start_day=02-02&end_day=03-01&key=13516f3513ca406182441a7511f20599

*/




/* function historyWeatherOld() {
    fetch(`https://api.weatherbit.io/v2.0/normals?lat=35.5&lon=-75.5&start_day=02-02&end_day=03-01&key=66273abe7fb749daade644d4188ede76`,{
        mode: 'no-cors',
        headers: {
        'Access-Control-Allow-Origin': '*'
    }})
    .then((resp) => {return resp.json()})
    .then((data) => {
        console.log(data)
    
  
        
          
    })
    .catch(() => {
        alert('This city not found')

              
    })
}
 */

/* 
ccab65b51ba24974b214e8c572e076b8 NEW-
2ac9187454df459688bf8267872d076d new-
3341bc4ede1447cb98819a6ffdee6e41 NEW--
11fd8e1bbfe54201a9cda18bf8ec8ba4 NEW--
505d72b181dd4ae39840f736aaad5b55
*/


/* https://api.weatherbit.io/v2.0/normals?lat=35.5&lon=-75.5&series_year=2010&start_day=02-02&end_day=03-01&tp=daily&key=21652b0c8d2e416fb722131bd943913b */
function fetchReuest(latCoord, lonCoord, start_year, start_day, end_day, keyAPI) {
    fetch(`https://api.weatherbit.io/v2.0/normals?lat=${latCoord}&lon=${lonCoord}&series_year=${start_year}&start_day=${start_day}-01&end_day=${end_day}-01&tp=daily&key=${keyAPI}`)
        .then(response => response.json())
        .then((data) => {

            thisATempMin(0)
            function thisATempMin(apiDay) {
                return Math.floor(data.data[apiDay].min_temp);
            }
            function thisATempMax(apiDay) {
                return Math.floor(data.data[apiDay].max_temp);
            }
            function thisATemp(apiDay) {
                return Math.floor(data.data[apiDay].temp);
            }
            function thisDays(apiDay) { return data.data[apiDay].day }


            function thisAWindMin(apiDay) {
                return Math.floor(data.data[apiDay].min_wind_spd);
            }
            function thisAWindMax(apiDay) {
                return Math.floor(data.data[apiDay].max_wind_spd);
            }
            function thisAWind(apiDay) {
                return Math.floor(data.data[apiDay].wind_spd);
            }





            const ctxx = document.getElementById('myHistory');
            const myHistory = new Chart(ctxx, {
                type: 'line',
                data: {
                    labels: [thisDays(0), thisDays(1), thisDays(2), thisDays(3), thisDays(4), thisDays(5), thisDays(6), thisDays(7), thisDays(8), thisDays(9), thisDays(10), thisDays(11), thisDays(12), thisDays(13), thisDays(14), thisDays(15), thisDays(16), thisDays(17), thisDays(18), thisDays(19), thisDays(20), thisDays(21), thisDays(22), thisDays(23), thisDays(24), thisDays(25), thisDays(26)],
                    datasets: [{
                        label: `Минимальная скорость ветра м/c`,
                        data: [thisAWindMin(0), thisAWindMin(1), thisAWindMin(2), thisAWindMin(3), thisAWindMin(4), thisAWindMin(5), thisAWindMin(6), thisAWindMin(7), thisAWindMin(8), thisAWindMin(9), thisAWindMin(10), thisAWindMin(11), thisAWindMin(12), thisAWindMin(13), thisAWindMin(14), thisAWindMin(15), thisAWindMin(16), thisAWindMin(17), thisAWindMin(18), thisAWindMin(19), thisAWindMin(20), thisAWindMin(21), thisAWindMin(22), thisAWindMin(23), thisAWindMin(24), thisAWindMin(25), thisAWindMin(26)],
                        backgroundColor: [
                            '#ecf4ff'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                        ],
                        borderWidth: 4
                    }, {
                        type: 'line',
                        label: 'Максимальная  скорость ветра м/c',
                        data: [thisAWindMax(0), thisAWindMax(1), thisAWindMax(2), thisAWindMax(3), thisAWindMax(4), thisAWindMax(5), thisAWindMax(6), thisAWindMax(7), thisAWindMax(8), thisAWindMax(9), thisAWindMax(10), thisAWindMax(11), thisAWindMax(12), thisAWindMax(13), thisAWindMax(14), thisAWindMax(15), thisAWindMax(16), thisAWindMax(17), thisAWindMax(18), thisAWindMax(19), thisAWindMax(20), thisAWindMax(21), thisAWindMax(22), thisAWindMax(23), thisAWindMax(24), thisAWindMax(25), thisAWindMax(26)],
                        backgroundColor: [
                            '#ecf4ff'
                        ],
                        borderColor: [
                            'rgba(153, 102, 255, 1)',
                        ],
                        borderWidth: 4
                    }, {
                        type: 'line',
                        label: 'Средняя  скорость ветра м/c',
                        data: [thisAWind(0), thisAWind(1), thisAWind(2), thisAWind(3), thisAWind(4), thisAWind(5), thisAWind(6), thisAWind(7), thisAWind(8), thisAWind(9), thisAWind(10), thisAWind(11), thisAWind(12), thisAWind(13), thisAWind(14), thisAWind(15), thisAWind(16), thisAWind(17), thisAWind(18), thisAWind(19), thisAWind(20), thisAWind(21), thisAWind(22), thisAWind(23), thisAWind(24), thisAWind(25), thisAWind(26)],
                        backgroundColor: [
                            '#ecf4ff'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                        ],
                        borderWidth: 4
                    }]

                },
                options: {
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });


            const ctxxw = document.getElementById('myHistoryWind');
            const myHistoryWind = new Chart(ctxxw, {
                type: 'line',
                data: {
                    labels: [thisDays(0), thisDays(1), thisDays(2), thisDays(3), thisDays(4), thisDays(5), thisDays(6), thisDays(7), thisDays(8), thisDays(9), thisDays(10), thisDays(11), thisDays(12), thisDays(13), thisDays(14), thisDays(15), thisDays(16), thisDays(17), thisDays(18), thisDays(19), thisDays(20), thisDays(21), thisDays(22), thisDays(23), thisDays(24), thisDays(25), thisDays(26)],
                    datasets: [{
                        label: `Минимальная температура `,
                        data: [thisATempMin(0), thisATempMin(1), thisATempMin(2), thisATempMin(3), thisATempMin(4), thisATempMin(5), thisATempMin(6), thisATempMin(7), thisATempMin(8), thisATempMin(9), thisATempMin(10), thisATempMin(11), thisATempMin(12), thisATempMin(13), thisATempMin(14), thisATempMin(15), thisATempMin(16), thisATempMin(17), thisATempMin(18), thisATempMin(19), thisATempMin(20), thisATempMin(21), thisATempMin(22), thisATempMin(23), thisATempMin(24), thisATempMin(25), thisATempMin(26)],
                        backgroundColor: [
                            '#ecf4ff'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                        ],
                        borderWidth: 4
                    }, {
                        type: 'line',
                        label: 'Максимальная температура',
                        data: [thisATempMax(0), thisATempMax(1), thisATempMax(2), thisATempMax(3), thisATempMax(4), thisATempMax(5), thisATempMax(6), thisATempMax(7), thisATempMax(8), thisATempMax(9), thisATempMax(10), thisATempMax(11), thisATempMax(12), thisATempMax(13), thisATempMax(14), thisATempMax(15), thisATempMax(16), thisATempMax(17), thisATempMax(18), thisATempMax(19), thisATempMax(20), thisATempMax(21), thisATempMax(22), thisATempMax(23), thisATempMax(24), thisATempMax(25), thisATempMax(26)],
                        backgroundColor: [
                            '#ecf4ff'
                        ],
                        borderColor: [
                            'rgba(153, 102, 255, 1)',
                        ],
                        borderWidth: 4
                    }, {
                        type: 'line',
                        label: 'Средняя температура',
                        data: [thisATemp(0), thisATemp(1), thisATemp(2), thisATemp(3), thisATempMax(4), thisATemp(5), thisATemp(6), thisATemp(7), thisATemp(8), thisATemp(9), thisATemp(10), thisATemp(11), thisATemp(12), thisATemp(13), thisATemp(14), thisATemp(15), thisATemp(16), thisATemp(17), thisATemp(18), thisATemp(19), thisATemp(20), thisATemp(21), thisATemp(22), thisATemp(23), thisATemp(24), thisATemp(25), thisATemp(26)],
                        backgroundColor: [
                            '#ecf4ff'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',

                        ],
                        borderWidth: 4
                    }]

                },
                options: {
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
}

searchInp.addEventListener('keyup', function (event) {
    if (event.code == 'Enter') {

        if (document.getElementById('forecasts')) {
            forecast14()
        }

    }
});