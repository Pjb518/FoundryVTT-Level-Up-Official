<script>
    import { createEventDispatcher } from "svelte";

    export let icon = null;
    export let prompt;
    export let title;
    export let subtitle = null;

    const dispatch = createEventDispatcher();
</script>

<button class="save-prompt" on:click={() => dispatch("triggerPrompt")}>
    <div class="icon-wrapper" class:icon-wrapper--effect={prompt.type === "effect"}>
        {#if prompt.type === "effect"}
            <img class="effect-icon" src={icon} alt="title" />
        {:else}
            <i
                class="die fa-solid fa-dice-d20"
                class:die--generic-prompt={prompt.type === "generic"}
            />
        {/if}
    </div>

    <header class="title-wrapper">
        <span class="title">{title}</span>

        {#if subtitle}
            <span class="subtitle">{subtitle}</span>
        {/if}
    </header>
</button>

<style lang="scss">
    .die {
        display: block;
        font-size: 2rem;
        padding: 0;
        margin: 0;
        color: var(--a5e-color-text-medium);
        border: 0;
        transition: var(--a5e-transition-standard);
    }

    .icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 2.5rem;
        height: 2.5rem;

        &--effect {
            padding: 0.25rem;
            border-radius: 4px;
        }
    }

    .effect-icon {
        width: 2rem;
        height: 2rem;
        object-fit: cover;
        object-position: top;
        border-radius: var(--a5e-border-radius-standard);
    }

    .save-prompt {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0;
        padding: 0;
        background: transparent;
        border: 0;
        box-shadow: none;

        &:hover .die {
            color: var(--hover-color, var(--a5e-color-text-dark));
        }

        &:hover .die--generic-prompt {
            color: var(--a5e-color-text-dark);
        }
    }

    .subtitle {
        width: 100%;
        font-size: var(--a5e-text-size-xs);
        line-height: 1;
        color: var(--a5e-color-text-medium);
    }

    .title {
        font-size: var(--a5e-text-size-sm);
        line-height: 1;
        font-weight: bold;
    }

    .title-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
        text-align: left;
    }
</style>
