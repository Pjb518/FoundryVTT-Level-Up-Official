<script>
    import { createEventDispatcher } from "svelte";

    import pressedKeysStore from "../../../stores/pressedKeysStore";

    export let title;
    export let subtitle = null;

    const dispatch = createEventDispatcher();
</script>

<div class="save-prompt">
    <button
        class="roll-button"
        class:roll-button--shift={$pressedKeysStore.Shift}
        class:roll-button--ctrl={$pressedKeysStore.Control}
        on:click={() => dispatch("triggerPrompt")}
    >
        <i class="die fa-solid fa-dice-d20" />
    </button>

    <header class="title-wrapper">
        <span class="title">{title}</span>

        {#if subtitle}
            <span class="subtitle">{subtitle}</span>
        {/if}
    </header>
</div>

<style lang="scss">
    .die {
        display: block;
        font-size: 2rem;
        padding: 0;
        margin: 0;
        border: 0;
    }

    .roll-button {
        width: 2.5rem;
        height: 2.5rem;
        padding: 0;
        margin: 0;
        background: transparent;
        border: 0;
        color: #7e7960;
        grid-area: icon;
        transition: all 0.15s ease-in-out;
        box-shadow: none;

        transition: 0.15s all ease-in-out;

        &:hover {
            color: #555;
        }

        &--shift:hover {
            color: #2b6537;
        }

        &--ctrl:hover {
            color: #8b2525;
        }
    }

    .save-prompt {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .subtitle {
        width: 100%;
        font-size: 0.694rem;
        color: #7e7960;
    }

    .title {
        font-size: 0.833rem;
        font-weight: bold;
    }

    .title-wrapper {
        display: flex;
        flex-direction: column;
    }
</style>
