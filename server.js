import express from 'express';
import http from 'http';
import { Server as socketio } from 'socket.io';
import createGame from './public/js/game.js';

const app = express();
const server = http.createServer(app);
const sockets = new socketio(server);

app.use(express.static('public'));

const game = createGame();

game.subscribe((command) => {
    sockets.emit('stateChange', command);
});

game.subscribe((command) => {
    if (command.type == 'removeCandy') {
        game.addCandy();
    }
});

sockets.on('connection', (socket) => {
    const playerId = socket.id;
    console.log(`> Player connected on Server with id ${playerId}`);

    game.addPlayer({ playerId: playerId });

    socket.emit('setup', game.state);

    socket.on('configurePlayer', (command) => {
        command.playerId = playerId;

        game.configurePlayer(command);
    });

    socket.on('movePlayer', (command) => {
        command.playerId = playerId;

        game.movePlayer(command);
    });

    socket.on('disconnect', () => {
        game.removePlayer({ playerId: playerId });
        console.log(`> Player disconnected: ${playerId}`);
    });
});

game.addCandy();

server.listen(3000, () => {
    console.log('> Server listening on: http://localhost:3000');
});
