const express = require("express");
const WebSocketServer = require("websocket").server;

const app = express();
const port = process.env.PORT || 9000;
const httpServer = app.listen(port, () => console.log(`Listening on port ${port}`));
const websocket = new WebSocketServer({ httpServer });

app.get("/", (request, response) => {
    response.send("This is running!");
})

websocket.on("request", handleRequest);

const connections = [];
function handleRequest(request) {
    const connection = request.accept(null, request.origin);
    connections.push(connection);

    connection.on("open", () => console.log("We OPEN!!!"));
    connection.on("close", () => console.log("We SHUT IT DOWWNNNNN!!!"));

    connection.on("message", (message) => handleMessage(message, connections));
  
    pokeEvery5Seconds(connection);
}

function handleMessage(message, connections) {
    console.log(`The message: ${message.utf8Data}`);
    
    connections.forEach(connection => connection.send(`Yo we heard ${message.utf8Data}`));
}

function pokeEvery5Seconds(connection) {
    connection.send(`You owe me ${ Math.random() }`);

    setTimeout(() => pokeEvery5Seconds(connection), 5000);
}