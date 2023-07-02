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

    <div class="card-header__text">
        <h2 class="card-title">
            {title}

            {#if rollMode === 1}
                <span
                    class="roll-mode-label roll-mode-label--advantage"
                    data-tooltip="Advantage"
                    data-tooltip-direction="LEFT"
                >
                    A
                </span>
            {:else if rollMode === -1}
                <span
                    class="roll-mode-label roll-mode-label--disadvantage"
                    data-tooltip="Disadvantage"
                    data-tooltip-direction="LEFT"
                >
                    D
                </span>
            {/if}
        </h2>

        {#if subtitle}
            <h3 class="card-subtitle">
                {subtitle}
            </h3>
        {/if}

        <!-- <div class="u-flex u-flex-col">
            <button on:click={() => dispatch("repeatCard")}>
                <i class="fa-solid fa-repeat" />
            </button>

            <button>
                <i class="fa-solid fa-dice" />
            </button>
        </div> -->
    </div>
</header>

<style lang="scss">
    .card-image {
        border: 0;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 4px;
    }

    .card-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.25rem;
        padding-bottom: 0;

        &__text {
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
            width: 100%;
        }

        &--clickable {
            cursor: pointer;
        }
    }

    .card-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 0;
        font-size: 1rem;
        font-weight: bold;
        border-bottom: 0;
    }

    .card-subtitle {
        margin-bottom: 0;
        font-size: 0.833rem;
        border-bottom: 0;
        color: #7e7960;
    }

    .roll-mode-label {
        display: block;
        width: fit-content;
        padding: 0.15rem 0.4rem;
        font-size: 0.694rem;
        font-weight: 400;
        line-height: 1;
        color: white;
        border: 1px solid;
        border-radius: 3px;

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
