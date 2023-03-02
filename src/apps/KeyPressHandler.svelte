<script>
    import { onDestroy } from "svelte";

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

    onDestroy(unsubscribe);
</script>

<svelte:window
    on:keydown={(event) => logKey(event, true)}
    on:keyup={(event) => logKey(event, false)}
    on:blur={(event) => logKey(event, false)}
/>
