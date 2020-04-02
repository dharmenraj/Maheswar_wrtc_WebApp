const fs = require('fs');
const path = require('path');
const url = require('url');
var httpServer = require('http');

// extra
require('./api/data/db');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));

// cross origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type,Accept, token');
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
        return res.status(200).json();
    }
    next();
});

// end here

const ioServer = require('socket.io');
const RTCMultiConnectionServer = require('rtcmulticonnection-server');

var PORT = 3000;

const jsonPath = {
    config: 'config.json',
    logs: 'logs.json'
};

const BASH_COLORS_HELPER = RTCMultiConnectionServer.BASH_COLORS_HELPER;
const getValuesFromConfigJson = RTCMultiConnectionServer.getValuesFromConfigJson;
const getBashParameters = RTCMultiConnectionServer.getBashParameters;
const resolveURL = RTCMultiConnectionServer.resolveURL;

var config = getValuesFromConfigJson(jsonPath);
config = getBashParameters(config, BASH_COLORS_HELPER)

var httpApp;

httpApp = httpServer.createServer(app);

app.use(express.static(path.join(__dirname, 'dist/chat-app')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/chat-app/index.html'));
});

RTCMultiConnectionServer.beforeHttpListen(httpApp, config);
httpApp = httpApp.listen(process.env.PORT || PORT, process.env.IP || "0.0.0.0", function () {
    RTCMultiConnectionServer.afterHttpListen(httpApp, config);
});

let io = ioServer(httpApp);
// socket.io codes goes below
io.on('connection', function (socket, httpApp) {
    RTCMultiConnectionServer.addSocket(socket, config);
    console.log('connected');
    
    socket.on('new-message', (message) => {
        console.log("message+++++", message)
        io.emit('new-message', message);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});