<script>
    import { getContext } from "svelte";

    import toggleSheetLockedState from "../../handlers/toggleSheetLockedState";

    export let sheetIsLocked;

    const actor = getContext("actor");

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<button
    class="sheet-lock fas {sheetIsLocked ? 'fa-lock' : 'fa-unlock'}"
    on:click={({ target }) => {
        toggleSheetLockedState($actor);
        target.blur();
    }}
/>

<style lang="scss">
    .sheet-lock {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        width: fit-content;
        padding: 0 0.125rem;
        margin-left: auto;
        font-size: 1rem;
        color: inherit;
        opacity: 0.85;
        background: transparent;
        cursor: pointer;

        // Nudge the button down 1px so that it _looks_ centred
        top: 1px;

        transition: all 0.15s ease-in-out;

        &:focus,
        &:hover {
            transform: scale(1.1);
            box-shadow: none;
        }
    }
</style>
