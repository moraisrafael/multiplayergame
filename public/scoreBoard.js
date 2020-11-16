export default function createScoreBoard(command) {
    const scoreBoard = command.scoreBoard;
    const game = command.game;

    function updateScoreBoard() {
        let scoreBoardInnerHTML = '';
        const players = [];

        for (const playerId in game.state.players) {
            const player = game.state.players[playerId];
            players.push({
                playerName: player.playerName,
                score: player.score,
            });
        }

        players.sort((playerA, playerB) => {
            return playerB.score - playerA.score;
        });

        for (let i = 0; i < 10 && i < players.length; i++) {
            const player = players[i];
            scoreBoardInnerHTML +=
                `<div><span class="">${player.playerName}</span>&nbsp&nbsp` +
                `<span class="playerScore">${player.score}</span></div>`;
        }

        scoreBoard.innerHTML = scoreBoardInnerHTML;
    }

    game.subscribe(() => {
        updateScoreBoard();
    });

    updateScoreBoard();
}
