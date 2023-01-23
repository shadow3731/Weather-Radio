let dialog = null;

class Dialog {
    #dialogField = document.getElementById("dialog");                           //ссылка на поле диалогового окна
    #dialogTitle = document.getElementById("dialog-window__header__title");     //ссылка на заголовок диалогового окна
    #dialogBody = document.getElementById("dialog-window__body");               //ссылка на тело диалогового окна
    #closeButton = document.getElementById("dialog-close__btn");                //ссылка на кнопку "Закрыть"
    #dialogDeleteMessage = document.getElementById("dialog-delete__message");   //ссылка на диалоговое окно для удаления сообщения
    #dialogBanUser = document.getElementById("dialog-ban");                     //ссылка на диалоговое окно для бана пользователя
    #dialogUsersList = document.getElementById("dialog-usersInfo");             //ссылка на диалоговое окно для отображения информации о пользователях
    #dialogSettings = document.getElementById("dialog-settings");               //ссылка на диалоговое окно для отображения настроек сайта
    #onlineButton = getOnlineAmount().getOnlineButton();                        //ссылка на кнопку для открытия диалогового окна по информации о пользователях
    #onlineList = document.getElementById("dialog-usersInfo__online__list");    //ссылка на поле со списком авторизованных пользователей
    #generalSettingsButton = getGeneralSettingsObject().getSettingsButton();    //ссылка на кнопку для открытия диалогового окна по настройкам сайта
    
    #dialogIsOpened = false;                                                    //индикатор открытия диалогового окна
    #defaultTheme = true;                                                       //индикатор установки стиля сайта по умолчанию
    #styleObject = {                                                            //именнования всех стилей сайта
        dialog__background__settings__options__sun: 1,
        dialog__background__settings__options__dayCloud: 2,
        dialog__background__settings__options__moon: 3,
        dialog__background__settings__options__nightCloud: 4,
        dialog__background__settings__options__rainCloud: 5,
        dialog__background__settings__options__lightningCloud: 6
    };
    #styleObjectKey = " background__active";                                    //ключевое слово активного стиля сайиа
    #securedOperation = false;                                                  //ограничитель для предотвращения дублирования выполнения операций

    constructor() {}

    //геттеры
    getDialogField() {
        return this.#dialogField;
    }
    
    getCloseButton() {
        return this.#closeButton;
    }

    getOnlineButton() {
        return this.#onlineButton;
    }

    getGeneralSettingsButton() {
        return this.#generalSettingsButton;
    }

    //функция открытия диалогового окна
    openDialogWindow(target, addition) {    //аргументы: (цель открытия диалогового окна, дополнительные данные)
        if (!this.#dialogIsOpened) {        //изменение стилей диалогового окна при открытии
            this.#dialogField.style.display = "flex";
            this.#dialogIsOpened = true;
        }

        switch (target) {   //выбор цели
            case 'deleteMessage':   //цель "Удалить сообщение"
                this.#dialogDeleteMessage.style.display = "initial";    //изменение стиля
                this.#dialogTitle.innerHTML = "Удалить сообщение";      //изменение заголовка
                document.getElementById("dialog-delete__message__text").innerHTML = `Вы действительно хотите удалить сообщение пользователя ${addition[0]}?`;   //изменение надписи
                
                document.getElementById("dialog-delete__message__buttons__approve").addEventListener('click', () => {   //событие подтверждения действия
                    socket.emit('deleteMessage', addition);     //вызов сокета на сервере для удаления сообщения
                    this.closeDialogWindow();   //закрытие диалогового окна
                });

                document.getElementById("dialog-delete__message__buttons__cancel").addEventListener('click', () => {    //событие отмены действия
                    this.closeDialogWindow();   //закрытие диалогового окна
                });
                break;
            case 'banUser':     //цель "Забанить пользователя"
                this.#dialogBanUser.style.display = "initial";      //изменение стиля
                this.#dialogTitle.innerHTML = `Забанить пользователя`;      //изменение заголовка
                document.querySelector('.val-loginBan').innerHTML = addition;   //дополнение надписи (логин пользователя)

                document.getElementById("dialog-ban__buttons__approve").addEventListener('click', () => {   //событие подтверждения действия
                    if (!this.#securedOperation) {  
                        this.#securedOperation = true;      //предотвращение дублирования запроса
                        if (document.getElementById("dialog-ban__cause__textInput").value == "") {      //если причина бана не указана
                            alert("Введите причину бана");
                        } else if (document.getElementById("dialog-ban__time__textInput").value == "") {    //если время бана не указано
                            alert("Корректно введите время бана");
                        } else {
                            let time = parseInt(document.getElementById("dialog-ban__time__textInput").value);  //парсинг числа string -> int
                            if (isNaN(time) || time < 1) {  //если время не является числом либо меньше 1
                                alert("Корректно введите время бана");
                            } else {
                                socket.emit('giveBanToUser', document.querySelector('.val-loginBan').innerHTML, document.getElementById("dialog-ban__cause__textInput").value, time);   //вызов сокета на сервере для бана пользователя
                                document.getElementById("dialog-ban__cause__textInput").value = "";     //очистка полей
                                document.getElementById("dialog-ban__time__textInput").value = "";
                                this.closeDialogWindow();   //закрытие диалогового окна
                            }
                        }

                        setTimeout(() => {
                            this.#securedOperation = false;
                        }, 2000);
                    }
                });

                document.getElementById("dialog-ban__buttons__cancel").addEventListener('click', () => {    //событие отмены действия
                    document.getElementById("dialog-ban__userLogin").innerHTML = ``;    //очистка полей
                    document.getElementById("dialog-ban__cause__textInput").value = ``;
                    document.getElementById("dialog-ban__time__textInput").value = ``;
                    this.closeDialogWindow();   //закрытие диалогового окна
                });
                break;
            case 'usersList':   //цель "Инфрмация о пользователях"
                this.#dialogUsersList.style.display = "initial";    //изменение стилей
                this.#dialogTitle.innerHTML = "Пользователи";   //изменение заголовка
                socket.emit('requestUsersInformation');     //вызов сокета на сервере для отображения информации о пользователях
                break;
            case 'generalSettings':     //цель "Настройки сайта"
                this.#dialogSettings.style.display = "initial";     //изменение стилей
                this.#dialogTitle.innerHTML = "Настройки";      //изменение заголовка
                this.#fixBGoptionView();    //отобразить стиль по умолчанию
                break;
        }
    }

    //функция закрытия диалогового окна
    closeDialogWindow() {
        if (this.#dialogIsOpened) {     //если диалоговое окно открыто
            this.#dialogTitle.innerHTML = "";   //очистка заголовка
            this.#dialogField.style.display = "none";   //отключение отображения поля диалогового окна
            this.#dialogIsOpened = false;

            for (let i = 0; i < this.#dialogBody.children.length; i++) {    //отключение отображения всех целей
                this.#dialogBody.children[i].style.display = "none";
            }
        }
    }

    //функция отображения стиля сайта по умолчанию
    #fixBGoptionView() {
        if (this.#defaultTheme) {   //если стиль не изменялся
            $('.dialog__background__settings__options__moon').addClass('background__active');   //стиль сайта по умолчанию становится активным
        }
    }

    //функция изменения списка авторизованных пользователей
    changeOnlineList(list) {    //аргументы: (список авторизованных пользователей)
        while(this.#onlineList.firstChild) {    //стирание старого списка
            this.#onlineList.removeChild(this.#onlineList.firstChild);
        }

        for (let i = 0; i < list.length; i++) {     //формирование нового списка
            let childElement = document.createElement('div');   //создание div-элемента
            childElement.className = 'dialog__usersInfo__online__list__user';   //придание класса
            childElement.innerHTML = list[i];   //внесение логина пользователя
            this.#onlineList.appendChild(childElement);     //добавление div-эдемента в родительский элемент
        }
    }

    //функция изменения стиля сайта
    changeBodyBackground(allElements, clicked) {    //аргументы: (все стили, выбранный стиль)
        if (this.#dialogIsOpened) {     //если диалоговое окно открыто
            this.#defaultTheme = false;     //стиль по умолчанию становится неактивным

            allElements.forEach(d => d.classList.remove("background__active"));     //удаление атрибута активного стиля со всех стилей
            clicked.classList.add("background__active");    //добавление атрибута активного стиля к выбранному
            for (let key in this.#styleObject) {    //переборка всех стилей
                if (key + this.#styleObjectKey == clicked.classList.value) {    //поиск нового активного стиля
                    switch (clicked.classList.value) {  //изменение фона сайта по новому активному стилю
                        case "dialog__background__settings__options__sun background__active":
                            document.body.style.backgroundColor = '#ffcf48';
                            break;
                        case "dialog__background__settings__options__dayCloud background__active":
                            document.body.style.backgroundColor = '#ecf0f1';
                            break;
                        case "dialog__background__settings__options__moon background__active":
                            document.body.style.backgroundColor = '#001524';
                            break;
                        case "dialog__background__settings__options__nightCloud background__active":
                            document.body.style.backgroundColor = '#000000';
                            break;
                        case "dialog__background__settings__options__rainCloud background__active":
                            document.body.style.backgroundColor = '#1f558f';
                            break;
                        case "dialog__background__settings__options__lightningCloud background__active":
                            document.body.style.backgroundColor = '#204e4f';
                            break;
                    }
                }
            }
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {
    dialog = new Dialog();      //получение объекта класса

    //список всех стилей сайта
    let imgs = document.querySelectorAll(`.dialog__background__settings__options__sun, 
        .dialog__background__settings__options__dayCloud, 
        .dialog__background__settings__options__moon, 
        .dialog__background__settings__options__nightCloud, 
        .dialog__background__settings__options__rainCloud, 
        .dialog__background__settings__options__lightningCloud`
    );


    dialog.getDialogField().addEventListener('click', event => {
        if (event.target === event.currentTarget) {
            dialog.closeDialogWindow();
        }
    });
    dialog.getCloseButton().addEventListener('click', event => {    //событие нажатия закрытия диалоговго окна
        dialog.closeDialogWindow();     //закрытие диалогового окна
    });
    dialog.getOnlineButton().addEventListener('click', event => {   //событие нажатия открытия диалоговго окна для отображения информации о пользовтелях
        dialog.openDialogWindow('usersList', null);     //открытие диалогового окна
    });
    dialog.getGeneralSettingsButton().addEventListener('click', event => {  //событие нажатия открытия диалоговго окна для отображения настроек сайта
        dialog.openDialogWindow('generalSettings', null);   //открытие диалогового окна
    });


    socket.on('changeGuestsAmount', data => {       //получение сокета от сервера для изменения количества неавторизованных пользователей
        document.querySelector('.val_guests').innerHTML = data;     //отображение
    });
    socket.on('changeRegisteredAmount', data => {   //получение сокета от сервера для изменения количества зарегистрированных пользователей
        document.querySelector('.val_registered').innerHTML = data; //отображение
    });
    socket.on('changeOnlineInDialog', data => {     //получение сокета от сервера для изменения информации об автроизованных пользователях
        document.querySelector('.val_online').innerHTML = ` ${data.length}`;    //отображение количества авторизованных пользователей
        dialog.changeOnlineList(data);  //отображение списка авторизованных пользователей
    });


    imgs.forEach(div => {
        div.addEventListener("click", event => {    //событие нажатия по выбранному стилю сайта
            dialog.changeBodyBackground(imgs, div);     //изменение стиля сайта
        });
    });
});

//получение экземпляра класса для других модулей
function getDialogObject() {
    return dialog;
}