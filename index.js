const express = require('express');
const ws = require('ws');

const app = express();

// Setup our websocket server
const wss = new ws.Server({ noServer: true });
wss.on('connection', socket => {
    // TODO: handle the message
    wss.on('message', message => console.log(message));
});

// Pipe it through express
const server = app.listen(3000);
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, socket => {
        wss.emit('connection', socket, request);
    });
});