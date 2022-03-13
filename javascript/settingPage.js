
/* document.querySelectorAll('input[name="settingCity"').forEach((e) => {
    e.addEventListener('change',function(){
        console.log(e)
    })
});
 */

geopotision()

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
        document.getElementById('textYouCountry').innerHTML = `${country} , ${city}`

        if (typeof city === 'undefined') {
            document.getElementById('textYouCountry').textContent = `${country} , Москва`
            console.log(typeof city)
        }//доделать

        console.log(city);
        console.log(country);
    }
    initt()
}


if (localStorage.getItem('searchInput')) {
    document.querySelector('#settingInp').checked = true
    document.getElementById('settingInput').value = localStorage.getItem('searchInput')
}
if (localStorage.getItem('settingIp') == 'true') {
    document.querySelector('#settingIp').checked = true
}

document.querySelector('#settingInput').addEventListener('input', function () {
    if (!document.querySelector('#settingInput').value) {
        document.querySelector('#settingInp').disabled = true
    }
    if (document.querySelector('#settingInput').value) {
        document.querySelector('#settingInp').disabled = false
    }
})

document.getElementById('settingIp').addEventListener('change', function () {
    localStorage.setItem('settingIp', 'true')
    localStorage.removeItem('searchInput')
    document.getElementById('settingInput').value = ''
})

document.querySelector('#settingInput').addEventListener('keyup', function (e) {
    if (e.code == 'Enter') {
        localStorage.setItem('searchInput', document.getElementById('settingInput').value)
        if (localStorage.getItem('searchInput')) {
            document.querySelector('#settingInp').checked = true
        }
        localStorage.removeItem('settingIp')
    }
})

document.getElementById('btnSave').addEventListener('click', function () {
    if (document.getElementById('settingInput').value) {
        localStorage.setItem('searchInput', (document.getElementById('settingInput').value).toLowerCase())
        if (localStorage.getItem('searchInput')) {
            document.querySelector('#settingInp').checked = true
        }
        localStorage.removeItem('settingIp')

    }
})

