const express = require("express");
const WebSocketServer = require("websocket").server;

const app = express();
const port = 9000 || process.env.PORT;
const httpServer = app.listen(port, () => console.log(`Listening on port ${port}`));

app.get("/", (request, response) => {
    const websocket = new WebSocketServer({ httpServer });
    websocket.on("request", handleRequest);
    
    response.send("This is running!");
})

function handleRequest(request) {
    const connection = request.accept(null, request.origin);

    connection.on("open", () => console.log("We OPEN!!!"));
    connection.on("close", () => console.log("We SHUT IT DOWWNNNNN!!!"));
    connection.on("message", (message) => handleMessage(message, connection));
  
    pokeEvery5Seconds(connection);
}

function handleMessage(message, connection) {
    console.log(`The message: ${message.utf8Data}`);
    
    connection.send(`Yo we heard ${message.utf8Data}`);
}

function pokeEvery5Seconds(connection) {
    connection.send(`You owe me ${ Math.random() }`);

    setTimeout(() => pokeEvery5Seconds(connection), 5000);
}