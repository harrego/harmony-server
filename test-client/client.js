const WebSocket = require('ws');
const ws = new WebSocket('ws://127.0.0.1:6969/');

ws.on('open', function() {
    ws.send(JSON.stringify({
        'op': 'Connect',
        'data': {
            'nickname': 'test123'
        }
    }));
});

ws.on('message', function incoming(data) {
    console.log(data);
});

ws.on('close', function() {
    console.log(`Disconnected from server ${ws}`);
    ws.send(JSON.stringify({
        'op': 'Disconnect',
        'data': {
            'nickname': 'test123'
        }
    }));
});