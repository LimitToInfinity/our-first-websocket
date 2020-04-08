const webSocketURL = "wss://our-first-websocket.herokuapp.com";

const connectForm = document.querySelector(".connect");
const sendForm = document.querySelector(".send");
const chatBox = document.querySelector("section");
const leave = document.querySelector(".leave");

connectForm.addEventListener("submit", handleConnect);
sendForm.addEventListener("submit", handleSend);
leave.addEventListener("click", handleLeave);

const createWebSocket = () => {
    const newWebSocket = new WebSocket(webSocketURL);
    newWebSocket.onmessage = handleMessage;
    return new Promise(resolve => waitForReadyState(resolve, newWebSocket));
}

function waitForReadyState(resolve, newWebSocket) {
    if (newWebSocket.readyState === 1) { return resolve(newWebSocket); }
    else { setTimeout(() => waitForReadyState(resolve, newWebSocket), 40); }
}

let webSocket;
createWebSocket().then(socket => webSocket = socket);

function handleMessage(message) {
    const newChat = document.createElement("p");
    newChat.textContent = message.data;
    chatBox.prepend(newChat);
}

let name;
function handleConnect(event) {
    event.preventDefault();

    if (webSocket.readyState === 1) {
        enterUserIntoChat(event);
    } else {
        createWebSocket().then(socket => {
            webSocket = socket;
            handleConnect(event);
        });
    }
}

function enterUserIntoChat(event) {
    const formData = new FormData(event.target);
    name = formData.get("name");

    webSocket.send(`${name} says hello world`);
}

function handleSend(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const chat = formData.get("chat");

    webSocket.send(`${name}: ${chat}`);
}

function handleLeave() {
    const lastChat = `${name} says goodbye world`

    webSocket.send(lastChat);

    const optimisticallyRenderedChat = document.createElement("p");
    optimisticallyRenderedChat.textContent = lastChat;
    chatBox.prepend(optimisticallyRenderedChat);

    webSocket.close();
}