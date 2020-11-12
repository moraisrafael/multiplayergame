const backgroundColor = 'white';
const CurrentPlayerColor = 'green';
const playerColor = 'gray';
const candyColor = 'blue';

export default function renderScreen(screen, game, currentPlayerId) {

    const context = screen.getContext('2d');

    context.fillStyle = backgroundColor;
    context.clearRect(0, 0, 10, 10);

    for (const playerId in game.state.players) {
        if (playerId != currentPlayerId) {
            context.fillStyle = playerColor;
        }
        else {
            context.fillStyle = CurrentPlayerColor;
        }
        const player = game.state.players[playerId];
        context.fillRect(player.x, player.y, 1, 1);
    }

    context.fillStyle = candyColor;
    for (const candyId in game.state.candy) {
        const candy = game.state.candy[candyId];
        context.fillRect(candy.x, candy.y, 1, 1);
    }

    requestAnimationFrame(() => renderScreen(screen, game, currentPlayerId));
}