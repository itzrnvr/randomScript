const WebSocket = require('ws');

const socket = new WebSocket('wss://ws.chatapp.dev/');

socket.on('open', function open() {
    console.log('Connected to the server.');

    // The message you want to send
    const data = JSON.stringify({
      "action": "chat",
      "hash": "6347648ef7caacb7",
      "messages": [
        {
          "content": "You are a helpful assistant",
          "role": "system"
        },
        {
          "content": "I want you to act as a relationship coach. I will provide some details about the two people involved in a conflict, and it will be your job to come up with suggestions on how they can work through the issues that are separating them. This could include advice on communication techniques or different strategies for improving their understanding of one another's perspectives. Please start the conversation with greetings",
          "role": "user"
        },
        {
          "content": "Sure! I'd be happy to help you as a relationship coach. Please provide me with some details about the two individuals involved in the conflict, and we can work together to find ways for them to work through their issues.",
          "role": "assistant"
        },
        {
          "content": "gg",
          "role": "user"
        }
      ],
      "model": "gpt3.5",
      "rtd": true,
      "uid": "086a31b8640ea0637e3fda7cb63f7f3e",
      "v": "1.0"
    });

    socket.send(data);
});

socket.on('message', function incoming(data) {
    const message = data.toString();
    try {
        // Try to parse the message as JSON
        const jsonMessage = JSON.parse(message);
        // Log the parsed JSON message
        console.log('Parsed message:', jsonMessage);
    } catch (error) {
        // Handle any errors that occur during JSON parsing
        console.error('Could not parse the message as JSON:', message, error);
    }
});

socket.on('close', function close() {
    console.log('Disconnected from the server.');
});

socket.on('error', function error(error) {
    console.error('WebSocket error:', error);
});
