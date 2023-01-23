let header = null;

class Header {
    #keyHeaderWidthScreen = 1024;   //ключевое значение ширины экрана пользователя

    constructor() {}

    //функция изменения внешенего вида кнопок
    setHeaderButtonsAppearance() {
        if ((screen.width < this.#keyHeaderWidthScreen) || (window.innerWidth < this.#keyHeaderWidthScreen)) {  //если ширина экрана или окна меньше ключевого значения
            document.getElementById('header-logout__btn').innerHTML = '';
            document.getElementById('header-auth__btn').innerHTML = '';
            document.getElementById('header-reg__btn').innerHTML = '';            
        } else {
            document.getElementById('header-logout__btn').innerHTML = 'Выход';
            document.getElementById('header-auth__btn').innerHTML = 'Войти';
            document.getElementById('header-reg__btn').innerHTML = 'Зарегистрироваться';
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let header = new Header();      //получение объекта класса


    header.setHeaderButtonsAppearance();    //изменение внешнего вида кнопок


    window.addEventListener('resize', event => {    //событие изменения ширины окна браузера
        header.setHeaderButtonsAppearance();    //изменение внешнего вида кнопок
    });
});

//получение экземпляра класса для других модулей
function getHeader() {
    return header;
}