export default function createGame() {
    const state = {
        players: {},
        candy: {},
        screen: {
            width: 10,
            height: 10,
        },
    };

    const observers = [];

    function subscribe(observerFunction) {
        observers.push(observerFunction);
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command);
        }
    }

    function setState(newState) {
        Object.assign(state, newState);
    }

    function addPlayer(command) {
        const playerId = command.playerId;
        const playerName = command.playerName ? command.playerName : playerId;
        const playerX =
            'playerX' in command
                ? command.playerX
                : Math.floor(Math.random() * state.screen.width);
        const playerY =
            'playerY' in command
                ? command.playerY
                : Math.floor(Math.random() * state.screen.height);

        state.players[playerId] = {
            playerName: playerName,
            x: playerX,
            y: playerY,
            score: 0,
        };

        notifyAll({
            type: 'addPlayer',
            playerId: playerId,
            playerName: playerName,
            playerX: playerX,
            playerY: playerY,
        });
    }

    function removePlayer(command) {
        const playerId = command.playerId;

        delete state.players[playerId];

        notifyAll({
            type: 'removePlayer',
            playerId: playerId,
        });
    }

    function configurePlayer(command) {
        const playerId = command.playerId;
        const playerName = command.playerName.substring(0, 20);
        const player = state.players[playerId];

        if (player && playerName) {
            player.playerName = playerName;

            notifyAll({
                type: 'configurePlayer',
                playerId: playerId,
                playerName: playerName,
            });
        }
    }

    function addScore(command) {
        const player = state.players[command.playerId];
        player.score += command.score;

        notifyAll({
            type: 'addScore',
            playerId: command.playerId,
            score: command.score,
        });
    }

    function addCandy(command) {
        if (!command) {
            command = {};
        }
        const candyId =
            'candyId' in command
                ? command.candyId
                : Math.floor(Math.random() * 1000000000);
        const candyX =
            'candyX' in command
                ? command.candyX
                : Math.floor(Math.random() * state.screen.width);
        const candyY =
            'candyY' in command
                ? command.candyY
                : Math.floor(Math.random() * state.screen.height);

        state.candy[candyId] = {
            x: candyX,
            y: candyY,
        };

        notifyAll({
            type: 'addCandy',
            candyId: candyId,
            candyX: candyX,
            candyY: candyY,
        });
    }

    function removeCandy(command) {
        const candyId = command.candyId;

        delete state.candy[candyId];

        notifyAll({
            type: 'removeCandy',
            candyId: candyId,
        });
    }

    const movement = {
        up: function (player) {
            if (player.y <= 0) {
                player.y = state.screen.height;
            }
            player.y--;
        },
        down: function (player) {
            if (player.y >= state.screen.height - 1) {
                player.y = -1;
            }
            player.y++;
            // console.log(`x:${player.x}, y:${player.y}`);
        },
        left: function (player) {
            if (player.x <= 0) {
                player.x = state.screen.width;
            }
            player.x--;
        },
        right: function (player) {
            if (player.x >= state.screen.width - 1) {
                player.x = -1;
            }
            player.x++;
        },
    };

    function movePlayer(command) {
        const player = state.players[command.playerId];
        const movementFunction = movement[command.gameInput];

        if (player && movementFunction) {
            movementFunction(player);
            const colisionArray = checkCandyCollision(player);

            for (const candyId of colisionArray) {
                removeCandy({ candyId: candyId });
            }
            addScore({
                playerId: command.playerId,
                score: colisionArray.length,
            });
        }

        notifyAll({
            type: 'movePlayer',
            playerId: command.playerId,
            gameInput: command.gameInput,
        });
    }

    function checkCandyCollision(coordinates) {
        const collisions = [];

        for (const candyId in state.candy) {
            const candy = state.candy[candyId];

            if (coordinates.x === candy.x && coordinates.y === candy.y) {
                collisions.push(candyId);
            }
        }

        return collisions;
    }

    return {
        state,
        setState,
        addPlayer,
        removePlayer,
        configurePlayer,
        addScore,
        addCandy,
        removeCandy,
        movePlayer,
        subscribe,
    };
}
