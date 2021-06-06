# Protocol

## WebSockets
The server for Harmony uses WebSockets instead of plain TCP sockets, or HTTP callbacks
to provide a modern, easy to use interface that's scalable.

## Reply
Every WebSocket command will reply with the following packet
```js
{
    "op": "WsReply",
    "command": "MessageSend" // eg MessageSend
    "success": "true", // whether the command succeeded or not
    "error": "", // empty if no error
}
```

## Channels
ChannelCreate:
```js
{
    "op": "ChannelCreate",
    "data": {
        "name": "new-channel",
    }
}
```

ChannelEdit:
```js
{
    "op": "ChannelEdit",
    "data": {
        "id": ..,
        "newName": "new-channel-name"
    }
}
```

ChannelDelete:
```js
{
    "op": "ChannelDelete",
    "data": {
        "id": ..
    }
}
```

QueryChannels:
```js
{
    "op": "QueryChannels",
    "data": {
        "channels": [
            "testing"
        ]
    }
}
```

## Messages
MessageSend:
```js
{
    "op": "MessageSend",
    "data": {
        "author": <User>,
        "timestamp": <UNIXTimestamp>,
        "content": "hello"
    }
}
```