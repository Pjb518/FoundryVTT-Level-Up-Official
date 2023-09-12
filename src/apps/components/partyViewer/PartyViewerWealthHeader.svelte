<header class="wealth-header">
    {#each ["pp", "gp", "ep", "sp", "cp"] as denomination}
        <h3
            class="heading heading--{denomination}"
            data-tooltip="A5E.effects.keys.currency.{denomination}"
            data-tooltip-direction="UP"
        >
            {denomination}
        </h3>
    {/each}
</header>

<style lang="scss">
    .wealth-header {
        display: grid;
        grid-template-areas: var(--grid-areas);
        grid-template-columns: var(--grid-template);
        gap: 0.5rem;
        min-height: 1.75rem;
        padding: 0.375rem 0.125rem;
        border-bottom: 1px solid #ccc;
        border-top: 1px solid #ccc;
    }

    .heading {
        font-size: 0.833rem;
        line-height: 1;
        text-align: center;
        font-weight: bold;
        text-transform: uppercase;

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
