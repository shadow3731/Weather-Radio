const express = require('express');					//импорт модуля express
const app = express();								//создание приложения на основе express
const server = require('http').createServer(app);	//создание сервера
const io = require('socket.io')(server);			//импорт модуля socket
const fs = require('fs');
const { getAudioDurationInSeconds } = require('get-audio-duration');	//импорт модуля определителя длительности аудио
const mysql = require('mysql');						//импорт модуля mysql
const bcrypt = require('bcrypt');					//импорт модуля bcrypt


const PORT = process.env.PORT || 3000; 				//порт сервера
server.listen(PORT, () => {				//запуск сервера
	console.log(`Server is listening on port ${PORT}.`);
});


app.use(express.static('client'));		//работа статических элементов
app.get('/', (req, res) => {	//получение маршрута к HTML-документу
	res.sendFile(`${__dirname}/client/index.html`);
});


let socketConnections = new Array();		//массив сокетов
let socketAuthorized = new Array();		//массив авторизованных пользователей
let socketPrivilege = new Array();		//массив привилегий
let socketLogin = new Array();			//массив логинов
let socketBan = new Array();				//массив банов пользователей

let SQLpool = mysql.createPool({	//создание пула подключений к БД
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	connectionLimit: 3,
});

const playlistsAmount = 6;							//количество плейлистов
let songsQueue = new Array(playlistsAmount);		//массив плейлистов
let playlistsTime = new Array(playlistsAmount);		//массив отметок времени для плейлистов
let playerListenerSockets = new Array(playlistsAmount);	//массив количества случшателей плейлистов
let songsTimers = new Array(playlistsAmount);		//массив таймеров
let readyPlaylists = new Array(playlistsAmount);	//массив флага сформированных плейлистов
const nextDurationTime = 250;						//время на определение длительности одной песни

let SQLcreationQueries = fs.readFileSync("./server/SQL/Create Tables.txt", "utf8").split("\r\n");


createTablesToDB(SQLcreationQueries, 0);
//makeNormalPlaylistAtLaunch(0);		//запуск таймеров для синхронизации с клиентом
//clearOnlineListInDB();				//очистить список авторизованных пользователей


io.sockets.on('connection', socket => {		//при подключении сокета (пользователя) к сайту
	socketConnections.push(socket);		//добавление сокета
	socketAuthorized.push(false);		//присваивание значений по умолчанию для данного сокета
	socketPrivilege.push(0);
	socketLogin.push(null);
	socketBan.push(null);

	launchChat(socket);			//запуск чата для клиента
	calculateOnline(null, "amount");	//высчитывание авторизованных пользователей


	socket.on('disconnect', data => {	//при отключении сокета от сайта
		let disconnectedLogin = socketLogin[socketConnections.indexOf(socket)];		//извлечение логина
		updateListenerList(socket, null, 'findAndDelete');		//уменьшение счетчика слушателей
		if (socketLogin[socketConnections.indexOf(socket)] != null) {	//если сокет был авторизован перед отключением
			delOnlineInDB(socket, disconnectedLogin);	//удалить из списка авторизованных
		}

		socketBan.slice(socketConnections.indexOf(socket), 1);
		socketLogin[socketConnections.indexOf(socket)] = null;				//сброс логина
		socketLogin.slice(socketConnections.indexOf(socket), 1);			//удаление логина
		socketPrivilege.slice(socketConnections.indexOf(socket), 1);		//удаление привилегии
		socketAuthorized.splice(socketConnections.indexOf(socket), 1);		//удаление флага авторизации
		socketConnections.splice(socketConnections.indexOf(socket), 1);		//удаление сокета
	});

	socket.on('requestAuthenticationChecking', data => {	//получение запроса от клиента для проверки данных авторизации
		checkAuthentication(socket, data[0], data[1]);		//проверка авторизации
	});

	socket.on('requestRegistrationChecking', data => {		//получение запроса от клиента для проверки данных регистрации
		checkRegistration(socket, data[0], data[1]);		//проверка регистрации
	});

	socket.on('requestRegNewUser', data => {		//получение запроса от клиента для совершения регистрации
		if (data[4]) {		//если проверка регистрации пройдена
			commitRegistration(socket, data[0], data[1], data[2], data[3]);		//совершить регистрацию
		}
	});

	socket.on('offlineUser', data => {		//получение запроса от клиента для смены статуса на оффлайн при выходе из аккаунта
		socketAuthorized[socketConnections.indexOf(socket)] = false;	//сброс флага авторизации
		socketPrivilege[socketConnections.indexOf(socket)] = 0;			//сброс привилегии
		socketLogin[socketConnections.indexOf(socket)] = null;			//сброс логина

		delOnlineInDB(socket, data);	//удалить из списка авторизованных
	});

	socket.on('sendMessage', data => {		//получение запроса от клиента для отправки сообщения
		let banChecking = hasBan(data.login);
		if (banChecking != null) {	//если у пользователя есть действительный бан
			socket.emit('showAlert', `Вы не можете воспользоваться чатом, так как вы забанены до ${defineTime(socketBan[socketLogin.indexOf(data.login)][banChecking].deadline, 'sendMessage', 'hasBan')}`);	//отправка запроса клиенту для уведомления о бане
		} else {
			if (socketAuthorized[socketConnections.indexOf(socket)]) {	//если пользователь авторизован
				sendMessageToDB(data.login, data.sendingTime, data.message, data.charAmount);	//отправить новое сообщение в БД
			} else {
				socket.emit('showAlert', "Авторизуйтесь, чтобы воспользоваться чатом");		//отправка запроса клиенту для уведомления о необходимости авторизации
			}
		}
	});

	socket.on('deleteMessage', data => {	//получение запроса от клиента для удаления сообщения
		let banChecking = hasBan(socketLogin[socketConnections.indexOf(socket)]);
		if (banChecking != null) {
			socket.emit('showAlert', `Вы не можете воспользоваться чатом, так как вы забанены до ${defineTime(socketBan[socketLogin.indexOf(data[0])][banChecking].deadline, 'sendMessage', 'hasBan')}`);	//отправка запроса клиенту для уведомления о бане
		} else if (socketPrivilege[socketConnections.indexOf(socket)] < 2) {
			socket.emit('showAlert', `Вы не обладаете достаточными правами для удаления сообщения.`);
		} else {
			SQLpool.query(`UPDATE chat SET deleted=true WHERE sender_login=? AND send_time=? AND text=?`, [data[0], data[1], data[2]], (err, res) => {	//запрос к БД для установки флага удаленного сообщения
				if (!err) {		//если запрос к БД успешный
					io.sockets.emit('deleteMessageInChat', data);	//отправка запроса всем клиентам для удаления сообщения
				} else {		//если запрос к БД неудачный
					console.log('Error occured at deleteMessage. ', err);
				}
			});
		}
	});

	socket.on('giveBanToUser', (login, cause, time) => {	//получение запроса от клиента для бана пользователя
		let banChecking = hasBan(login);
		if (banChecking != null) {
			socket.emit('showAlert', `Вы не можете воспользоваться чатом, так как вы забанены до ${defineTime(socketBan[socketLogin.indexOf(login)][banChecking].deadline, 'sendMessage', 'hasBan')}`);	//отправка запроса клиенту для уведомления о бане
		} else if (socketPrivilege[socketConnections.indexOf(socket)] < 2) {
			socket.emit('showAlert', `Вы не обладаете достаточными правами для выдачи бана.`);
		} else {
			if (login != 'Система') {	//если объектом бана не является система
				SQLpool.query(`SELECT privilege FROM users WHERE login=?`, login, (err, res) => {		//запрос к БД для получения привелегии объекта бана
					if (!err) {		//если запрос к БД успешный
						if (socketPrivilege[socketConnections.indexOf(socket)] > res[0].privilege) {	//если привелегия пользователя, который хочет забанить, не меньше привелегии объекта бана
							banUser(socket, login, cause, time);	//забанить пользователя
						} else {
							socket.emit('showAlert', "Вы не можете забанить этого пользователя");	//отправка запроса клиенту для уведомления о невозможности выдаче бана
						}
					} else {
						console.log('Error occured at giveBanToUser. ', err);
					}
				});
			} else {
				socket.emit('showAlert', "Нельзя забанить служебного пользователя Система");	//отправка запроса клиенту для уведомления о невозможности выдаче бана
			}
		}
	});

	/*socket.on('requestSongHistory', data => {
		getSongHistoryFromDB(socket, data)
	});*/

	socket.on('requestPlayerMetadata', data => {	//получение запроса от клиента для получения метаданных плеера
		let metadata = {	//формирование метаданных
			playlist: getPlaylist(data - 1),	//информация об прослушиваемом плейлисте
			startPointTime: getPlaylistTime(data - 1)	//информация о точке времени воспроизведения
		}
		if (readyPlaylists[data - 1]) {
			socket.emit('receivePlayerMetadata', metadata);		//отправка запроса клиенту для получения метаданных
		}
	});

	socket.on('updateListenerList', (data, action) => {		//получение запроса от клиента для обновления счетика слушателей
		updateListenerList(socket, data, action);	//обновить счетчик
	});

	socket.on('requestUsersInformation', () => {	//получение запроса от клиента для получения информации о пользоывателях сайта
		calculateGuests(socket);			//высчитать количество неавторизованных пользователей
		calculateRegistered(socket);		//высчитать количество зарегистрированных пользователей
		calculateOnline(socket, "list");	//высчитать количество авторизованных пользователей
	});
});



//функции хидера
//функция проверки данных авторизации
function checkAuthentication(socket, login, password) {		//аргументы: (сокет, логин, пароль)
	let checkStatus = "loginNotExists";		//статус авторизации

	SQLpool.query(`SELECT login, password, privilege FROM users`, (err, res) => {	//запрос к БД для получения списка зарегистрированных пользователей
		if (!err) {
			let i = 0;	//счетчик присланных данных
			while (checkStatus == "loginNotExists" && i < res.length) {		//пока статус авторизации не изменится, или пока не будет проверен весь список
				if (login == res[i].login) {	//если логин уже есть в БД
					if (bcrypt.compareSync(password, res[i].password)) {	//если введенный и расхешированный пароли совпадают
						checkStatus = null;		//сброс статуса
						socketAuthorized[socketConnections.indexOf(socket)] = true;		//данный пользователь авторизован
						socketPrivilege[socketConnections.indexOf(socket)] = res[i].privilege;		//получение привелегии данного пользователя
						socketLogin[socketConnections.indexOf(socket)] = login;		//получение логина данного пользователя
		
						getBans(login);
						addOnlineInDB(socket, login, false);	//добавить пользователя в список авторизованных в БД
					} else {
						checkStatus = "passwordNotMatches";		//статус "Пароль неверный"
					}
				} else {
					i++;	//продолжение проверки
				}
			}

			socket.emit('receiveAuthenticationChecking', checkStatus);		//отправка запроса клиенту для получения статуса авторизации
		} else {
			console.log("Error occured at checkAuthentication(). ", err);
		}
	});
}

//функция проверки данных регистрации
function checkRegistration(socket, login, email) {	//аргументы: (сокет, логин, e-mail)
	let checkStatus = null;		//статус регистрации

	SQLpool.query(`SELECT login, email FROM users`, (err, res) => {		//запрос к БД для получения некоторых данных зарегистрированных пользователей
		if (!err) {
			let i = 0;		//счетчик

			while (checkStatus == null && i < res.length) {		//пока статус регистрации не изменится, или пока не будет проверен весь список
				if (login == res[i].login) {		//если логин уже зарегистрирован
					checkStatus = "loginExists";	//изменение статуса регистрации
				} else if (email == res[i].email) {	//если e-mail уже зарегистрирован
					checkStatus = "emailExists";	//изменение статуса регистрации
				} else {
					i++;							//продолжение проверки
				}
			}

			setTimeout(() => {
				socket.emit('receiveRegistrationChecking', checkStatus);	//отправка запроса клиенту для получения статуса регистрации
			}, 100);
			
		} else {
			console.log("Error occured at checkRegistration(). ", err);
		}
	});
}

//функция совершения регистрации
function commitRegistration(socket, login, email, password, regDate) {		//аргументы: (сокет, логин, e-mail, пароль, дата регитрации)
	bcrypt.hash(password, 5).then(hashedPassword => {	//хеширование пароля
		SQLpool.query(`INSERT INTO users(login, password, email, privilege, registration) VALUES (?, ?, ?, ?, ?)`, [login, hashedPassword, email, 1, regDate], (err, res) => {	//запрос к БД для внесения нового зарегистрированного пользователя
			if (!err) {
				socketAuthorized[socketConnections.indexOf(socket)] = true;	//изменение флага авторизации
				socketPrivilege[socketConnections.indexOf(socket)] = 1;		//присвоение стандартной привелегии
				socketLogin[socketConnections.indexOf(socket)] = login;		//получение логина
	
				calculateRegistered(socket);		//высчитать количество зарегитрированных пользователей
				
				addOnlineInDB(socket, login, true);	//добавить пользователя в список авторизованных
			} else {
				console.log("Error occured at commitRegistration(). ", err);
			}
		});
	}).catch(err => {
		console.log("Error occured at commitRegistration(). ", err);
	})
}



//функции чата
//функция отправки сообщений с БД к клиенту
function launchChat(socket) {	//аргументы: (сокет)
	SQLpool.query(`SELECT sender_login, send_time, text, login_privilege FROM chat WHERE deleted=false`, (err, res) => {	//запрос к БД для получения неудаленных сообщений
		if (!err) {
			socket.emit('receiveChatContent', res);		//отправка запроса клиенту для получения сообщений
		} else {
			console.log("Error occured at launchChat(). ", err);
		}
	});
}

//функция отправки нового сообщения в БД и клиентам
function sendMessageToDB(login, timeStamp, text, charAmount) {	//аргументы: (логин отправителя, время отправки, текст сообщения, количество символов сообщения)
	text = text.toString().replace('"', ' ');	//удаление двойных кавычек, вызывающих нарушение синтаксиса языка

	if (login == 'Система') {	//если сообщение отправляется системой
		SQLpool.query(`INSERT INTO chat(sender_login, send_time, text, char_amount, login_privilege, deleted) VALUES (?, ?, ?, ?, ?, ?)`, [login, timeStamp, text, charAmount, 10, false], (err, res) => {	//запрос к БД для отправки сообщения в БД
			if (!err) {
				io.sockets.emit('addMessage', {sender_login: login, send_time: timeStamp, text: text, login_privilege: 10});	//отправка запроса всем клиентам для отображения нового сообщения
			} else {
				console.log("Error occured at sendMessageToDB(). ", err);
			}
		});
	} else {
		SQLpool.query(`INSERT INTO chat(sender_login, send_time, text, char_amount, login_privilege, deleted) VALUES (?, ?, ?, ?, ?, ?)`, [login, timeStamp, text, charAmount, socketPrivilege[socketLogin.indexOf(login)], false], (err, res) => {
			if (!err) {
				io.sockets.emit('addMessage', {sender_login: login, send_time: timeStamp, text: text, login_privilege: socketPrivilege[socketLogin.indexOf(login)]});
			} else {
				console.log("Error occured at sendMessageToDB(). ", err);
			}
		});
	}	
}

//функция выдачи бана пользователю
function banUser(socket, login, cause, time) {		//аргументы: (сокет, логин объекта бана, причина бана, длительность бана)
	SQLpool.query(`INSERT INTO users_banned(login, cause, deadline, banned_by) VALUES (?, ?, ?, ?)`, [login, cause, defineTime(new Date(), 'banUser', time), socketLogin[socketConnections.indexOf(socket)]], (err, res) => {		//запрос к БД для занесения пользователя в список забаненных
		if (!err) {
			getBans(login);		//обновить список банов пользователя
			let banMessage = `Пользователь ${login} был забанен по причине ${cause} на ${time} минут.`;		//сообщение о бане
			sendMessageToDB('Система', defineTime(new Date(), "sendMessage", null), banMessage, banMessage.length);		//отправить сообщение о бане от лица системы
		} else {
			console.log("Error occured at banUser(). ", err);
		}
	});
}



//функции плеера
//функция формирования плейлиста после запуска сервера
function makeNormalPlaylistAtLaunch(id) {
	readyPlaylists[id] = false;
	SQLpool.query(`SELECT artist, song, source FROM songs WHERE in_playlist${id + 1}=true`, (err, res) => {	//запрос к БД для получения списка песен, входящих в данный плейлист
		if (!err) {
			songsQueue[id] = new Array(res.length);
			for (let i = 0; i < res.length; i++) {	//переборка полученного списка
				songsQueue[id][i] = {				//формирование метаданных
					ID: i,							//номер песни
					artist: res[i].artist,			//исполнитель песни
					song: res[i].song,				//название песни
					source: res[i].source,			//источник песни
					songDuration: null				//длительность песни
				}
				getAudioDurationInSeconds(res[i].source).then(duration => {	//получение длительности песни
					songsQueue[id][i].songDuration = duration;
				});
			}
			setTimeout(() => {
				if (id < playlistsAmount - 1) {
					makeNormalPlaylistAtLaunch(++id);
				} else {
					for (let i = 0; i < playlistsAmount; i++) {
						makeShufflePlaylist(i);
						setPlaylistTime(i);
						playerListenerSockets[i] = new Array();
					}
					console.log(`Audioplayer is ready for being played.`);
				}
			}, res.length * nextDurationTime);
		} else {
			console.log('Error occured at makeNormalPlaylist(). ', err);
		}
	});
}

//функция формирования плейлиста
function makeNormalPlaylist(id) {
	SQLpool.query(`SELECT artist, song, source FROM songs WHERE in_playlist${id + 1}=true`, (err, res) => {	//запрос к БД для получения списка песен, входящих в данный плейлист
		if (!err) {
			songsQueue[id] = new Array(res.length);
			for (let i = 0; i < res.length; i++) {	//переборка полученного списка
				songsQueue[id][i] = {				//формирование метаданных
					ID: i,							//номер песни
					artist: res[i].artist,			//исполнитель песни
					song: res[i].song,				//название песни
					source: res[i].source,			//источник песни
					songDuration: null				//длительность песни
				}
				getAudioDurationInSeconds(res[i].source).then(duration => {	//получение длительности песни
					songsQueue[id][i].songDuration = duration;
				});
			}
			setTimeout(() => {
				makeShufflePlaylist(id);
				setPlaylistTime(id);
			}, res.length * nextDurationTime);
		} else {
			console.log('Error occured at makeNormalPlaylist(). ', err);
		}
	});
}

//функция перемешивания песен в плейлисте
function makeShufflePlaylist(id) {		//аргументы: (номер плейлиста)
	for (let i = songsQueue[id].length - 1; i > 0; i--) {	//переборка плейлиста
		const j = Math.floor(Math.random() * (i + 1));		//генерация случайного числа
		[songsQueue[id][i], songsQueue[id][j]] = [songsQueue[id][j], songsQueue[id][i]];	//перестановка песен
	}
}

//формирование отметки времени плейлиста для синхронизации воспроизведения сервера и клиента
function setPlaylistTime(id) {
	playlistsTime[id] = new Date();		//создание отметки времени

	if (songsQueue[id].length > 0) {		//если плейлист не пустой
		readyPlaylists[id] = true;
		songsTimers[id] = setTimeout(() => {
			songsQueue[id].pop();	//удаление данной песни из плейлиста
			setPlaylistTime(id);	//рекурсивный вызов функции
		}, songsQueue[id].at(-1).songDuration * 1000);	//выполнение части кода спустя время, равное длительности песни
	} else {
		readyPlaylists[id] = false;
		makeNormalPlaylist(id);		//формирование плейлиста
	}
}

//функция получения плейлиста
function getPlaylist(playlistID) {		//аргументы: (функция плейлиста)
	return songsQueue[playlistID];
}

//функция получения отметки времени для синхронизации воспроизведения
function getPlaylistTime(playlistID) {	//аргументы: (номер плейлиста)
	return playlistsTime[playlistID].getTime();
}

/*function sendIntoHistoryToDB(artist, song, playlistID) {
	SQLpool.query(`INSERT INTO songs_history(timestamp, playlist_id, artist, song) VALUES ('${defineTime(new Date(), 'songHistory')}', ${playlistID}, '${artist}', '${song}')`, (err, res) => {
		if (!err) {

		} else {
			console.log('Error occured. ', err);
		}
	})
}


function getSongHistoryFromDB(socket, ID) {
	SQLpool.query(`SELECT timestamp, artist, song FROM songs_history WHERE playlist_id=${ID}`, (err, res) => {
		if (!err) {
			socket.emit('receiveSongHistory', res);
		} else {
			console.log('Error occured. ', err);
		}
	})
}*/

//функция обновления счетчика слушателей плейлиста
function updateListenerList(socket, mode, action) {		//аргументы: (сокет, номер плейлиста, действие)
	if (action == 'add') { 	//действие "Добавить слушателя"
		playerListenerSockets[mode].push(socket); 	//увеличение счетчика
	} else if (action == 'delete') { 	//действие "Удалить слушателя"
		playerListenerSockets[mode].splice(playerListenerSockets[mode].indexOf(socket), 1); 	//уменьшение счетчика 
	} else if (action == 'findAndDelete') {		//действие "Найти сокет слушателя и удалить"
		let i = 0;		//счетчик плейлистов
		while (i < playerListenerSockets.length) {	//переборка плейлистов
			if (playerListenerSockets[i].indexOf(socket) != -1) {		//если найден сокет
				playerListenerSockets[i].splice(playerListenerSockets[i].indexOf(socket), 1);	//уменьшение счетчика
			} else { 
				i++; 	//продолжение поиска
			}
		}
	}
	io.sockets.emit('updateListeners', [playerListenerSockets[0].length, playerListenerSockets[1].length,	//отправка запроса всем клиентам для обновления счетчиков слушателей для всех плейлистов
		playerListenerSockets[2].length, playerListenerSockets[3].length, playerListenerSockets[4].length, playerListenerSockets[5].length]);
}



//функции футера
//функция добавления в БД пользователя в список авторизованных
function addOnlineInDB(socket, login, afterReg) {	//аргументы: (сокет, логин, флаг регистрации)
	let timeStamp = new Date();		//создание точки времени авторизации

	SQLpool.query(`INSERT INTO users_online(login, online_from) VALUES (?, ?)`, [login, defineTime(timeStamp, "userOnline", null)], (err, res) => {	//запрос к БД для добавления пользователя в список авторизованных
		if (!err) {
			if (afterReg) {		//если пользователь авторизовался сразу после регистрации
				socket.emit('receiveSuccessfulRegistration');	//отправка запроса клиенту для уведомления об успешной регистрации
			}
			socket.emit('changeHeaderForAuthorized');	//отправка запроса клиенту для изменения внешнего вида хидера
			socket.emit('changeChatForAuthorized', socketLogin[socketConnections.indexOf(socket)], socketPrivilege[socketConnections.indexOf(socket)]);		//отправка запроса клиенту для изменения внешнего вида чата
			calculateOnline(null, "amount");	//высчитать количество авторизованных пользователей
		} else {
			console.log("Error occured at addOnlineInDB(). ", err);
		}
	});
}

//функция добавления в БД пользователя из списка авторизованных
function delOnlineInDB(socket, login) {		//аргументы: (сокет, логин)
	let timeStamp = new Date();	//создание точки времени последней активности

	SQLpool.query(`DELETE FROM users_online WHERE login=?`, login, (err, res) => {	//запрос к БД для удаления пользователя из списка авторизованных
		if (!err) {

		} else {
			console.log("Error occured at delOnlineInDB(). ", err);
		}
	});
	SQLpool.query(`UPDATE users SET last_online=("${defineTime(timeStamp, "userOnline", null)}") WHERE login=?`, login, (err, res) => {	//запрос к БД для установки времени последней активности пользователя
		if (!err) {
			socket.emit('changeHeaderForNonAuthorized');	//отправка запроса клиенту для изменения внешнего вида хидера
			socket.emit('changeChatForNonAuthorized');		//отправка запроса клиенту для изменения внешнего вида чата
			calculateOnline(null, "amount");		//высчитать количество авторизованных пользователей
		} else {
			console.log("Error occured at delOnlineInDB(). ", err);
			checkStatus = "alreadyOnline";		//флаг обозначающий, что пользователь уже авторизован
			socket.emit('receiveAuthenticationChecking', checkStatus);	//отправка запроса клиенту для уведомления о статусе авторизации
		}
	});
}



//другие функции сервера

function createTablesToDB(queries, index) {
	SQLpool.query(queries[index], (err, res) => {
		if (!err) {
			if (index + 1 < queries.length) {
				createTablesToDB(queries, ++index);
			} else {
				console.log("Tables are configured.");
				addChatMessagesToDB();
				addMusicLibraryToDB();
				clearOnlineListInDB();
				addUsersToDB();
			}
		} else {
			console.log("Error occured at createTablesToDB().", err);
		}
	})
}

function addChatMessagesToDB() {
	SQLpool.query("SELECT message_id FROM chat WHERE message_id=1", (err, res) => {
		if (!err) {
			if (res.length == 0) {
				let SQLchatAdditingQuery = fs.readFileSync("./server/SQL/Add Chat Messages.txt", "utf8");
				SQLpool.query(SQLchatAdditingQuery, (err, res) => {
					if (!err) {
						console.log("Messages from chat were added to database.");
					} else {
						console.log("Error occured at addChatMessagesToDB().", err);
					}
				})
			}
		} else {
			console.log("Error occured at addChatMessagesToDB().", err);
		}
	})
}

function addMusicLibraryToDB() {
	SQLpool.query("SELECT song_id FROM songs WHERE song_id=1", (err, res) => {
		if (!err) {
			if (res.length == 0) {
				let SQLmusicAdditingQuery = fs.readFileSync("./server/SQL/Add Music Library.txt", "utf8");
				SQLpool.query(SQLmusicAdditingQuery, (err, res) => {
					if (!err) {
						console.log("Music library was added to database. Waiting for server to prepare songs for being played.");
						makeNormalPlaylistAtLaunch(0);
					} else {
						console.log("Error occured at addMusicLibraryToDB().", err);
					}
				})
			} else {
				console.log("Waiting for server to prepare songs for being played.");
				makeNormalPlaylistAtLaunch(0);
			}
		} else {
			console.log("Error occured at addMusicLibraryToDB().", err);
		}
	})
}

function addUsersToDB() {
	SQLpool.query("SELECT id FROM users WHERE id=1", (err, res) => {
		if (!err) {
			if (res.length == 0) {
				let SQLusersAdditingQuery = fs.readFileSync("./server/SQL/Add Users.txt", "utf8");
				SQLpool.query(SQLusersAdditingQuery, (err, res) => {
					if (!err) {
						console.log("Initial users were added to database.");
					} else {
						console.log("Error occured at addUsersToDB().", err);
					}
				})
			}
		} else {
			console.log("Error occured at addUsersToDB().", err);
		}
	})
}

//функция форматирования времени
function defineTime(time, target, addition) {	//аргументы: (неотформатированное время, цель, дополнительные данные)
	let unformattedTime = new Date(time);
	switch (target) {	//поиск цели
		/*case "songHistory": {
			let formattedTime = {
				year: unformattedTime.getFullYear(),
				month: unformattedTime.getMonth() + 1,
				date: unformattedTime.getDate(),
				hour: unformattedTime.getHours(),
				minute: unformattedTime.getMinutes(),
			};
			let sendTime = `${formattedTime.year.toString()}-${formattedTime.month.toString().padStart(2,'0')}-${formattedTime.date.toString().padStart(2,'0')} ${formattedTime.hour.toString().padStart(2,'0')}:${formattedTime.minute.toString().padStart(2,'0')}`;
			return sendTime;
		}*/
		case "banUser": {	//цель "Забанить пользователя"
			unformattedTime.setMinutes(unformattedTime.getMinutes() + addition);	//добавление длительности бана к времени получения бана
			let formattedTime = {
				year: unformattedTime.getFullYear(),	//извлечение года
				month: unformattedTime.getMonth() + 1,	//извлечение месяца
				date: unformattedTime.getDate(),		//извлечение дня
				hour: unformattedTime.getHours(),		//извлечение часов
				minute: unformattedTime.getMinutes(),	//извлечение минут
				second: unformattedTime.getSeconds()	//извлечение секунд
			};
			let sendTime = `${formattedTime.year.toString()}-${formattedTime.month.toString().padStart(2,'0')}-${formattedTime.date.toString().padStart(2,'0')} ${formattedTime.hour.toString().padStart(2,'0')}:${formattedTime.minute.toString().padStart(2,'0')}:${formattedTime.second.toString().padStart(2,'0')}`;	//форматирование времени
			return sendTime;
		}
		case "sendMessage": {		//цель "Отправить сообщение"
			if (addition == 'hasBan') {
				unformattedTime.setMinutes(unformattedTime.getMinutes() + unformattedTime.getTimezoneOffset());	//изменение часового пояса
			}
			let formattedTime = {
				year: unformattedTime.getFullYear(),	//извлечение года
				month: unformattedTime.getMonth() + 1,	//извлечение месяца
				date: unformattedTime.getDate(),		//извлечение дня
				hour: unformattedTime.getHours(),		//извлечение часов
				minute: unformattedTime.getMinutes(),	//извлечение минут
				second: unformattedTime.getSeconds()	//извлечение секунд
			};
			let sendTime = `${formattedTime.year.toString()}-${formattedTime.month.toString().padStart(2,'0')}-${formattedTime.date.toString().padStart(2,'0')} ${formattedTime.hour.toString().padStart(2,'0')}:${formattedTime.minute.toString().padStart(2,'0')}:${formattedTime.second.toString().padStart(2,'0')}`;	//форматирование времени
			return sendTime;
		}
		case "userOnline": {	//цель "Пользователь онлайн/оффлайн с"
			let formattedTime = {
				year: unformattedTime.getFullYear(),
				month: unformattedTime.getMonth() + 1,
				date: unformattedTime.getDate(),
				hour: unformattedTime.getHours(),
				minute: unformattedTime.getMinutes(),
				second: unformattedTime.getSeconds()
			};
			let sendTime = `${formattedTime.year.toString()}-${formattedTime.month.toString().padStart(2,'0')}-${formattedTime.date.toString().padStart(2,'0')} ${formattedTime.hour.toString().padStart(2,'0')}:${formattedTime.minute.toString().padStart(2,'0')}:${formattedTime.second.toString().padStart(2,'0')}`;
			return sendTime;
		}
	}
}

//функция высчитывания количества авторизованных пользователей
function calculateOnline(socket, target) {	//аргументы: (сокет, цель)
	switch (target) {
		case "amount":	//цель "Количество"
			let amount = 0;		//счетчик
			for (let i = 0; i < socketAuthorized.length; i++) {		//переборка массива
				if (socketAuthorized[i]) {		//если пользователь авторизован
					amount++;		//увеличение значения счетчика
				}
			}
			io.sockets.emit('changeOnlineAmount', amount);	//отправка запроса всем клиентам для изменения количетва авторизованных пользователей
			break;
		case "list":		//цель "Список"
			let list = [];	//пустой список
			for (let i = 0; i < socketLogin.length; i++) {	//переборка массива
				if (socketLogin[i] != null) {	//если пользователь авторизован
					list.push(socketLogin[i]);	//добавление логина к списку авторизованных
				}
			}
			socket.emit('changeOnlineInDialog', list);	//отправка запроса клиенту для отображения списка авторизованных пользователей
			break;
	}
}

//функция очистки списка авторизованных пользователей в БД
function clearOnlineListInDB() {
	SQLpool.query(`DELETE FROM users_online`, (err, res) => {	//запрос к БД для очистки авторизованных пользователей
		if (!err) {
			console.log('The list of authorized users was cleared from database.');
		} else {
			console.log("Error occured at clearOnlineListInDB().", err);
		}
	});
}

//функция высчитывания количества неавторизованных пользователей
function calculateGuests(socket) {	//аргументы: (сокет)
	let amount = 0;		//счетчик
		for (let i = 0; i < socketAuthorized.length; i++) {		//переборка массива
			if (!socketAuthorized[i]) {		//если пользователь неавторизован
				amount++;	//увеличение значения счетчика
		}
	socket.emit('changeGuestsAmount', amount);	//отправка запроса клиенту для отображения количества неавторизованных пользователей
	}
}

//функция высчитвания зарегистрированных пользователей
function calculateRegistered(socket) {	//аргументы: (сокет)
	SQLpool.query(`SELECT login FROM users`, (err, res) => {	//запрос к БД для получения списка зарегистрированных пользователей
		if (!err) {
			socket.emit('changeRegisteredAmount', res.length);	//отправка запроса клиенту для отображения списка зарегистрированных пользователей
		} else {
			console.log("Error occured at calculateRegustered().", err);
		}
	});
}

//функция получения списка банов пользователя
function getBans(login) {
	SQLpool.query(`SELECT deadline FROM users_banned WHERE login=?`, login, (err, res) => {	//запрос к БД для проверки статуса бана пользователя
		let i = 0;		//счетчик количества банов пользователя
		if (!err) {		//если запрос к БД успешный
			if (res.length == 0) {
				socketBan[socketLogin.indexOf(login)] = null;
			} else {
				socketBan[socketLogin.indexOf(login)] = res;
			}
		} else {
			console.log('Error occured at getBans(). ', err);
		}
	});
}

//функция проверки наличия бана у пользователя
function hasBan(login) {
	let i = 0;
	if (socketBan[socketLogin.indexOf(login)] != null) {
		while (i < socketBan[socketLogin.indexOf(login)].length) {		//проверка имеется ли у пользователя действительный бан
			let currentDate = new Date();
			if (currentDate.getTime() - currentDate.getTimezoneOffset() * 60000 <= socketBan[socketLogin.indexOf(login)][i].deadline.getTime()) {	//если время бана еще не прошло
				return i;	//отправка флага о наличии бана
			} else {
				i++;	//продолжение проверки
			}
		}
	}
	return null;
}