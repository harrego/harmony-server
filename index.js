const express = require('express');
const WebSocket = require('ws');

// TODO: Move this to a permanent storage eg database
let clients = [];

function handleMessage(message) {
    console.log(message);
}

// Setup our websocket server
const wss = new WebSocket.Server({ port: 6969 });
wss.on('connection', function connect (ws, req) {
    console.log(`Connection from ${req.socket.remoteAddress}`);

    // TODO: handle the message
    ws.on('message', function incoming(message) {
        console.log(message);
    });

    // Send reply
    ws.send(JSON.stringify({
        'op': 'WsReply',
        'success': 'true',
        'error': ''
    }));
});