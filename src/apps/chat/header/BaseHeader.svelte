<script>
    import { createEventDispatcher } from "svelte";

    export let altText;
    export let img;
    export let subtitle = null;
    export let title;

    const dispatch = createEventDispatcher();
</script>

<header class="card-header">
    <img class="card-image" src={img} alt={altText} />

    <div>
        <div>
            <div class="u-flex u-align-center">
                <h2 class="card-title">{title}</h2>
            </div>

            {#if subtitle}
                <h3 class="card-subtitle">
                    {subtitle}
                </h3>
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
    </div>
</header>

<style>
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
        padding: 0.25rem;
        padding-bottom: 0;
    }

    .card-title {
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
</style>
