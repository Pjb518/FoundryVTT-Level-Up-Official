<script>
    import { createEventDispatcher } from "svelte";

    export let promptType;
    export let title;
    export let subtitle = null;

    const dispatch = createEventDispatcher();
</script>

<div class="save-prompt">
    <button
        class={promptType === "effect" ? "effect-button" : "roll-button"}
        on:click={() => dispatch("triggerPrompt")}
    >
        {#if promptType === "effect"}
            <i class="die fa-solid fa-circle-down" />
        {:else}
            <i class="die fa-solid fa-dice-d20" />
        {/if}
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

    .effect-button,
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
    }

    .roll-button:hover {
        color: var(--hover-color, #555);
    }

    .effect-button:hover {
        color: #555;
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
