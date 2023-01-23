let footer = null;

class Footer {
    constructor() {}
}


document.addEventListener("DOMContentLoaded", () => {
    footer = new Footer();      //получение объекта класса
});

//получение экземпляра класса для других модулей
function getFooterObject() {
    return footer;
}