var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var app = express();
// var bodyParser = require('body-parser');
var indexRouter = require('./router/index.js');
var classRouter = require('./router/class.js');
var loginRouter = require('./router/login.js');
var registerRouter = require('./router/register.js')

var wsServer = require('./public/javascripts/myServers/CreatewsServer.js')

app.set('port',3000);
app.set('wsport',3010);

app.use(logger('dev'));
//用来解析req.body,分别对应application/json和application/x-www-form-unlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//用于req.cookies获取cookie
app.use(cookieParser());
// app.use(bodyParser.urlencoded({extended:true}));

app.use(indexRouter);
app.use('/class',classRouter);
app.use('/login',loginRouter);
app.use('/register',registerRouter);

// 不只是网站输入 还包括src
app.use(express.static(path.join(__dirname+'/public')));
app.use('/angular',express.static(path.join(__dirname+'/node_modules/angular')));
app.use('/jquery',express.static(path.join(__dirname+'/node_modules/jquery')));
app.use('/bootstrap',express.static(path.join(__dirname+'/node_modules/bootstrap')));
app.use('/echarts',express.static(path.join(__dirname+'/node_modules/echarts')));
app.use('/jquery.facedetection',express.static(path.join(__dirname+'/node_modules/jquery.facedetection')));

app.listen(app.get('port'),function(){
    console.log('web服务器端口:'+app.get('port'));
})

wsServer.listen(app.get('wsport'));

//桌面推流部分
// Use the websocket-relay to serve a raw MPEG-TS over WebSockets. You can use
// ffmpeg to feed the relay. ffmpeg -> websocket-relay -> browser
// Example:
// node websocket-relay yoursecret 8081 8082
// ffmpeg -i <some input> -f mpegts http://localhost:8081/yoursecret

var fs = require('fs'),
	http = require('http'),
	WebSocket = require('ws');

// if (process.argv.length < 3) {
// 	console.log(
// 		'Usage: \n' +
// 		'node websocket-relay.js <secret> [<stream-port> <websocket-port>]'
// 	);
// 	process.exit();
// }

var STREAM_SECRET = 'supersecret',
	STREAM_PORT = 8081,
	WEBSOCKET_PORT = 8082,
	RECORD_STREAM = false;

// Websocket Server
var socketServer = new WebSocket.Server({port: WEBSOCKET_PORT, perMessageDeflate: false});
socketServer.connectionCount = 0;
socketServer.on('connection', function(socket, upgradeReq) {
	socketServer.connectionCount++;
	console.log(
		'New WebSocket Connection: ',
		(upgradeReq || socket.upgradeReq).socket.remoteAddress,
		(upgradeReq || socket.upgradeReq).headers['user-agent'],
		'('+socketServer.connectionCount+' total)'
	);
	socket.on('close', function(code, message){
		socketServer.connectionCount--;
		console.log(
			'Disconnected WebSocket ('+socketServer.connectionCount+' total)'
		);
	});
});
socketServer.broadcast = function(data) {
	socketServer.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	});
};

// HTTP Server to accept incomming MPEG-TS Stream from ffmpeg
var streamServer = http.createServer( function(request, response) {
	var params = request.url.substr(1).split('/');

	if (params[0] !== STREAM_SECRET) {
		console.log(
			'Failed Stream Connection: '+ request.socket.remoteAddress + ':' +
			request.socket.remotePort + ' - wrong secret.'
		);
		response.end();
	}

	response.connection.setTimeout(0);
	console.log(
		'Stream Connected: ' +
		request.socket.remoteAddress + ':' +
		request.socket.remotePort
	);
	request.on('data', function(data){
		socketServer.broadcast(data);
		if (request.socket.recording) {
			request.socket.recording.write(data);
		}
	});
	request.on('end',function(){
		console.log('close');
		if (request.socket.recording) {
			request.socket.recording.close();
		}
	});

	// Record the stream to a local file?
	if (RECORD_STREAM) {
		var path = 'recordings/' + Date.now() + '.ts';
		request.socket.recording = fs.createWriteStream(path);
	}
})
// Keep the socket open for streaming
streamServer.headersTimeout = 0;
streamServer.listen(STREAM_PORT);

// console.log('Listening for incomming MPEG-TS Stream on http://"'+window.location.host 127.0.0.1:'+STREAM_PORT+'/<secret>');
// console.log('Awaiting WebSocket connections on ws://127.0.0.1:'+WEBSOCKET_PORT+'/');
