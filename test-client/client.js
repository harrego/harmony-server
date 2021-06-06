const WebSocket = require('ws');
const ws = new WebSocket('ws://127.0.0.1:6969/');

// Ugly testing code
ws.on('open', function () {
  ws.send(JSON.stringify({
    'op': 'Connect',
    'data': {
      'nickname': 'test123',
      'operator': true
    }
  }));

  // ws.send(JSON.stringify({
  //   'op': 'ChannelCreate',
  //   'data': {
  //     'name': 'general'
  //   }
  // }))

  ws.send(JSON.stringify({
    'op': 'MessageCreate',
    'data': {
      'message': {
        'channelId': 'general',
        'authorId': 'testing1234',
        'timestamp': Date.now(),
        'content': 'test content'
      }
    }
  }));

  // ws.send(JSON.stringify({
  //   'op': 'ChannelCreate',
  //   'data': {
  //     'name': 'memes'
  //   }
  // }))

  // ws.send(JSON.stringify({
  //   'op': 'ChannelCreate',
  //   'data': {
  //     'name': 'third-channel'
  //   }
  // }))

  // ws.send(JSON.stringify({
  //   'op': 'QueryChannels'    
  // }));

  // ws.send(JSON.stringify({
  //     'op': 'Disconnect',
  //     'data': {
  //         'nickname': 'test123'
  //     }
  // }));
});

ws.on('message', function incoming(data) {
  console.log(data);
});

ws.on('close', function () {
  console.log(`Disconnected from server ${ws}`);
  ws.send(JSON.stringify({
    'op': 'Disconnect',
    'data': {
      'nickname': 'test123'
    }
  }));
});