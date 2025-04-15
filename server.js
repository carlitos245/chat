// Importation des modules nécessaires
const express = require('express'); // Framework pour créer le serveur
const http = require('http'); // Module pour créer un serveur HTTP
const { Server } = require('socket.io'); // Module pour gérer les sockets (communication temps réel)

// Initialisation de l'application Express
const app = express();
const server = http.createServer(app); // Création du serveur HTTP basé sur Express
const io = new Server(server); // Initialisation de Socket.IO

// Ajout de la Politique de Sécurité de Contenu (CSP)
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self'; style-src 'self'"
    );
    next();
});

// Servir les fichiers statiques depuis le dossier "public"
app.use(express.static('public')); // Permet de servir le HTML, CSS et JS contenus dans "public"

// Route principale
app.get('/', (req, res) => {
    res.send('Bienvenue sur mon application chat !');
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté.');

    socket.on('user connected', (data) => {
        console.log(`Utilisateur connecté : Pseudo = ${data.pseudo}, Email = ${data.email}`);
        socket.broadcast.emit('message', { pseudo: 'Système', text: `${data.pseudo} a rejoint le chat !` });
    });

    socket.on('message', (data) => {
        console.log('Message reçu du client :', data);
        // Diffuser le message avec le pseudo et le texte
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur a quitté le chat.');
    });
});

// Lancer le serveur
const port = process.env.PORT || 10000;
server.listen(port, '0.0.0.0', () => {
    console.log(`Serveur lancé sur le port ${port}`);
});