let menuButton = null;
let menuProcess = null;
let authentication = null;
let registration = null;


class AuthAndRegBtnClick {
    #openedAuthWindow = false;      //индикатор открытого окна авторизации
    #openedRegWindow = false;       //индикатор открытого окна регистрации

    constructor () {}

    //геттеры
    getOpenedAuthWindow() {
        return this.#openedAuthWindow;
    }

    getOpenedRegWindow() {
        return this.#openedRegWindow;
    }

    //сеттеры
    setOpenedAuthWindow(status) {
        this.#openedAuthWindow = status;
    }

    setOpenedRegWindow(status) {
        this.#openedRegWindow = status;
    }

    //функция проверки состояния окна авторизации
    clickAuthButton(menuProcess) {
        if (this.#openedAuthWindow == true) {
            menuProcess.closeAuthMenu();
            this.#openedAuthWindow = false;
        } else if (this.#openedAuthWindow == false && this.#openedRegWindow == true) {
            menuProcess.closeRegMenu();
            this.#openedRegWindow = false;
            menuProcess.openAuthMenu();
            this.#openedAuthWindow = true;
        } else if (this.#openedAuthWindow == false && this.#openedRegWindow == false) {
            menuProcess.openAuthMenu();
            this.#openedAuthWindow = true;
        }
    }

    //функция проверки состояния окна регистрации
    clickRegButton(menuProcess) {
        if (this.#openedRegWindow == true) {
            menuProcess.closeRegMenu();
            this.#openedRegWindow = false;
        } else if (this.#openedRegWindow == false && this.#openedAuthWindow == true) {
            menuProcess.closeAuthMenu();
            this.#openedAuthWindow = false;
            menuProcess.openRegMenu();
            this.#openedRegWindow = true;
        } else if (this.#openedRegWindow == false && this.#openedAuthWindow == false) {
            menuProcess.openRegMenu();
            this.#openedRegWindow = true;
        }
    }
}

class OpenerCloserMenu {
    #authWindow = document.getElementById('header-auth__menu');     //ссылка на окно авторизации
    #regWindow = document.getElementById('header-reg__menu');       //ссылка на окно регистрации

    constructor () {}

    //функция открытия окна авторизации
    openAuthMenu() {
        this.#authWindow.style.visibility = 'visible';  //изменение стиля
        $(this.#authWindow).slideDown(100);     //анимация
    }

    //функция открытия окна регистрации
    openRegMenu() { 
        this.#regWindow.style.visibility = 'visible';   //изменение стиля
        $(this.#regWindow).slideDown(100);  //анимация
    }

    //функция закрытия окна авторизации
    closeAuthMenu() {
        $(this.#authWindow).slideUp(100);   //анимация
        setTimeout(this.#closingTime, 100, this.#authWindow);   //изменение стиля
    }

    //функция закрытия окна регистрации
    closeRegMenu() {
        $(this.#regWindow).slideUp(100);    //анимация
        setTimeout(this.#closingTime, 100, this.#regWindow);    //изменение стиля
    }

    //функция скрытия объекта
    #closingTime(object) {  //аргументы: (объект для скрытия)
        object.style.visibility = 'hidden';
    }
}

class Authentication {
    #login = null;              //логин пользователя
    #password = null;           //пароль
    #isReadyToAuth = false;     //индикатор проверки авторизации

    constructor(login, password) {
        this.#login = login;
        this.#password = password;
    }

    //геттеры
    getLogin() {
        return this.#login;
    }

    getPassword() {
        return this.#password;
    }

    getIsReadyToAuth() {
        return this.#isReadyToAuth;
    }

    //функция установки новых логина и пароля
    setNewData(login, password) {   //аргументы: (новый логин, новый пароль)
        this.#login = login;
        this.#password = password;
    }

    //функция проверки статуса пользователя при попытке авторизоваться
    checkExistence(status) {    //аргументы: (имя состояния)
        if (status == "loginNotExists") {   //если данный логин не зарегистрирован
            document.getElementById('header-auth__menu__btn').innerHTML = "Логин не найден";    //отображение на экране
            this.#login = null;     //сброс данных
            this.#password = null;
            this.#isReadyToAuth = false;
            setTimeout(() => {  //изменение текста на кнопке спустя некоторое время
                document.getElementById('header-auth__menu__btn').innerHTML = "Авторизоваться";
            }, 2500);
        } else if (status == "passwordNotMatches") {    //если пароль неправильный
            document.getElementById('header-auth__menu__btn').innerHTML = "Пароль неверный";
            this.#login = null;
            this.#password = null;
            this.#isReadyToAuth = false;
            setTimeout(() => {
                document.getElementById('header-auth__menu__btn').innerHTML = "Авторизоваться";
            }, 2500);
        } else if (status == "alreadyOnline") {     //если обнаружено, что данный логин уже авторизован
            document.getElementById('header-auth__menu__btn').innerHTML = "Уже в сети";
            this.#login = null;
            this.#password = null;
            this.#isReadyToAuth = false;
            setTimeout(() => {
                document.getElementById('header-auth__menu__btn').innerHTML = "Авторизоваться";
            }, 2500);
        } else {
            document.getElementById('header-auth__menu__btn').innerHTML = "Успешно";
            this.#isReadyToAuth = true;
            document.getElementById('header-auth__menu__btn').style.pointerEvents = "none"; //предотвращение повторного нажатия кнопки
            setTimeout(() => {
                document.getElementById('header-auth__menu__btn').innerHTML = "Авторизоваться";
                document.getElementById('header-auth__menu__btn').style.pointerEvents = "auto";     //отмена предотвращения
            }, 10000);
        }
    }
}

class Registration {
    #login = null;                  //логин пользователя
    #email = null;                  //e-mail
    #password = null;               //пароль
    #confirmPassword = null;        //подтверждение пароля
    #isReadyToRegister = false;     //идикатор проверки регистрации
    #minLoginLength = 3;            //минимальная длина логина
    #maxLoginLength = 30;           //максимальная длина логина
    #minPasswordLength = 6;         //минимальная длина пароля
    #maxPasswordLength = 50;        //максимальная длина пароля
    #isCorrect = false;             //индикатор правильности введения данных

    constructor(login, email, password, confirmPassword) {
        this.#login = login;
        this.#email = email;
        this.#password = password;
        this.#confirmPassword = confirmPassword;
    }

    //геттеры
    getIsCorrectedData() {
        return this.#isCorrect;
    }

    getLogin() {
        return this.#login;
    }

    getEmail() {
        return this.#email;
    }

    getPassword() {
        return this.#password; 
    }

    getRegistrationDate() {
        let date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    }

    getIsReadyToRegister() {
        return this.#isReadyToRegister;
    }

    //функция установки новых данных
    setNewData(login, email, password, confirmPassword) {   //аргументы: (новый логин, новый e-mail, новый пароль, новый повторный пароль)
        this.#login = login;
        this.#email = email;
        this.#password = password;
        this.#confirmPassword = confirmPassword;
    }

    //функция проверки правильности введенных данных для регистрации
    checkCorrection() {
        if (this.#login == 'Система') {
            document.getElementById('header-reg__menu__btn').innerHTML = "Запрещенный логин";  //изменение надписи на кнопке
            this.#login = null;     //сброс данных
        } else if (this.#login.length < this.#minLoginLength) {    //если длина логина меньше минимального значения
            document.getElementById('header-reg__menu__btn').innerHTML = "Короткий логин";  //изменение надписи на кнопке
            this.#login = null;     //сброс данных
        } else if (this.#login.length > this.#maxLoginLength) {     //если длина логина больше максимального значения
            document.getElementById('header-reg__menu__btn').innerHTML = "Длинный логин";
            this.#login = null;
        } else if (this.#email.length == 0) {   //если поле для ввода e-mail пустое
            document.getElementById('header-reg__menu__btn').innerHTML = "Пустой E-mail";
        } else if (this.#password.length < this.#minPasswordLength) {   //если длина пароля меньше минимальной длины
            document.getElementById('header-reg__menu__btn').innerHTML = "Короткий пароль";
            this.#password = null;
        } else if (this.#password.length > this.#maxPasswordLength) {   //если длина пароля больше максимальной длины
            document.getElementById('header-reg__menu__btn').innerHTML = "Длинный пароль";
            this.#password = null;
        } else if (this.#password != this.#confirmPassword) {   //если пароль и подтверждение пароля не совпадают
            document.getElementById('header-reg__menu__btn').innerHTML = "Несовпадение паролей";
            this.#password = null;
            this.#confirmPassword = null;
        } else {
            this.#isCorrect = true;
            document.getElementById('header-reg__menu__btn').innerHTML = "Подождите";
        }

        setTimeout(() => {
            document.getElementById('header-reg__menu__btn').innerHTML = "Зарегистрироваться";
        }, 4000);
    }

    //функция проверки состояния регистрации
    checkExistence(status, auth) {    //аргументы: (имя статуса, экземпляр класса аунтетификации)
        if (status == "loginExists") {  //если логин уже существует
            document.getElementById('header-reg__menu__btn').innerHTML = "Логин занят";
            this.#login = null;
            this.#isReadyToRegister = false;
            setTimeout(() => {
                document.getElementById('header-reg__menu__btn').innerHTML = "Зарегистрироваться";
            }, 2500);
        } else if (status == "emailExists") {   //если e-mail уже существует
            document.getElementById('header-reg__menu__btn').innerHTML = "E-mail занят";
            this.#email = null;
            this.#isReadyToRegister = false;
            setTimeout(() => {
                document.getElementById('header-reg__menu__btn').innerHTML = "Зарегистрироваться";
            }, 2500);
        } else {
            this.#isReadyToRegister = true;
            document.getElementById('header-reg__menu__btn').innerHTML = "Подождите";
            document.getElementById('header-reg__menu__btn').style.pointerEvents = "none";
            auth.setNewData(this.#login, this.#password);   //отправка логина и пароля в класс авторизации
            setTimeout(() => {
                document.getElementById('header-reg__menu__btn').innerHTML = "Зарегистрироваться";
                document.getElementById('header-reg__menu__btn').style.pointerEvents = "auto";
            }, 10000);
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {
    let authLoginTextField = document.getElementById('header-auth__menu__loginfield');    //ссылка на текстовое поле логина в меню авторизации
    let authPasswordTextField = document.getElementById('header-auth__menu__passwordfield');  //ссылка на текстовое поле пароля в меню авторизации
    let regLoginTextField = document.getElementById('header-reg__menu__loginfield');      //ссылка на текстовое поле логина в меню регистрации
    let regEmailTextField = document.getElementById('header-reg__menu__emailfield');      //ссылка на текстовое поле e-mail в меню регистрации
    let regPasswordTextField = document.getElementById('header-reg__menu__passwordfield');    //ссылка на текстовое поле пароля в меню регистрации
    let regConfPasswordTextField = document.getElementById('header-reg__menu__confpasswordfield');    //ссылка на текстовое поле подтверждение пароля в меню регистрации
    let authButton = document.getElementById('header-auth__menu__btn');   //ссылка на кнопку авторизации
    let regButton = document.getElementById('header-reg__menu__btn');     //ссылка на кнопку регистрации

    menuButton = new AuthAndRegBtnClick();  //получение объектов классов
    menuProcess = new OpenerCloserMenu();
    authentication = new Authentication(authLoginTextField.value,
            authPasswordTextField.value);
    registration = new Registration(regLoginTextField.value,
            regEmailTextField.value, regPasswordTextField.value,
            regConfPasswordTextField.value);


    document.getElementById('header-auth__btn').addEventListener('click', event => {    //событие нажатия кнопки открытия или закрытия меню авторизации
        menuButton.clickAuthButton(menuProcess);    //открытие/закрытие меню авторизации
    });
    document.getElementById('header-reg__btn').addEventListener('click', event => {     //событие нажатия кнопки открытия или закрытия меню регистрации
        menuButton.clickRegButton(menuProcess);     //открытие/закрытие меню регистрации
    });
    document.getElementById('header-logout__btn').addEventListener('click', event => {  //событие нажатия кнопки перехода пользователя в оффлайн-статус
        socket.emit('offlineUser', authentication.getLogin());  //отправка запроса на сервер для изменения статуса пользователя
    });
    authButton.addEventListener('click', event => {     //событие нажатия кнопки авторизации пользователя
        event.preventDefault();
        authButton.innerHTML = "Подождите";
        authentication.setNewData(authLoginTextField.value,     //получение данных из меню авторизации
            authPasswordTextField.value);
        socket.emit('requestAuthenticationChecking',    //отправка звапроса на сервер для проверки введенных данных
            [authentication.getLogin(), authentication.getPassword()]);
        socket.on('receiveAuthenticationChecking', data => {    //принятие запроса из сервера для отображения статуса проверки
            authentication.checkExistence(data);    //проверка статуса
        });
    });
    regButton.addEventListener('click', event => {      //событие нажатия кнопки регистрации пользователя
        event.preventDefault();
        registration.setNewData(regLoginTextField.value,    //получение данных из меню регистрации
            regEmailTextField.value, regPasswordTextField.value,
            regConfPasswordTextField.value);
        registration.checkCorrection();     //проверка корректности новых данных

        if (registration.getIsCorrectedData()) {    //если данные корректны
            socket.emit('requestRegistrationChecking',      //отправка звпроса на сервер для проверки введенных данных
                [registration.getLogin(), registration.getEmail()]);
            socket.on('receiveRegistrationChecking', data => {      //принятие запроса из сервера для отображения статуса проверки
                registration.checkExistence(data, authentication);  //проверка статуса
            });

            setTimeout(() => {
                if (registration.getIsReadyToRegister()) {  //если все данные пользователя валидны
                    socket.emit('requestRegNewUser',    //отправка запроса на сервер для внесения нового пользователя в БД
                        [registration.getLogin(), registration.getEmail(),
                            registration.getPassword(), registration.getRegistrationDate(), 
                            registration.getIsReadyToRegister()]);
                    socket.on('receiveSuccessfulRegistration', () => {  //получение запроса из сервера для отображения успешного добавления
                        regButton.innerHTML = "Успешно";
                    });
                }
            }, 2500);
        }
    });
});


function getMenuButton() {
    return menuButton;
}

function getMenuProcess() {
    return menuProcess;
}

function getAuthentification() {
    return authentication;
}

function getRegistration() {
    return registration;
}