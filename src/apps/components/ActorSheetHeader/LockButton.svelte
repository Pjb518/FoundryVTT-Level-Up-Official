<script>
    import { getContext } from "svelte";

    import toggleSheetLockedState from "../../handlers/toggleSheetLockedState";

    export let sheetIsLocked;

    const actor = getContext("actor");

    $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<i
    class="sheet-lock fas {sheetIsLocked
        ? 'fa-lock sheet-lock-locked'
        : 'fa-unlock sheet-lock-unlocked'}"
    on:click={() => toggleSheetLockedState($actor)}
/>

<style lang="scss">
    .sheet-lock {
        display: flex;
        align-items: center;
        font-size: 1.728rem;
        cursor: pointer;

        transition: all 0.15s ease-in-out;

        &:hover {
            transform: scale(1.1);
        }

        &-locked {
            color: #8b2525;
        }

        &-unlocked {
            color: #0b5a2f;
        }
    }
</style>
