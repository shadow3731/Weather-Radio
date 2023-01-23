let weather = null;

class Weather {
    #currentImage = document.getElementById('header-weather__info__picture__img');  //ссылка на изображение данной погоды
    #weatherImage = null;                                                           //хранит имя изображения, присланного из стороннего API
    #temperature = null;                                                            //температура
    #description = null;                                                            //описание погоды
    #windVelocity = null;                                                           //скорость ветра
    #windDirection = null;                                                          //направление ветра
    #pressure = null;                                                               //давление
    #humidity = null;                                                               //влажность
    #UTCtimeZone = null;                                                            //часовой пояс

    constructor() {}

    //геттеры
    getWindVelocity() {
        return this.#windVelocity;
    }

    getWindDirection() {
        return this.#windDirection;
    }

    getPressure() {
        return this.#pressure;
    }

    //функция отображает данные о погоде, полученный от стороннего API
    setWeatherInfo(res) { //аргументы: (массив присланных данных)
        this.#weatherImage = res.data.weather[0].icon;  //извлечение имени изображения
        this.setWeatherImage(this.#weatherImage);   //отображение нового изображения погоды
    
        this.setCityName(res.data.name);    //отображение названия нового города
    
        this.#temperature = res.data.main.temp;     //извлечение температуры
        this.setTemperature(this.#temperature);     //отображение новой температуры
    
        this.#description = res.data.weather[0].description;    //извлечение описания погоды
        this.setWeatherDescription(this.#description);  //отображение нового описания погоды
    
        this.#windVelocity = res.data.wind.speed;   //извлечение скорости ветра
        this.#windDirection = res.data.wind.deg;    //извлечение направления ветра
        this.setWindVelocity(this.#windVelocity, this.#windDirection);      //отображение новых значений скорости и направления ветра
    
        this.#pressure = res.data.main.pressure;    //извлечение давления
        this.setPressure(this.#pressure);   //отображение нового значения давления
    
        this.#humidity = res.data.main.humidity;    //извдечение влажности
        this.setHumidity(this.#humidity);   //отображение нового значения влажности
    
        this.#UTCtimeZone = new Date((res.data.dt + 10800) * 1000);     //извлечение часового пояса
        this.setLastUpdateTime(this.#UTCtimeZone);      //отображение времени последнего обновления данных о городе
    }

    //функция установки изображения погоды
    setWeatherImage(value) {    //аргументы: (имя изображения)
        if (value == "01d") {   //поиск совпадения
            this.#currentImage.src = "Images/Weather/01d.png"; 
        } else if (value == "01n") { 
            this.#currentImage.src = "Images/Weather/01n.png"; 
        } else if (value == "02d") { 
            this.#currentImage.src = "Images/Weather/02d.png"; 
        } else if (value == "02n") { 
            this.#currentImage.src = "Images/Weather/02n.png"; 
        } else if (value == "03d" || value == "03n") { 
            this.#currentImage.src = "Images/Weather/03d.png"; 
        } else if (value == "04d" || value == "04n") { 
            this.#currentImage.src = "Images/Weather/04d.png"; 
        } else if (value == "09d" || value == "09n") { 
            this.#currentImage.src = "Images/Weather/09d.png"; 
        } else if (value == "10d") { 
            this.#currentImage.src = "Images/Weather/10d.png"; 
        } else if (value == "10n") { 
            this.#currentImage.src = "Images/Weather/10n.png"; 
        } else if (value == "11d" || value == "11n") { 
            this.#currentImage.src = "Images/Weather/11d.png"; 
        } else if (value == "13d" || value == "13n") { 
            this.#currentImage.src = "Images/Weather/13d.png"; 
        } else if (value == "50d" || value == "50n") { 
            this.#currentImage.src = "Images/Weather/50d.png"; 
        }
    }

    //функция отображения города на экране
    setCityName(value) {    //аргументы: (название города)
        document.querySelector('.val-city').innerHTML = value;
    }

    //функция отображения температуры на экране
    setTemperature(value) {     //аргументы: (значение температуры)
        document.querySelector('.val-temp').innerHTML = Math.round(value);
    }

    //функция отображения описания погоды на экране
    setWeatherDescription(value) {      //аргументы: (описание)
        document.querySelector('.val-state').innerHTML = value;
    }

    //функция отображения значений скорости и напрвления ветра
    setWindVelocity(windVelocity, windDirection) {  //аргументы: (скорость ветра, направление ветра)
        let selector = document.getElementById("header-weather__info__wind__select");   //ссылка на объект с выпадающим списком
        let value = selector.options[selector.selectedIndex].text;  //извлечение текущей величины из списка
    
        if (value == 'м/с') {   //конвертация в другие влечины
            document.querySelector('.val-wind').innerHTML = `${this.setWindDirection(windDirection)}, ${windVelocity}`; 
        } else if (value == 'м/ч') { 
            document.querySelector('.val-wind').innerHTML = `${this.setWindDirection(windDirection)}, ${Math.round(windVelocity * 3600 * 100) / 100}`; 
        } else if (value == 'км/с') { 
            document.querySelector('.val-wind').innerHTML = `${this.setWindDirection(windDirection)}, ${Math.round(windVelocity * 0.001 * 100000) / 100000}`; 
        } else if (value == 'км/ч') { 
            document.querySelector('.val-wind').innerHTML = `${this.setWindDirection(windDirection)}, ${Math.round(windVelocity * 3.6 * 100) / 100}`; 
        } else if (value == 'дюйм/с') { 
            document.querySelector('.val-wind').innerHTML = `${this.setWindDirection(windDirection)}, ${Math.round(windVelocity * 39.370079 * 100) / 100}`; 
        } else if (value == 'дюйм/ч') { 
            document.querySelector('.val-wind').innerHTML = `${this.setWindDirection(windDirection)}, ${Math.round(windVelocity * 141732.28347 * 100) / 100}`; 
        } else if (value == 'шаг(-ов)/с') { 
            document.querySelector('.val-wind').innerHTML = `${this.setWindDirection(windDirection)}, ${Math.round(windVelocity * 3.28084)}`; 
        } else if (value == 'шаг(-ов)/ч') { 
            document.querySelector('.val-wind').innerHTML = `${this.setWindDirection(windDirection)}, ${Math.round(windVelocity * 11811.023622)}`; 
        } else if (value == 'миль/с') { 
            document.querySelector('.val-wind').innerHTML = `${this.setWindDirection(windDirection)}, ${Math.round(windVelocity * 0.0006214 * 100000) / 100000}`; 
        } else if (value == 'миль/ч') { 
            document.querySelector('.val-wind').innerHTML = `${this.setWindDirection(windDirection)}, ${Math.round(windVelocity * 2.2369363 * 100) / 100}`; 
        } else if (value == 'узел(-ов)') { 
            document.querySelector('.val-wind').innerHTML = `${this.setWindDirection(windDirection)}, ${Math.round(windVelocity * 1.943844)}`; 
        }
    }

    //функция получения значения направления ветра
    setWindDirection(value) {   //аргументы: (градус направления ветра)
        if ((value >= 0 && value <= 22) || (value >= 337 && value <= 360)) {    //поиск совпадения
            return 'северный'; 
        } else if (value >= 23 && value <= 67) { 
            return 'северо - восточный'; 
        } else if (value >= 68 && value <= 112) { 
            return 'восточный'; 
        } else if (value >= 112 && value <= 156) { 
            return 'юго - восточный'; 
        } else if (value >= 157 && value <= 201) { 
            return 'южный'; 
        } else if (value >= 202 && value <= 246) { 
            return 'юго - западный'; 
        } else if (value >= 247 && value <= 291) { 
            return 'западный'; 
        } else if (value >= 292 && value <= 336) { 
            return 'северо - западный'; 
        }
    }

    //функция отображения значения давления
    setPressure(pressure) {     //аргументы: (давление)
        let selector = document.getElementById("header-weather__info__pressure__select");   //ссылка на объект с выпадающим списком
        let value = selector.options[selector.selectedIndex].text;  //извлечение текущей величины из списка
    
        if (value == 'мм.рт.ст.') {     //конвертация в другие влечины
            document.querySelector('.val-pressure').innerHTML = Math.round(pressure * 100 * 0.007501); 
        } else if (value == 'мм.вод.ст.') { 
            document.querySelector('.val-pressure').innerHTML = Math.round(pressure * 100 * 0.102); 
        } else if (value == 'Па') { 
            document.querySelector('.val-pressure').innerHTML = Math.round(pressure * 100 * 100) / 100; 
        } else if (value == 'кПа') { 
            document.querySelector('.val-pressure').innerHTML = Math.round(pressure * 100 * 100 * 0.001) / 100; 
        } else if (value == 'МПа') { 
            document.querySelector('.val-pressure').innerHTML = Math.round(pressure * 10000 * 100 * 0.000001) / 10000; 
        } else if (value == 'бар') { 
            document.querySelector('.val-pressure').innerHTML = Math.round(pressure * 10000 * 100 * 0.00001) / 10000; 
        } else if (value == 'ат') { 
            document.querySelector('.val-pressure').innerHTML = Math.round(pressure * 10000 * 100 * 0.0000102) / 10000; 
        } else if (value == 'атм') { 
            document.querySelector('.val-pressure').innerHTML = Math.round(pressure * 10000 * 100 * 0.000009869) / 10000; 
        } else if (value == 'psi') { 
            document.querySelector('.val-pressure').innerHTML = Math.round(pressure * 100 * 100 * 0.000145) / 100; 
        } else if (value == 'osi') { 
            document.querySelector('.val-pressure').innerHTML = Math.round(pressure * 100 * 100 * 0.002321) / 100; 
        }
    }

    //функция отображения значения влажности
    setHumidity(value) {    //аргументы: (влажность)
        document.querySelector('.val-humidity').innerHTML = value;
    }

    //функция отображения значения времени последнего обновления данных в данном городе
    setLastUpdateTime(value) {  //аргументы: (последнее обновление)
        let formattedHour = value.getUTCHours();    //извлечение часов
        let formattedMinute = value.getUTCMinutes();    //извлечение минут
        let formattedTime = `${formattedHour.toString().padStart(2,'0')}:${formattedMinute.toString().padStart(2,'0')}`;    //форматирование
        document.querySelector('.val-lastUpdate').innerHTML = formattedTime;    //отображение
    }

    //функция определения местоположения пользователя
    defineCity(event) {
        event.preventDefault();
        alert('Функция недоступна.');
    }
}


document.addEventListener("DOMContentLoaded", () => {
    weather = new Weather();    //получение объекта класса


    /*document.getElementById('header-weather__city__btns__define').addEventListener('click', event => {    //событие нажатия кнопки для определения местоположения города
        weather.defineCity(event);     //определение местоположения пользователя
    });*/
});

//получение экземпляра класса для других модулей
function getWeatherObject() {
    return weather;
}