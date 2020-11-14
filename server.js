import express from 'express';
import http from 'http';
import { Server as socketio } from 'socket.io';
import createGame from './public/game.js';

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

    socket.on('movePlayer', (command) => {
        game.movePlayer({ playerId: playerId, gameInput: command.gameInput });
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
