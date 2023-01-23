let chat = null;

class Chat {
    #sendButton = document.getElementById('chat-message__send');    //ссылка на кнопку отправки сообщения
    #textArea = document.getElementById('chat-user__message');      //ссылка на текстовое поле
    #messageField = document.getElementById('chat-inner__top');     //ссылка на поле отображения сообщений
    #allMessagesField = document.getElementById('all_messages');    //ссылка на поле со всеми сообщениями
    #writtenCharsAmount = document.querySelector('.val-symbols');   //ссылка на счетчик напечатанных символов

    #privileges = ["user", "moder", "admin", "mainAdmin"];          //массив привелегий
    
    #userLogin = null;                                              //логин пользователя
    #userPrivilege = 0;                                             //номер привелегии пользователя
    #messageCharLimit = 2000;                                       //предельное количество символов
    #messageAmount = 0;                                             //число сообщений в чате
    #bottomChatPoint = document.getElementById('chat').getBoundingClientRect().bottom;  //нижняя координата чата на экране
    #bottomPoint = window.innerHeight - 1;                          //нижняя координата всего сайта на экране

    constructor() {}

    //геттеры
    getUserLogin() {
        return this.#userLogin;
    }

    getUserPrivelege() {
        return this.#userPrivilege;
    }

    getSendButton() {
        return this.#sendButton;
    }

    getTextArea() {
        return this.#textArea;
    }

    getMessageField() {
        return this.#messageField;
    }

    getAllMessageField() {
        return this.#allMessagesField;
    }

    getMessagesAmount() {
        return this.#messageAmount;
    }
    //сеттеры
    setUserLogin(userLogin) {
        this.#userLogin = userLogin;
    }

    setUserPrivilege(userPrivilege) {
        this.#userPrivilege = userPrivilege;
    } 

    setAllMessagesField(allMessagesField) {
        this.#allMessagesField = allMessagesField;
    }

    setCharLimit() {
        document.querySelector('.val-max_symbols').innerHTML = this.#messageCharLimit;
    }

    //функция проверки сообщения перед отправкой 
    checkSendingMessage() {
        if (this.#textArea.value == "") {   //если текстовое поле пустое
            alert(`Введите сообщение`);
        } else if (this.#textArea.value.length > this.#messageCharLimit) {  //если количество напечатанных символов больше предела
            alert(`Сообщение слишком длинное`);
        } else {
            this.sendMessage(this.defineTime(new Date()), this.#textArea.value);    //отправка сообщения
            this.#textArea.value = "";      //очистка текстового поля
        }
    }    

    //функция отправки сообщения
    sendMessage(timeStamp, text) {  //аргументы: (момент времени отправки сообщения, текст сообщения)
        socket.emit('sendMessage', {login: this.#userLogin, sendingTime: timeStamp, message: text, charAmount: text.length});   //вызов сокета на сервере для обработки сообщения
        this.#writtenCharsAmount.innerHTML = 0;     //сброс счетчика символов
    }

    //функция обработки счетчика напечатанных символов
    showWrittenLetters(event) {     //аргументы: (информация о событии элемента)
        let number = this.#textArea.value.length;   //значение счетчка в данный момент
        this.#writtenCharsAmount.innerHTML = number;    //отображение значения счетка на экране

        if (number > this.#messageCharLimit) {  //покрас символов в красный, если превышен лимит символов
            document.getElementById('chat-message__symbols').style.color = '#ff0000';
            document.getElementById('chat-message__symbols').style.opacity = '1';
        } else if (number > (2 * this.#messageCharLimit) / 3) { //покрас символов в желтый, если превышено 2/3 от лимита символов
            document.getElementById('chat-message__symbols').style.color = '#ffff00';
        } else {    //покрас символов в белый
            document.getElementById('chat-message__symbols').style.color = '#ffffff';
        }
    }

    //функция создания HTML-элементов
    getHTMLmessageBlocks(senderLogin, sendingTime, messageText, senderPrivilege) {  //аргументы: (логин отпраителя, момент времени отправки сообщения, текст сообщения, привелегия отправителя)
        let messageBlock = document.createElement('div');   //создание пустого div-элемента
        let temp = ``;  //переменная будет хранить HTML-элементы нового сообщения
    
        switch (senderPrivilege) {  //создание HTML-элементов, отображающие логин отправителя, время отправки и текст сообщения
            case 1: {
                temp = `<div class="chat__message__field" id="chat-message__field">
                    <div class="chat__message__field__sender__${this.#privileges[0]}" id="chat-message__field__sender__${this.#privileges[0]}"><b>${senderLogin}</b><br>${sendingTime}</div>
                    <div class="chat__message__field__text__${this.#privileges[0]}" id="chat-message__field__text__${this.#privileges[0]}">${messageText}</div>`; break;
            };
            case 2: {
                temp = `<div class="chat__message__field" id="chat-message__field">
                    <div class="chat__message__field__sender__${this.#privileges[1]}" id="chat-message__field__sender__${this.#privileges[1]}"><b>${senderLogin}</b><br>${sendingTime}</div>
                    <div class="chat__message__field__text__${this.#privileges[1]}" id="chat-message__field__text__${this.#privileges[1]}">${messageText}</div>`; break;
            };
            case 3: {
                temp = `<div class="chat__message__field" id="chat-message__field">
                    <div class="chat__message__field__sender__${this.#privileges[2]}" id="chat-message__field__sender__${this.#privileges[2]}"><b>${senderLogin}</b><br>${sendingTime}</div>
                    <div class="chat__message__field__text__${this.#privileges[2]}" id="chat-message__field__text__${this.#privileges[2]}">${messageText}</div>`; break;
            }
            case 4: {
                temp = `<div class="chat__message__field" id="chat-message__field">
                    <div class="chat__message__field__sender__${this.#privileges[3]}" id="chat-message__field__sender__${this.#privileges[3]}"><b>${senderLogin}</b><br>${sendingTime}</div>
                    <div class="chat__message__field__text__${this.#privileges[3]}" id="chat-message__field__text__${this.#privileges[3]}">${messageText}</div>`; break;
            }
            case 10: {
                temp = `<div class="chat__message__field" id="chat-message__field">
                    <div class="chat__message__field__sender__system" id="chat-message__field__sender__system"><b>${senderLogin}</b><br>${sendingTime}</div>
                    <div class="chat__message__field__text__system" id="chat-message__field__text__system">${messageText}</div>`; break;
            }
        }

        //создание HTML-элементов, отображающие кнопки по управлению новым сообщением
        temp += `
            <div class="chat__message__field__functions" id="chat-message__field__functions">
                <div class="chat__message__field__functions__reply" id="chat-message__field__functions__reply">
                    <button class="chat__message__field__functions__reply__btn" id="chat-message__field__functions__reply__btn" onclick="makeChatAction(this, 'reply')"></button>
                </div>
                <div class="chat__message__field__functions__delete" id="chat-message__field__functions__delete">
                    <button class="chat__message__field__functions__delete__btn" id="chat-message__field__functions__delete__btn" onclick="makeChatAction(this, 'deleteMessage')"></button>
                </div>
                <div class="chat__message__field__functions__ban" id="chat-message__field__functions__ban">
                    <button class="chat__message__field__functions__ban__btn" id="chat-message__field__functions__ban__btn" onclick="makeChatAction(this, 'ban')"></button>
                </div>
            </div>
        </div>`;

        messageBlock.innerHTML = temp;  //отображение нового сообщения
        return messageBlock;
    }

    //функция настройки стилей нового сообщения
    setStyles(privilege, i, toIncrease) {   //аргументы: (привелегия получателя, номер сообщения, увеличить счетчик сообщений)
        switch (privilege) {
            case 0:     //скрытие кнопок для неавторизованного пользователя
                this.#allMessagesField.children[i].children[0].children[2].children[0].style.visibility = 'hidden';
                this.#allMessagesField.children[i].children[0].children[2].children[1].style.visibility = 'hidden';
                this.#allMessagesField.children[i].children[0].children[2].children[2].style.visibility = 'hidden';
                break;
            case 1:     //для обычного пользователя отображение только кнопки "Ответить"
                this.#allMessagesField.children[i].children[0].children[2].children[0].style.visibility = 'visible';
                this.#allMessagesField.children[i].children[0].children[2].children[1].style.visibility = 'hidden';
                this.#allMessagesField.children[i].children[0].children[2].children[2].style.visibility = 'hidden';
                break;
            case 2:     //для модератора и...
            case 3:     //для администратора и...
            case 4:     //для главного администратора отображение всех кнопок
                this.#allMessagesField.children[i].children[0].children[2].children[0].style.visibility = 'visible';
                this.#allMessagesField.children[i].children[0].children[2].children[1].style.visibility = 'visible';
                this.#allMessagesField.children[i].children[0].children[2].children[2].style.visibility = 'visible';
                break;
        }

        if (toIncrease) {   //увеличение количества сообщений
            this.#messageAmount++;
        }
    }

    //функция удаления сообщения
    deleteMessage(source) {     //аргументы: (данные об удаляемом сообщении)
        let i = 0;  //счетчик сообщений
        let foundMessage = false;   //индикатор нахождения удаляемого сообщения
        while (!foundMessage && i < this.#allMessagesField.children.length) {   //поиск до нахождения сообщения или до перебора всех сообщений
            //проверка данного сообщения на соответствие по логину, времени отправки и тексту сообщения
            if (this.#allMessagesField.children[i].children[0].children[0].innerHTML == `<b>${source[0]}</b><br>${source[1]}` && 
                this.#allMessagesField.children[i].children[0].children[1].innerHTML == source[2]) {
                    this.#allMessagesField.removeChild(this.#allMessagesField.children[i]);     //удаление HTML-элементов сообщения
                    foundMessage = true;    //прекращение поиска
                    this.#messageAmount--;  //уменьшение количества сообщений
            } else {
                i++;    //продолжение поиска
            }
        }
    }

    //функция для форматирования времени
    defineTime(time) {  //аргументы: (неотформатированное время)
        let formattedTime = {   //получение данных о времени
            year: time.getFullYear(),
            month: time.getMonth() + 1,
            date: time.getDate(),
            hour: time.getHours(),
            minute: time.getMinutes(),
            second: time.getSeconds()
        };
        //форматирование
        let sendingTime = `${formattedTime.year.toString().padStart(2, '0')}-${formattedTime.month.toString().padStart(2, '0')}-${formattedTime.date.toString().padStart(2, '0')} ${formattedTime.hour.toString().padStart(2, '0')}:${formattedTime.minute.toString().padStart(2, '0')}:${formattedTime.second.toString().padStart(2, '0')}`;
        return sendingTime;
    }

    //функция настройки высоты чата
    setChatHeight() {
        this.#bottomPoint = window.innerHeight - 1; //получение нижней координаты всего сайта по высоте
        let difference = document.getElementById('footer').getBoundingClientRect().bottom - this.#bottomPoint;  //высчитывание разницы по высоте
        this.#bottomChatPoint -= difference;    //вычисление новой высоты чата
        let chatNewHeight = this.#bottomChatPoint - document.getElementById('chat').getBoundingClientRect().top;    //установка новой высоты чата
        document.getElementById('chat').style.height = `${chatNewHeight}px`;    //установка стилей
        document.getElementById('chat-inner').style.height = `${chatNewHeight}px`;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    let chat = new Chat();      //получение объекта класса


    chat.setChatHeight();   //установка высоты чата
    chat.setCharLimit();    //установка предельного количества символов


    window.onresize = event => {    //событие изменения высоты страницы
        chat.setChatHeight();   //установка высоты чата
    };
    chat.getTextArea().oninput = event => { //событие нажатия клавиши в текстовом поле
        chat.showWrittenLetters(event);     //отображение счетчика напечатанных символов
    }
    chat.getSendButton().addEventListener('click', event => {   //событие нажатия кнопки отправки сообщения
        event.preventDefault();     //предотвращение перезагрузки страницы
        chat.checkSendingMessage();     //проверка отправляемого сообщения
    });



    socket.on('receiveChatContent', data => {   //получение сокета от сервера для загрузки всех сообщений при подключении к сайту
        while (chat.getAllMessageField().firstChild) {  //удаление всех сообщений
            chat.getAllMessageField().removeChild(chat.getAllMessageField().firstChild);
        }
    
        for (let i = 0; i < data.length; i++) {     //загрузка всех сообщений
            let temp = data[i].send_time.replace("T", " ");     //форматирование времени
            let formattedTime = temp.replace(".000Z", "");
            let message = chat.getAllMessageField();    //получение загруженных сообщений
            message.appendChild(chat.getHTMLmessageBlocks(data[i].sender_login, formattedTime, data[i].text, data[i].login_privilege));     //добавление нового сообщения
            chat.setStyles(chat.getUserPrivelege(), chat.getMessagesAmount(), true);    //стилизация нового сообщения
            chat.setAllMessagesField(message);      //установка нового списка сообщений
            chat.getMessageField().scrollTop = chat.getMessageField().scrollHeight;     //прокрутка вниз к новому сообщению
        }
    });
    socket.on('addMessage', data => {   //получение сокета от сервера для загрузки нового сообщения
        let message = chat.getAllMessageField();    //получение имеющихся сообщений
        message.appendChild(chat.getHTMLmessageBlocks(data.sender_login, data.send_time, data.text, data.login_privilege));     //добавление нового сообщения
        chat.setStyles(chat.getUserPrivelege(), chat.getMessagesAmount(), true);    //стилизация нового сообщения
        chat.setAllMessagesField(message);      //установка нового списка сообщений
        chat.getMessageField().scrollTop = chat.getMessageField().scrollHeight;     //прокрутка вниз к новому сообщению
    });
    socket.on('deleteMessageInChat', data => {      //получение сокета от сервера для удаления сообщения
        chat.deleteMessage(data);       //удаление сообщения
    });
    socket.on('changeChatForAuthorized', (login, privilege) => {    //получение сокета от сервера для изменения интерфейса чата для авторизованных пользователей
        chat.setUserLogin(login);   //получение логина
        chat.setUserPrivilege(privilege);   //получение привелегии
        for (let i = 0; i < chat.getMessagesAmount(); i++) {    //стилизация всех сообщений
            chat.setStyles(chat.getUserPrivelege(), i, false);
        }
    });
    socket.on('changeChatForNonAuthorized', () => {     //получение сокета от сервера для изменения интерфейса чата для неавторизованных пользователей
        chat.setUserLogin(null);    //сброс логина
        chat.setUserPrivilege(0);   //сброс привелегии
        for (let i = 0; i < chat.getMessagesAmount(); i++) {    //стилизация всех сообщений
            chat.setStyles(chat.getUserPrivelege(), i, false);
        }
    });
});


//получение экземпляра класса для других модулей
function getChatObject() {
    return chat;
}

//функция-обработчик кнопок сообщений
function makeChatAction(element, action) {  //аргументы: (информация кнопки, имя действия)
    let temp = null;
    let login = null;
    let timestamp = null;
    let message = null;
    switch (action) {
        case 'reply':   //действие "Ответить пользователю"
            temp = element.parentNode.parentNode.parentNode.children[0].innerHTML;  //получения логина пользователя, которому нужно ответить
            login = temp.substring(3, temp.indexOf('</b><br>'));    //форматирование
            document.getElementById('chat-user__message').value = `${login}, `;     //отображение логина в текстовом поле
            break;
        case 'deleteMessage':   //действие "Удалить сообщение"
            temp = element.parentNode.parentNode.parentNode.children[0].innerHTML;  //получения логина пользователя, у которого нужно удалить сообщение
            login = temp.substring(3, temp.indexOf('</b><br>'));    //форматирование
            temp = element.parentNode.parentNode.parentNode.children[0].innerHTML;  //получение времени отправки удаляемого сообщения
            timestamp = temp.substring(temp.indexOf('<br>') + 4, temp.length);  //форматирование
            message = element.parentNode.parentNode.parentNode.children[1].innerHTML;   //получение текста удаляемого сообщения
            getDialogObject().openDialogWindow('deleteMessage', [login, timestamp, message]);   //октрытие диалового окна
            break;
        case 'ban':     //действие "Забанить пользователя"
            temp = element.parentNode.parentNode.parentNode.children[0].innerHTML;  //получения логина пользователя, которого нужно забанить
            login = temp.substring(3, temp.indexOf('</b><br>'));    //форматирование
            getDialogObject().openDialogWindow('banUser', login);   //октрытие диалового окна
            break;
        }
}