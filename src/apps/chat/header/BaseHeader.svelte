<script>
    import { createEventDispatcher } from "svelte";

    export let altText;
    export let clickableHeader;
    export let img;
    export let rollMode = 0;
    export let subtitle = null;
    export let title;

    const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<header
    class="card-header"
    class:card-header--clickable={clickableHeader}
    role="button"
    tabindex="0"
    on:click={() => dispatch("toggleDescription")}
>
    <img class="card-image" src={img} alt={altText} />

    <h2 class="card-title">{title}</h2>

    {#if rollMode === 1}
        <span
            class="roll-mode-label roll-mode-label--advantage"
            data-tooltip="Advantage"
            data-tooltip-direction="LEFT"
        >
            Adv
        </span>
    {:else if rollMode === -1}
        <span
            class="roll-mode-label roll-mode-label--disadvantage"
            data-tooltip="Disadvantage"
            data-tooltip-direction="LEFT"
        >
            Dis
        </span>
    {/if}

    {#if subtitle}
        <h3 class="card-subtitle">{subtitle}</h3>
    {/if}

    <!-- <div class="u-flex u-flex-col">
            <button on:click={() => dispatch("repeatCard")}>
                <i class="fa-solid fa-repeat" />
            </button>

            <button>
                <i class="fa-solid fa-dice" />
            </button>
        </div> -->
</header>

<style lang="scss">
    .card-image {
        border: 0;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 4px;
        grid-area: image;
    }

    .card-header {
        display: grid;
        grid-template-areas:
            "image title flag"
            "image subtitle subtitle";
        grid-template-columns: 2.5rem 1fr max-content;
        grid-template-rows: 1fr max-content;
        gap: 0.125rem 0.5rem;
        align-items: center;
        padding-top: 0.25rem;

        &--clickable {
            cursor: pointer;
        }
    }

    .card-title,
    .card-subtitle {
        margin-bottom: 0;
        border-bottom: 0;
    }

    .card-title {
        font-size: 1rem;
        font-weight: bold;
        grid-area: title;
    }

    .card-subtitle {
        font-size: 0.833rem;
        color: #7e7960;
        grid-area: subtitle;
    }

    .roll-mode-label {
        padding: 0.15rem 0.4rem;
        font-size: 0.694rem;
        line-height: 1;
        color: white;
        border: 1px solid;
        border-radius: 3px;
        grid-area: flag;

        &--advantage {
            border-color: #425f65;
            background: #425f65;
        }

        &--disadvantage {
            border-color: #772020;
            background: #8b2525;
        }
    }
</style>
