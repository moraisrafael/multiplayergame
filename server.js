import express from 'express';
import http from 'http';
import { Server as socketio } from 'socket.io';
import createGame from './public/game.js';


const app = express()
const server = http.createServer(app)
const sockets = new socketio(server)

app.use(express.static('public'));

const game = createGame();

game.subscribe((command) => {
    console.log(`> Emitting ${command.type}`);
    sockets.emit('stateChange', command);
});

sockets.on('connection', (socket) => {
    const playerId = socket.id;
    console.log(`> Player connected on Server with id ${playerId}`);

    game.addPlayer({ playerId: playerId });

    socket.emit('setup', game.state);

    socket.on('movePlayer', (command) => {
        console.log(`> received command: ${playerId}`);
        game.movePlayer({ playerId: playerId, keyPressed: command.keyPressed });
    })

    socket.on('disconnect', () => {
        game.removePlayer({ playerId: playerId });
        console.log(`> Player disconnected: ${playerId}`);
    })
})

setInterval(game.addCandy, 2000);

server.listen(3000, () => {
    console.log('> Server listening on: http://localhost:3000')
})
