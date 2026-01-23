<script lang="ts">
    const useCredits = (game.settings.get("a5e", "useCredits") as boolean) ?? false;
</script>

<header class="a5e-section-header a5e-section-header--party-viewer">
    {#if useCredits}
        <h3
            class="heading heading--cr"
            data-tooltip="A5E.effects.keys.currency.cr"
            data-tooltip-direction="UP"
        >
            CR
        </h3>
    {:else}
        {#each ["pp", "gp", "ep", "sp", "cp"] as denomination}
            <h3
                class="heading heading--{denomination}"
                data-tooltip="A5E.effects.keys.currency.{denomination}"
                data-tooltip-direction="UP"
            >
                {denomination}
            </h3>
        {/each}
    {/if}
</header>

<style lang="scss">
    .heading {
        font-size: var(--a5e-text-size-sm);
        line-height: 1;
        text-align: center;
        text-transform: uppercase;
        color: inherit;

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

        &--cr {
            grid-area: cr;
        }
    }
</style>
