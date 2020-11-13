export default function createInputHandler(screen) {
    const state = {
        screen: screen,
        observers: [],
    };

    const keyboardGameInputs = {
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
        const screenWidth = screen.clientWidth;
        const screenHeight = screen.clientHeight;
    }

    function keyPress(command) {
        const gameInput = keyboardGameInputs[command.keyPressed];

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
