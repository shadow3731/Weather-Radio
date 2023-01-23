let player = null;

class Player {
    #playButton = document.getElementById('player-play__button');       //ссылка на кнопку воспроизведения
    #songName = document.getElementById('player-name__song');           //ссылка на поле с нзванием песни
    #songArtist = document.getElementById('player-artist__song');       //ссылка на поле с названием группы
    #currentTime = document.getElementById('player-current__time');     //ссылка на поле текущего времени проигрывания песни
    #durationTime = document.getElementById('player-end__time');        //ссылка на время длительности песни
    #songVolume = document.getElementById('player-volume');             //ссылка на ползунок громкости плеера
    #barProgress = document.getElementById('player-progress');          //ссылка на шкалу воспроизведения песни
    #barLoad = document.getElementById('player-load');                  //ссылка на шкалу буферизации песни
    #modeAuto = document.getElementById('player-auto__button');         //ссылка на кнопку авто-режима
    #updateButton = document.getElementById('player-update__button');   //ссылка на кнопку обновления плеера
    /*#historyButton = document.getElementById('player-history__button__img');
    #historyField = document.getElementById('player-history__list');
    #historyList = document.getElementById('player-history__list__songs');
    #historyPlaylists = [document.getElementById('player-history__playlist1'),
        document.getElementById('player-history__playlist2'),
        document.getElementById('player-history__playlist3'),
        document.getElementById('player-history__playlist4'),
        document.getElementById('player-history__playlist5'),
        document.getElementById('player-history__playlist6')
    ];*/
    #listenersAmount = document.getElementById('player-listeners__amount'); //ссылка на счетчик слушателей
    #loadingScreen = document.getElementById('player-outerInfoScreen');     //ссылка на всплывающее окно загрузки плеера

    #audioPlayer = new Audio();                                             //экземпляр пустого класса

    #playing = false;                                                       //индикатор проигрывания песни
    //#openedHistory = true;                                  
    #playerUnavailable = true;                                              //индикатор состояния доступа плеера
    #loadingTimeout = null;                                                 //функция, выполняющаяся с задержкой
    #autoSelect = false;                                                    //индикатор авто-режима плеера
    #firstLaunch = true;                                                    //индикатор запуска плеера
    #playerRestart = false;                                                 //индикатор перезапуска плеера
    #afterServerConnect = true;                                             //индикатор необходимости к подключению к серверу
    #playerMode = 1;                                                        //номер активного плейлиста
    #weatherQueue = null;                                                   //ID погоды в данный момент
    #serverPlayerData = null;                                               //данные из сервера
    #playlist = [];                                                         //сформированный список песен на клиентской стороне
    //#historyPlayedAmounts = [0, 0, 0, 0, 0, 0];
    #currentVolume = this.#songVolume.value / 100;                          //громкость плеера в данный момент
    #modeObjectKey = " active__player";                                     //ключевое слово активного режима плеера
    #modeObject = {                                                         //список режимов плеера
        player__mode__sun: 1,
        player__mode__dayCloud: 2,
        player__mode__moon: 3,
        player__mode__nightCloud: 4,
        player__mode__rainCloud: 5,
        player__mode__lightningCloud: 6
    };
    #weatherLists = [                                                       //список имен погоды
        new Array("01d", "02d"), new Array("03d", "04d", "50d"),
        new Array("01n", "02n"), new Array("03n", "04n", "50n"),
        new Array("10d", "10n", "13d", "13n"), 
        new Array("09d", "09n", "11d", "11n")
    ];

    constructor() {}

    //геттеры
    getAudioPlayer() {
        return this.#audioPlayer;
    }

    getPlayButton() {
        return this.#playButton;
    }

    getUpdateButton() {
        return this.#updateButton;
    }

    /*getHistoryButton() {
        return this.#historyButton;
    }*/

    getModeAuto() {
        return this.#modeAuto;
    }

    getSongVolume() {
        return this.#songVolume;
    }

    getFirstLaunch() {
        return this.#firstLaunch;
    }

    getPlayerMode() {
        return this.#playerMode;
    }

    //сеттеры
    setAudioPlayer(audioPlayer) {
        this.#audioPlayer = audioPlayer;
    }

    setAudioPlayerVolume(value) {
        this.#songVolume.value = parseInt(value * 100);
        this.#audioPlayer.volume = value;
        this.#currentVolume = value;
    }

    setListenersAmount(value) {
        this.#listenersAmount.innerText = value;
    }

    //функция определения предлогаемого режима плеера
    defineStartMode(res) {  //аргументы: (массив данных о погоде, полученного из стороннего API)
        for (let i = 0; i < this.#weatherLists.length; i++) {   //поиск совпадения
            for (let j = 0; j < this.#weatherLists[i].length; j++) {
                if (res.data.weather[0].icon == this.#weatherLists[i][j]) this.#weatherQueue = i + 1;
            }
        }
    }

    //функция запуска/перезапуска плеера
    launchPlayer(obj) {     //аргументы: (ссылка на объект класса)
        if (!obj.#playerRestart) {  //если плеер требуется запустить
            obj.#firstLaunch = false;
            obj.#playerUnavailable = true;      //установка флага отключения доступа к плееру
            obj.popupScreen('unavailable');     //отключение доступа к плееру
    
            if (obj.#autoSelect) {  //если включен авто-режим
                $('.player__mode__sun').removeClass('active__player');  //удаление ключевого слового активного режима со всего списка
                $('.player__mode__dayCloud').removeClass('active__player');
                $('.player__mode__moon').removeClass('active__player');
                $('.player__mode__nightCloud').removeClass('active__player');
                $('.player__mode__rainCloud').removeClass('active__player');
                $('.player__mode__lightningCloud').removeClass('active__player');
                obj.#playerMode = obj.#weatherQueue;    //режим плеера приобретает значение предлогаемого
            }
        
            obj.#setDefaultMode(obj.#playerMode);   //получить список песен
        }
    }

    //функция настройки плеера под конкретный режим
    #setDefaultMode(playerMode) {   //аргументы: (режим плеера в данный момент)
        socket.emit('requestPlayerMetadata', playerMode);   //отправка запроса на сервер для получения определенного плейлиста
        socket.on('receivePlayerMetadata', data => {    //получение запроса от сервера для формирования плейлиста на клиентской стороне
            this.#serverPlayerData = data;  //копирование метаданных, полученного из сервера
            for (let i = 0; i < this.#serverPlayerData.playlist.length; i++) {  //исправление директории песен
                this.#serverPlayerData.playlist[i].source = this.#serverPlayerData.playlist[i].source.replace('client/', '');
            }
        });
        
        setTimeout(() => {
            if (isNaN(this.#serverPlayerData.playlist.length) || this.#serverPlayerData.playlist.length == 0) {  //если получен пустой список
                setTimeout(this.launchPlayer, 3000, this);  //перезагрузка плеера
            } else {
                this.#playlist = this.#serverPlayerData.playlist;   //извлечение плейлиста из метаданных
                switch (playerMode) {   //установка статуса активного режима для определенного стиля
                    case 1: $('.player__mode__sun').addClass('active__player'); break;
                    case 2: $('.player__mode__dayCloud').addClass('active__player'); break;
                    case 3: $('.player__mode__moon').addClass('active__player'); break;
                    case 4: $('.player__mode__nightCloud').addClass('active__player'); break;
                    case 5: $('.player__mode__rainCloud').addClass('active__player'); break;
                    case 6: $('.player__mode__lightningCloud').addClass('active__player'); break;
                }

                socket.emit('updateListenerList', playerMode - 1, 'add');   //отправка запроса на сервер для увеличения количества слушателей данного плейлиста
        
                this.#playing = false;      //фиксация флага
                this.#playerRestart = true;     //предотвращение перезапуска плеера при нажатии на кнопку "Воспроизвести"/"Пауза"
                this.playNewSong(this);     //инициализация настроек проигрывания
            }
        }, 1500);
    }

    //функция настраивающая внешний вид плеера и конфигурацию проигрывания песни
    playNewSong(obj) {  //аргументы: (ссылка на объект класса)
        obj.#audioPlayer = new Audio(obj.#playlist[obj.#playlist.length - 1].source);   //создание нового аудио-объекта
        obj.#songName.innerText = obj.#playlist[obj.#playlist.length - 1].song;         //отображение названия песни
        obj.#songArtist.innerText = obj.#playlist[obj.#playlist.length - 1].artist;     //отображение исполнителя песни
        if (obj.#afterServerConnect) {  //если требуется синхронизировать время воспроизведения
            obj.#audioPlayer.currentTime = (new Date() - obj.#serverPlayerData.startPointTime) / 1000;  //извлечение точки времени воспроизведения песни
            obj.#afterServerConnect = false;    //отключение синхронизации
        }
            
        obj.#playlist.pop();    //удаление данной песни из плейлиста
    
        obj.#audioPlayer.onloadeddata = () => {     //событие полного считывания дынных о песне
            obj.#durationTime.innerHTML = obj.#showAudioTime(obj.#audioPlayer.duration);    //отображение длительности песни
        
            obj.#audioPlayer.ontimeupdate = () => {     //событие обновление времени воспроизведения
                obj.#currentTime.innerHTML = obj.#showAudioTime(obj.#audioPlayer.currentTime);  //отображение момента воспроизведения песни в данный момент
                obj.#changeAudioProgress();     //изменение ползунка воспроизведения
            }
        
            obj.setAudioPlayerVolume(obj.#currentVolume);   //установка громкости плеера
            obj.playPause();    //непосредственное воспроизведение песни
            obj.#playerUnavailable = false;     //снятие флага о недоступности плеера
            obj.popupScreen('unavailable');     //изменение всплывающего окна
        
            obj.#audioPlayer.onprogress = () => {   //событие буферизации песни
                if (obj.#audioPlayer.duration > 0) {    //если длительность песни не нулевая
                    for (let i = 0; i < obj.#audioPlayer.buffered.length; i++) {    //отображение загруженной части песни браузером
                        if (obj.#audioPlayer.buffered.start(obj.#audioPlayer.buffered.length - 1 - i) < obj.#audioPlayer.currentTime) {
                            obj.#barLoad.style.left = `${-100 + (obj.#audioPlayer.buffered.end(obj.#audioPlayer.buffered.length - 1 - i) * 100) / obj.#audioPlayer.duration}%`;
                            break;
                        }
                    }
                }
            }
            
            obj.#audioPlayer.onended = () => {      //событие завершения песни
                obj.#playerUnavailable = true;  //снятие флага о доступности плеера
                obj.popupScreen('unavailable');     //изменение всплывающего окна
                obj.playPause();    //остановка плеера
    
                if (obj.#autoSelect) {      //если включен авто-режим
                    if (obj.#playerMode != obj.#weatherQueue) {     //если режим плеера не совпадает с предлогаемым
                        $('.player__mode__sun').removeClass('active__player');  //удаление ключевого слова активного плеера со всех стилей
                        $('.player__mode__dayCloud').removeClass('active__player');
                        $('.player__mode__moon').removeClass('active__player');
                        $('.player__mode__nightCloud').removeClass('active__player');
                        $('.player__mode__rainCloud').removeClass('active__player');
                        $('.player__mode__lightningCloud').removeClass('active__player');
                        obj.#continuePlaying(false);    //проистановка работы плеера
                    } else {
                        if (obj.#playlist.length > 0) {     //если длина плейлиста больше 0
                            obj.#continuePlaying(true);     //продолжить работу плеера с запуском новой песни
                        } else { 
                            obj.#continuePlaying(false);    //приостановить работу плеера
                        }
                    }
                } else {    //если отключен авто-режим
                    if (obj.#playlist.length > 0) { 
                        obj.#continuePlaying(true); 
                    } else { 
                        obj.#continuePlaying(false); 
                    }
                }
            }
        }
    }

    //функция форматирования времени
    #showAudioTime(time) {  //аргументы: (неотформатированное время)
        time = Math.floor(time);    //округление
        let formattedMinutes = Math.floor(time / 60);   //извлечение минут
        let formattedSeconds = Math.floor(time - formattedMinutes * 60);    //извлечение секунд
        let minutesValue = formattedMinutes;
        let secondsValue = formattedSeconds;
        if (minutesValue < 10) {    //если значение минут меньше 10
            minutesValue = '0' + minutesValue;  //добавление 0
        }
        if (secondsValue < 10) {    //если значение секунд меньше 10
            secondsValue = '0' + secondsValue;
        }
        return minutesValue + ':' + secondsValue;   //конечный вариант отображения
    }

    //функция изменения местоположения ползунка воспроизведения песни
    #changeAudioProgress() {
        let progress = (Math.floor(this.#audioPlayer.currentTime) / (Math.floor(this.#audioPlayer.duration) / 100));    //расчет местоположения
        this.#barProgress.style.left = -100 + progress + '%';   //задание стиля
    }

    //функция остановки или воспроизведения песни
    playPause() {    
        if (this.#playing) {    //если песня проигрывается в данный момент
            this.#audioPlayer.pause();  //приостановка песни
            this.#changeIcon('playPausePlaying-true');  //изменение иконки
        } else {
            this.#audioPlayer.play();   //воспроизведение песни
            this.#changeIcon('playPausePlaying-false');
        }
        this.#playing = !this.#playing;     //изменение флага воспроизведения
    }

    //функция, определяющая необходимость перезапуска плеера
    #continuePlaying(state) {   //аргументы: (последнее состояние плеера)
        this.#playerResetSettings();    //сброс внешнего вида плеера
    
        if (state) {    //если последнее состояние = true
            setTimeout(this.playNewSong, 200, this);    //запустит новую песню
        } else {
            this.#afterServerConnect = true;    //включение режима синхронизации с сервером
            this.#playerRestart = false;    //флаг, разрешающий перезапустить плеер
            socket.emit('updateListenerList', this.#playerMode - 1, 'delete');  //отправка запроса на сервер для уменьшения количества слушателей данного плейлиста
            setTimeout(this.launchPlayer, 1500, this);      //запуск плеера
        }
    }

    //функция, обновляющая плеер
    refreshPlayer() {    
        this.#changeIcon('updatePlayer-disable');   //изменение стиля иконки
        this.#updateButton.style.zIndex = 0;
        this.#playerUnavailable = true;     //включение режима синхронизации с сервером
        this.popupScreen('unavailable');    //отображение всплывающего окна
        this.#continuePlaying(false);       //приостановка плеера
    }

    //функция, сбрасывающая настройки плеера
    #playerResetSettings() {    
        if (this.#playing) {    //если плеер проигрывает песню
            this.playPause();   //остановить проигрывание
        }
        this.#audioPlayer = new Audio();            //создание пустого аудио-объекта
        this.#audioPlayer.currentTime = 0;          //сборс времени проигрвания песни
        this.#currentTime.innerText = '00:00';      //отображение нулевого значения времени проигрывания песни
        this.#durationTime.innerText = '00:00';     //отображение нулевого значения длительности песни
        this.#barProgress.style.left = '-100%';     //перемещение ползунка воспроизведения в начальное положение
        this.#barLoad.style.left = '-100%';         //перемещение ползунка буферизации в начальное положение
        this.#songName.innerText = '';              //сброс названия песни
        this.#songArtist.innerText = '';            //сброс исполнителя песни
        clearTimeout(this.#loadingTimeout);         //отмена выполнения функции, запускающуюся с задержкой
    }

    //функция выбора авто-режима
    selectAutoMode() {    
        if (this.#autoSelect) {     //если включен авто-режим
            this.#changeIcon('selectAutoModeAutoSelect-true');  //изменить стиль иконки
        } else {
            this.#changeIcon('selectAutoModeAutoSelect-false');
        }
        this.#autoSelect = !this.#autoSelect;   //измение статуса флага
    }

    //функция выбора ручного режима
    selectManualMode(allElements, clicked) {    //аргументы: (все иконки, выбранная иконка)
        allElements.forEach(d => d.classList.remove("active__player")); //убрать ключ активного режима со всех стилей
        clicked.classList.add("active__player");    //добавить ключ активного режима на выбранный стиль
        if (this.#playing || this.#audioPlayer.src != '') {     //если песня проигрывается либо песня имеет источник
            socket.emit('updateListenerList', this.#playerMode - 1, 'delete');  //отправка запроса на сервер для уменьшения количества слушателей данного плейлиста
        }
        for (let key in this.#modeObject) {     //переборка всех стилей
            if (key + this.#modeObjectKey == clicked.classList.value) { //если найден активный стиль
                this.#playerMode = this.#modeObject[key];   //режим плеера принимает значение, выбранное пользователем
            }
        }

        this.#listenersAmount.innerText = 0;    //сброс счетчика слушателей 
        this.#autoSelect = true;                //установка флага отключения авто-режима
        this.#afterServerConnect = true         //установка режима синхронизации времени воспроизведения с сервером
        this.#playerRestart = false;            //установка флага перезапуска плеера
        this.selectAutoMode();                  //выключение авто-режима
        if (this.#playing) {                    //если песня проигрывается
            this.playPause();                   //остановка проигрывания
        }
        this.#playerResetSettings();            //сброс начтроек плеера
    }

    //функция появления всплывающих окон
    popupScreen(element) {  //аргументы: (цель)
        let fadeTime = 200;     //время появления/исчезновения окон

        switch (element) {  //выбор цели
            /*case 'history': {
                if (this.#openedHistory) {
                    socket.emit('requestSongHistory', this.#playerMode);

                    this.#changeIcon('historyPlayerOpenedHistory-true');
                    $(this.#historyField).fadeIn(fadeTime);
                    this.#historyField.style.visibility = 'visible';
                    this.#historyPlaylists[this.#playerMode - 1].style.display = 'initial';
                    
                    socket.on('receiveSongHistory', data => {
                        console.log(data);
                        if (this.#historyPlayedAmounts[this.#playerMode - 1] < data.length) {
                            for (let i = this.#historyPlayedAmounts[this.#playerMode - 1]; i < data.length; i++) {
                                let childElement = document.createElement('div');
                                childElement.innerHTML = `${this.#defineTime(Date.parse(data[i].timestamp))}   ${data[i].artist} - ${data[i].song}`
                                this.#historyPlaylists[this.#playerMode - 1].appendChild(childElement);
                            }
                            this.#historyPlayedAmounts[this.#playerMode - 1] = data.length;
                        }
                    });
                    
                } else {
                    this.#changeIcon('historyPlayerOpenedHistory-false');
                    $(this.#historyField).fadeOut(fadeTime);
                    setTimeout(() => { 
                        this.#historyField.style.visibility = 'hidden'; 
                    }, fadeTime);
    
                    for (let i = 0; i < this.#historyPlayedAmounts.length; i++) {
                        this.#historyPlaylists[i].style.display = 'none';
                    }
                }
                this.#openedHistory = !this.#openedHistory;
            } break;*/
            case 'unavailable': {   //цель "Загрузка плеера"
                if (this.#playerUnavailable) {  //если нужно сделать плеер недоступным
                    $(this.#loadingScreen).fadeIn(fadeTime);    //плавное появление всплывающего окна
                    this.#loadingScreen.style.visibility = 'visible';   //изменение стилей
                    this.#loadingTimeout = setTimeout(() => {   //выполнение функции с задержкой
                        this.#updateButton.style.zIndex = 5;    //смена стилей кнопки "Обновить плеер"
                        this.#updateButton.style.opacity = '100%';
                        this.#changeIcon('updatePlayer-enable');
                    }, 7000);
                } else {
                    clearTimeout(this.#loadingTimeout);     //отмена выполнения функции с задержкой
                    this.#updateButton.style.zIndex = 0;    //смена стилей кнопки "Обновить плеер"
                    this.#updateButton.style.opacity = '40%';
                    this.#changeIcon('updatePlayer-disable');
                    $(this.#loadingScreen).fadeOut(fadeTime);   //плавное затухание всплывающего окна
                    setTimeout(() => {
                        this.#loadingScreen.style.visibility = 'hidden'; 
                    }, fadeTime);
                }
            } break;
        }
    }

    //функция изменения иконок
    #changeIcon(argument) {     //аргументы: (состояние иконки, на которое надо изменить)
        switch (argument) {
            case 'playPausePlaying-true':   //показать кнопку "Воспроизвести"
                document.getElementById('player-play__button__img').src = "Images/SVG/PlayRoundButton.svg";
                document.getElementById('player-play__button__img').alt = "Play";
                break;
            case 'playPausePlaying-false':  //показать кнопку "Пауза"
                document.getElementById('player-play__button__img').src = "Images/SVG/PauseRoundButton.svg";
                document.getElementById('player-play__button__img').alt = "Pause";
                break;
            case 'selectAutoModeAutoSelect-true':   //сделать кнопку "Авто-режим" активной
                $('.player__auto__button').removeClass('active__auto__player');
                break;
            case 'selectAutoModeAutoSelect-false':  //сделать кнопку "Авто-режим" неактивной
                $('.player__auto__button').addClass('active__auto__player');
                break;
            /*case 'historyPlayerOpenedHistory-true':
                $('.player__history__button').addClass('active__history');
                break;
            case 'historyPlayerOpenedHistory-false':
                $('.player__history__button').removeClass('active__history');
                break;*/
            case 'updatePlayer-enable':     //сдеелать кнопку "Обновить плеер" активной
                $('.player__update__button').addClass('active__update');
                break;
            case 'updatePlayer-disable':    //сдеелать кнопку "Обновить плеер" неактивной
                $('.player__update__button').removeClass('active__update');
                break;
        }
    }

    /*#defineTime(unformattedTime) {
        let temp = unformattedTime + 10800000;
        
        let seconds = Math.floor(temp / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds %= 60;
        let hours = Math.floor(minutes / 60);
        minutes %= 60;
        let date = Math.floor(hours / 24);
        hours %= 24;
        let month = Math.floor(date / 30);
        date %= 30;
        year = Math.floor(month / 12);
        month = month % 12;

        let sendTime = `${formattedTime.year.toString()}-${formattedTime.month.toString().padStart(2,'0')}-${formattedTime.date.toString().padStart(2,'0')} ${formattedTime.hour.toString().padStart(2,'0')}:${formattedTime.minute.toString().padStart(2,'0')}`;
        return sendTime;
    }*/
}


document.addEventListener("DOMContentLoaded", () => {
    player = new Player();      //получение объекта класса


    //список кнопок для выбора режима
    let divs = document.querySelectorAll(`.player__mode__sun,
        .player__mode__dayCloud,
        .player__mode__moon,
        .player__mode__nightCloud,
        .player__mode__rainCloud,
        .player__mode__lightningCloud`
    );


    player.getPlayButton().addEventListener('click', event => {     //событие нажатия ЛКМ для воспроизведения/остановки песни
        player.playPause();
    });
    player.getPlayButton().addEventListener('click', event => {     //событие нажатия ЛКМ для запуска плеера
        player.launchPlayer(player);
    });
    player.getUpdateButton().addEventListener('click', event => {   //событие нажатия ЛКМ для обновления плеера
        player.refreshPlayer();
    })
    /*player.getHistoryButton().addEventListener('click', event => {
        player.popupScreen('history');
    });*/
    player.getModeAuto().addEventListener('click', event => {       //событие нажатия ЛКМ для включения/отключения авто-режима
        player.selectAutoMode();
    });
    player.getSongVolume().addEventListener('mousemove', event => { //событие отслеживания действий мышки на ползунке для смены громкости плеера
        player.setAudioPlayerVolume(parseInt(player.getSongVolume().value) / parseInt(player.getSongVolume().max));
    });


    socket.on('updateListeners', data => {    //получение запроса от сервера для обновления количества слушателей
        if (!player.getFirstLaunch()) {     //получение данного режима плеера
            switch (player.getPlayerMode()) {   //установка количества слушателей в данном режиме
                case 1: player.setListenersAmount(data[0]); break;
                case 2: player.setListenersAmount(data[1]); break;
                case 3: player.setListenersAmount(data[2]); break;
                case 4: player.setListenersAmount(data[3]); break;
                case 5: player.setListenersAmount(data[4]); break;
                case 6: player.setListenersAmount(data[5]); break;
            }
        }
    });


    divs.forEach(div => {   //переборка всех кнопок с выбором режима
        div.addEventListener("click", event => {    //событие нажатия ЛКМ по конкретной кнопке для смены режима плеера
            player.selectManualMode(divs, div);     //изменить режим вручную
        });
    });
});


//получение экземпляра класса для других модулей
function getPlayerObject() {
    return player;
}