<script>
    import { onMount, onDestroy } from "svelte";

    import keyBindingStore from "../stores/pressedKeysStore";

    let pressedKeys;

    const unsubscribe = keyBindingStore.subscribe(
        (value) => (pressedKeys = value)
    );

    function logKey(event, isPressed) {
        if (!["AltLeft", "ControlLeft", "ShiftLeft"].includes(event.code))
            return;

        pressedKeys[event.code] = isPressed;

        keyBindingStore.update(() => ({ ...pressedKeys }));
    }

    function resetKeys() {
        Object.keys(pressedKeys).forEach((key) => (pressedKeys[key] = false));
        keyBindingStore.update(() => ({ ...pressedKeys }));
    }

    onMount(() => {
        document.onvisibilitychange = () => resetKeys();
    });

    onDestroy(unsubscribe);
</script>

<svelte:window
    on:keydown={(event) => logKey(event, true)}
    on:keyup={(event) => logKey(event, false)}
/>
