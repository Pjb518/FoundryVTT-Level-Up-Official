<script>
    import { onDestroy } from "svelte";

    import keyBindingStore from "../stores/pressedKeysStore";

    let pressedKeys;

    const unsubscribe = keyBindingStore.subscribe(
        (value) => (pressedKeys = value)
    );

    function logKey(event) {
        pressedKeys["Alt"] = event.altKey;
        pressedKeys["Control"] = event.metaKey || event.ctrlKey;
        pressedKeys["Shift"] = event.shiftKey;

        keyBindingStore.update(() => ({ ...pressedKeys }));
    }

    function resetKeys() {
        Object.keys(pressedKeys).forEach((key) => (pressedKeys[key] = false));
        keyBindingStore.update(() => ({ ...pressedKeys }));
    }

    onDestroy(unsubscribe);
</script>

<svelte:window
    on:keydown={(event) => logKey(event, true)}
    on:keyup={(event) => logKey(event, false)}
    on:blur={() => resetKeys()}
/>
