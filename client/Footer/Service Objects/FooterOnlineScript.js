let onlineAmount = null;

class OnlineAmount {
    #onlineButton = document.getElementById('footer-online__btn');  //ссылка на кнопку для отображения иформации о пользователях

    constructor () {}

    //геттеры
    getOnlineButton() {
        return this.#onlineButton;
    }

    //функция изменения количества авторизованных пользователей
    setOnlineAmount(amount) {
        document.getElementById("footer-online__number").innerText = amount;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    onlineAmount = new OnlineAmount();      //получение объекта класса


    socket.on("changeOnlineAmount", data => {   //получение сокета от сервера для изменения количества авторизованных пользователей
        onlineAmount.setOnlineAmount(data);
    });
});

//получение экземпляра класса для других модулей
function getOnlineAmount() {
    return onlineAmount;
}