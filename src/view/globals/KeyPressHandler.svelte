<script lang="ts">
    import { pressedKeys } from "#stores/pressedKeysStore.svelte.ts";

    function logKey(
        event: KeyboardEvent & {
            currentTarget: EventTarget & Window;
        },
    ) {
        pressedKeys.Alt = event.altKey;
        pressedKeys.Control = event.metaKey || event.ctrlKey;
        pressedKeys.Shift = event.shiftKey;
    }

    function resetKeys() {
        Object.keys(pressedKeys).forEach((key) => (pressedKeys[key] = false));
    }
</script>

<svelte:window
    onkeydowncapture={(event) => logKey(event)}
    onkeyupcapture={(event) => logKey(event)}
    onblur={() => resetKeys()}
/>
