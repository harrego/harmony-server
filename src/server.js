import { randomBytes } from 'crypto';

import WebSocket from 'ws';
import sqlite3 from 'sqlite3';
import dbHelper from './db';
import { User } from './models/user';

// TODO: Move this to a permanent storage eg database
let clients = [];
let channels = [];

let db = new sqlite3.Database('messages.sqlite');

function reply(prevOp, success, error, data) {
  return JSON.stringify({
    op: 'WsReply',
    data: data,
    prevOp: prevOp,
    success: success,
    error: error
  });
}

function broadcastAll(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

async function handleMessage(ws, message) {
  const body = JSON.parse(message);

  // Connection
  if (body.op == 'Connect') {
    // TODO: fix so only one person can have that nickname
    clients.push(new User(body.data.nickname, body.data.operator));
    ws.send(reply(body.op, true, '', {}));
  } 
  else if (body.op == 'Disconnect') {
    clients = clients.filter(c => c.nickname !== body.data.nickname);
    ws.send(reply(body.op, true, '', {}));
  }

  // Message/Channel
  else if (body.op == 'MessageCreate') {
    const msg = body.data.message;
    //const chan = channels.find(c => c.id === body.data.channelId);
    //channels.find(c => c.id === body.data.message.channelId).messages.push(msg);
    const rawMessage = {
      ...msg,
      messageId: 'whatever' + Math.random().toString(36).substring(4) /* avoiding non unique errors */
    };

    await dbHelper.insertMessages(db, rawMessage);

	let messages;
	try {
		messages = await dbHelper.queryMessages(db);
	} catch (err) {
		console.log("error: couldnt query msgs");
		console.log(err);
		return;
	}
	
    console.log(messages);
    //console.log(chan.messages);

    // Notify all connected clients
    //broadcastAll(channels);

    ws.send(reply(body.op, true, '', {}));
  }
  else if (body.op == 'ChannelCreate') {
    channels.push({
      'name': body.data.name,
      'id': body.data.name,//randomBytes(16).toString('hex'),
      'messages': []
    });
    ws.send(reply(body.op, true, '', {}));
  }
  else if (body.op == 'ChannelDelete') {
    // TODO: add checks for operator status
    channels = channels.filter(c => c.id !== body.data.channelId);
    ws.send(reply(body.op, true, '', channels));
  }
  else if (body.op == 'QueryChannels') {
    ws.send(reply(body.op, true, '', channels));
  }

  console.log(clients);
}

// Setup our websocket server
console.log('Serving WebSocket connections on :6969');
const wss = new WebSocket.Server({ port: 6969 });

// Create the database(s) if they dont exist
(async () => {
  console.log('Creating the databases if they don\'t exist..');
  await dbHelper.createDb(db);
  console.log('Configured databases')
})();

wss.on('connection', (ws, req) => {
  console.log(`Connection from ${req.socket.remoteAddress}`);

  // TODO: handle the message
  ws.on('message', message => {
    handleMessage(ws, message);
  });
});