let localTimeInfo = null;

class LocalTimeInfo {
    #updateTime = null;

    constructor () {}

    //функция установки информации о городе
    setCityTimeInfo(res) {  //аргументы: (информация, полученная из стороннего API)
        let timeSunrise = new Date((res.data.sys.sunrise + res.data.timezone) * 1000);  //форматирование времени восхода Солнца
        let timeSunset = new Date((res.data.sys.sunset + res.data.timezone) * 1000);    //форматирование времени захода Солнца
        let timeZone = res.data.timezone / Math.pow(60, 2);     //получение часового пояса
        if (timeZone >= 0) {    //форматировние часового пояса
            document.querySelector('.val-country-footer').innerHTML = `${res.data.sys.country} (UTC+${timeZone})`;
        } else {
            document.querySelector('.val-country-footer').innerHTML = `${res.data.sys.country} (UTC${timeZone})`;
        }
        document.querySelector('.val-sunrise-footer').innerHTML = `${timeSunrise.getUTCHours().toString().padStart(2,'0')}:${timeSunrise.getUTCMinutes().toString().padStart(2,'0')}`;  //отображение времени восхода Солнца
        document.querySelector('.val-sunset-footer').innerHTML = `${timeSunset.getUTCHours().toString().padStart(2,'0')}:${timeSunset.getUTCMinutes().toString().padStart(2,'0')}`;     //отображение времени захода Солнца
        document.querySelector('.val-localtime-footer').innerHTML = this.#calculateTime(timeZone);  //отображение местного времени
        
        clearInterval(this.#updateTime);            //отмена обновления местного времени
        this.#updateTime = setInterval(() => {      //обновление местного времени посекундно
            document.querySelector('.val-localtime-footer').innerHTML = this.#calculateTime(timeZone);
        }, 1000);
    }

    //функция форматировния местного времени
    #calculateTime(offset) {    //аргументы: (часовой пояс)
        let date = new Date();  //создание экземпляра реального времени
        let utc = date.getTime() + (date.getTimezoneOffset() * 60000);  //разнциа между местным временем и UTC-0
        let newDate = new Date(utc + (3600000 * offset));   //отформатированный экземпляр времени
        return newDate.toLocaleString();    //парсинг date -> string
    }
}


document.addEventListener("DOMContentLoaded", () => {
    localTimeInfo = new LocalTimeInfo();    //получение объекта класса
});

//получение экземпляра класса для других модулей
function getLocalTimeInfo() {
    return localTimeInfo;
}