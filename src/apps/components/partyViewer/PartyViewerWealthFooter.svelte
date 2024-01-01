<script>
    export let totalPartyWealth = {};
    export let showActorImagesInPartyViewer = true;
</script>

<footer class="wealth-footer">
    <h3
        class="heading"
        class:heading--no-actor-image={!$showActorImagesInPartyViewer}
    >
        Party Total
    </h3>

    {#each ["pp", "gp", "ep", "sp", "cp"] as denomination}
        <span class="total total--{denomination}">
            {totalPartyWealth[denomination] ?? 0}
        </span>
    {/each}
</footer>

<style lang="scss">
    .wealth-footer {
        display: grid;
        grid-template-areas: var(--grid-areas);
        grid-template-columns: var(--grid-template);
        align-items: center;
        gap: 0.5rem;
        height: 2rem;
        padding: 0 0.125rem;
        border: solid transparent;
        border-width: 0 0 1px;
        border-image: linear-gradient(
                90deg,
                var(--item-border-color-start, transparent) 0%,
                var(--item-border-color-end, #d5cac1) 55%
            )
            1 repeat;
        border-radius: 0;
    }

    .heading {
        grid-column-start: img;
        grid-column-end: name;
        padding-right: 0.75rem;
        font-size: 0.833rem;
        font-weight: bold;
        text-align: right;
        line-height: 1;
        font-family: var(--a5e-font-serif);

        &--no-actor-image {
            grid-area: name;
        }
    }

    .total {
        font-size: 0.833rem;
        line-height: 1;
        text-align: center;

        &--cp {
            grid-area: cp;
        }

        &--sp {
            grid-area: sp;
        }

        &--ep {
            grid-area: ep;
        }

        &--gp {
            grid-area: gp;
        }

        &--pp {
            grid-area: pp;
        }
    }
</style>
