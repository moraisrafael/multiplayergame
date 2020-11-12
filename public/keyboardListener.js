export default function createKeyboardListener() {
    const state = {
        observers: []
    };

    function subscribe(observerFunction) {
        state.observers.push(observerFunction);
    }

    function notifyAll(command) {
        console.log(`Notifying ${state.observers.length} keyboardListener observers`);

        for (const observerFunction of state.observers) {
            observerFunction(command);
        }
    }

    function handleKeydown(event) {
        const keyPressed = event.key;
        const command = {
            keyPressed: keyPressed
        }

        notifyAll(command);
    }

    document.addEventListener('keydown', handleKeydown);

    return {
        subscribe
    }
}