const socket = io().connect();      //подключение библиотеки сокет для всех модулей

document.addEventListener("DOMContentLoaded", () => {
    window.onerror = (msg, url, line, col, error) => {
        // Note that col & error are new to the HTML 5 spec and may not be 
        // supported in every browser.  It worked for me in Chrome.
        let extra = !col ? '' : '\ncolumn: ' + col;
        extra += !error ? '' : '\nerror: ' + error;
     
        // You can view the information in an alert to see things working like this:
        alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);
     
        // TODO: Report this error via ajax so you can keep track
        //       of what pages have JS issues
     
        let suppressErrorAlert = true;
        // If you return true, then error alerts (like in older versions of 
        // Internet Explorer) will be suppressed.
        return suppressErrorAlert;
    };
    
    //let isMobileDevice = defineUserDevice();    //индикатор, является ли устройство мобильным
    
    const APIkey = "2d0c707d286a6b82ccc22a434a9576e7";      //ключ для получения данных из стороннего API
    let city = document.getElementById('header-weather__city__text').value.replace(" ", "");     //ссылка на текстовое поле для ввода города
    let previousCities = [city];    //массив, хранящий историю введенных городов
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${previousCities.at(-1)}&lang=ru&units=metric&appid=${APIkey}`; //ссылка для получения данных из стороннего API
    let securedOperation = false;
    
    
    //console.log(navigator);
    /*axios.get(url).then(res => {
        console.log(res.data);
    });*/
    /*$.get('https://www.cloudflare.com/cdn-cgi/trace', data => {
        data = data.trim().split('\n').reduce((obj, pair) => {
            pair = pair.split('=');
            return obj[pair[0]] = pair[1], obj;
        }, {});
        alert(data.ip);
    });*/
    
    
    
    setTimeout(() => {  //получение данных из стороннего API после подключения пользователя к сайту с задержкой
        configureByUserDevice();
        receiveWeatherInfo(url);
    }, 500);
    setInterval(() => {     //повторное получение данных из стороннего API через постоянный интервал времени
        receiveWeatherInfo(url);
    }, 900000);
    
    
    
    document.getElementById('header-weather__city__btns__change').addEventListener('click', event => {  //событие нажатия кнопки для изменения отображаемого города и информации о нем
        event.preventDefault();     //предотвращение перезагрузки страницы
        city = document.getElementById('header-weather__city__text').value.replace(" ", "");     //извлечение названия города из текстового поля
        previousCities.push(city);  //добавление в конец массива
        url = `http://api.openweathermap.org/data/2.5/weather?q=${previousCities.at(-1)}&lang=ru&units=metric&appid=${APIkey}`; //новая ссылка
        receiveWeatherInfo(url);    //получение данных из стороннего API
    });
    document.getElementById('header-weather__info__wind__select').addEventListener('click', event => {  //событие нажатия на выбранный селектор из списка
        weather.setWindVelocity(weather.getWindVelocity(), weather.getWindDirection());     //отображение скорости и направления ветра с выбраной единицей измерения
    });
    document.getElementById('header-weather__info__pressure__select').addEventListener('click', event => {  //событие нажатия на выбранный селектор из списка
        weather.setPressure(weather.getPressure());     //отображение давления с выбраной единицей измерения
    });
    
    
    socket.on('showAlert', message => {             //получение сокета от сервера для отображения уведомления
        if (!securedOperation) {
            securedOperation = true;
            alert(message);     //вывод уведомления с определенным сообщением
            setTimeout(() => {
                securedOperation = false;
            }, 2500);
        }
    });
    
    
    //функция определения устройства пользователя
    function configureByUserDevice() {
        let mobileDevices = [/Android/i, /webOS/i, /iPhone/i,
            /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i
        ];
        
        /*mobileDevices.some((device) => {
            if (!navigator.userAgent.match(device)) {
                document.getElementById("player-volume").value = "7";   //установка значения громкости плеера
                getPlayerObject().setAudioPlayerVolume(parseFloat(document.getElementById("player-volume").value / document.getElementById("player-volume").max));
            }
        });*/
    }
    
    //функция получения данных о погоде из стороннего API
    function receiveWeatherInfo(url) {  //аргументы: (ссылка с запросом на получение данных)
        axios.get(url).then(res => {    //извлечение промиса при успешном получении данных
            getWeatherObject().setWeatherInfo(res);     //отображение новой информации о погоде
            getPlayerObject().defineStartMode(res);     //изменение конфигураций плеера
            getLocalTimeInfo().setCityTimeInfo(res);    //отображение новой информации о городе
        }).catch(err => {   //если не удалось успешно получить данные
            console.log(err);
            alert(`Город ${previousCities.pop()} не найден.`);
        }).then(() => {     //выполнение следующих действий в любом случае
            document.getElementById('header-weather__city__text').value = '';   //стирание текстового поля
        });
    }
});