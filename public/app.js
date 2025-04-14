// Initialisation de la connexion Socket.IO
let socket; // Déclarer la variable socket
let userPseudo = ''; // Variable pour stocker le pseudo utilisateur

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser la connexion Socket.IO uniquement après le chargement du DOM
    socket = io();

    // Écouter le clic sur le bouton "Se connecter"
    document.getElementById('connect-button').addEventListener('click', connectUser);

    // Écouter le clic sur le bouton "Envoyer"
    document.getElementById('send-button').addEventListener('click', sendMessage);

    // Écouter les messages depuis le serveur
    socket.on('message', (data) => {
        const messageList = document.getElementById('message-list');
        const newMessage = document.createElement('p');
        newMessage.textContent = `${data.pseudo} : ${data.text}`;
        messageList.appendChild(newMessage);
    });
});

function connectUser() {
    const pseudo = document.getElementById('pseudo').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!pseudo || !email) {
        alert("Veuillez entrer votre pseudo et votre email !");
        return;
    }

    userPseudo = pseudo; // Enregistrer le pseudo localement

    // Envoyer les informations de connexion au serveur
    socket.emit('user connected', { pseudo, email });

    // Passer à la zone de chat
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('chat-section').style.display = 'block';
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (message) {
        socket.emit('message', { pseudo: userPseudo, text: message });
        messageInput.value = '';
    } else {
        alert("Veuillez entrer un message avant d'envoyer !");
    }
}
