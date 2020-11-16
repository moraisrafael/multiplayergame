export default function createKeyboardListener() {
    const state = {
        observers: [],
    };

    function subscribe(observerFunction) {
        state.observers.push(observerFunction);
    }

    function notifyAll(command) {
        for (const observerFunction of state.observers) {
            observerFunction(command);
        }
    }

    function handleKeydown(event) {
        const keyPressed = event.key;
        const command = {
            keyPressed: keyPressed,
        };

        notifyAll(command);
    }

    document.addEventListener('keydown', handleKeydown);

    return {
        subscribe,
    };
}
