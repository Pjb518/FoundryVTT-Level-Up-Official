<script>
    import { createEventDispatcher } from "svelte";

    export let altText;
    export let clickableHeader;
    export let img;
    export let title;
    export let subtitle = null;

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

    <div class="card-title-wrapper">
        <h2 class="card-title">{title}</h2>

        {#if subtitle}
            <h3 class="card-subtitle">{subtitle}</h3>
        {/if}
    </div>

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
        display: flex;
        gap: 0.5rem;
        align-items: center;
        padding-block: 0.25rem var(--bottom-padding, 0.5rem);

        &--clickable {
            cursor: pointer;
        }
    }

    .card-subtitle {
        font-size: 0.833rem;
        color: #7e7960;
        grid-area: subtitle;
    }

    .card-subtitle,
    .card-title {
        margin-bottom: 0;
        border-bottom: 0;
    }

    .card-title {
        font-size: 1rem;
        font-weight: bold;
        grid-area: title;
    }

    .card-title-wrapper {
        display: flex;
        flex-direction: column;
    }
</style>
