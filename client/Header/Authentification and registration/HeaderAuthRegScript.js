let authRegModule = null;

class AuthRegModule {
    #userAuthorized = false;
    #authButton = document.getElementById('header-auth__btn');      //ссылка на кнопку открытия меню авторизации
    #regButton = document.getElementById('header-reg__btn');        //ссылка на кнопку открытия меню регитсрации
    #logoutButton = document.getElementById('header-logout__btn');  //ссылка на кнопку перехода пользователя на неавторизованный статус
    #authMenu = document.getElementById('header-auth__menu');       //ссылка на меню автроизации
    #regMenu = document.getElementById('header-reg__menu');         //ссылка на меню регистрации

    constructor() {}

    //геттеры
    getUserAuthorized() {
        return this.#userAuthorized;
    }

    //сеттеры
    setUsetAuthorized(status) {
        this.#userAuthorized = status;
    }

    //изменение стилей при статусе онлайн и оффлайн
    changeContent() {
        if (this.#userAuthorized) {
            this.#authButton.style.display = "none";
            this.#regButton.style.display = "none";
            this.#logoutButton.style.display = "initial";
            this.#authMenu.style.display = "none";
            this.#regMenu.style.display = "none";
        } else {
            this.#authButton.style.display = "initial";
            this.#regButton.style.display = "initial";
            this.#logoutButton.style.display = "none";
            this.#authMenu.style.display = "initial";
            this.#regButton.style.display = "initial";
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {
    let authRegModule = new AuthRegModule();    //получение объекта класса
    
    
    socket.on('changeHeaderForAuthorized', () => {  //получение сокета от сервера для изменения стиля элементов для авторизованных пользователей
        authRegModule.setUsetAuthorized(true);  //установка статуса онлайн
        authRegModule.changeContent();  //изменение стилей
    });
    socket.on('changeHeaderForNonAuthorized', () => {   //получение сокета от сервера для изменения стиля элементов для неавторизованных пользователей
        authRegModule.setUsetAuthorized(false); //установка статуса оффлайн
        authRegModule.changeContent();  //изменение стилей
    });
});

//получение экземпляра класса для других модулей
function getAuthRegModule() {
    return authRegModule;
}