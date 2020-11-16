export default function createClickListener(element) {
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

    function handleClick(event) {
        const x = event.offsetX;
        const y = event.offsetY;

        const command = {
            x: x,
            y: y,
        };

        notifyAll(command);
    }

    element.addEventListener('click', handleClick);

    return {
        subscribe,
    };
}
