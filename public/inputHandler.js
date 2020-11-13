export default function createInputHandler(gameWindow) {
    const state = {
        screen: gameWindow,
        observers: [],
    };

    const keyboardToGameInputs = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
    };

    function subscribe(observerFunction) {
        state.observers.push(observerFunction);
    }

    function notifyAll(command) {
        for (const observerFunction of state.observers) {
            observerFunction(command);
        }
    }

    function click(command) {
        let clickAt = '';

        const gameWidth = gameWindow.clientWidth;
        const gameHeight = gameWindow.clientHeight;

        const upRight = command.x / gameWidth - command.y / gameHeight > 0;
        const downRight = command.x / gameWidth + command.y / gameHeight > 1;

        switch (upRight) {
            case true: {
                switch (downRight) {
                    case true:
                        clickAt = 'right';
                        break;
                    case false:
                        clickAt = 'up';
                        break;
                }
                break;
            }
            case false: {
                switch (downRight) {
                    case true:
                        clickAt = 'down';
                        break;
                    case false:
                        clickAt = 'left';
                        break;
                }
                break;
            }
        }

        if (clickAt) {
            console.log(`Click at ${clickAt}`);
            notifyAll({ gameInput: clickAt });
        }
    }

    function keyPress(command) {
        const gameInput = keyboardToGameInputs[command.keyPressed];

        if (gameInput) {
            notifyAll({ gameInput: gameInput });
        }
    }

    return {
        click,
        keyPress,
        subscribe,
    };
}
