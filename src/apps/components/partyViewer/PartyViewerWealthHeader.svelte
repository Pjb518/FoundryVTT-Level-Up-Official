<header class="a5e-section-header a5e-section-header--party-viewer">
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
    .heading {
        font-size: 0.833rem;
        line-height: 1;
        text-align: center;
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
