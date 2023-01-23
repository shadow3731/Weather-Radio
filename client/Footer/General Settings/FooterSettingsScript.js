let generalSettings = null;

class GeneralSettings {
    #settingsButton = document.getElementById('footer-styles');     //ссылка на кнопку настроек сайта

    constructor() {}

    //геттеры
    getSettingsButton() {
        return this.#settingsButton;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    generalSettings = new GeneralSettings();    //получение объекта класса
});

//получение экземпляра класса для других модулей
function getGeneralSettingsObject() {
    return generalSettings;
}