<script lang="ts">
    const useCredits = (game.settings.get("a5e", "useCredits") as boolean) ?? false;

    let { totalPartyWealth = {}, showActorImagesInPartyViewer = true } = $props();
</script>

<footer class="wealth-footer">
    <h3 class="heading" class:heading--no-actor-image={!showActorImagesInPartyViewer}>
        Party Total
    </h3>

    {#if useCredits}
        <span class="total total--cr">
            {totalPartyWealth.cr ?? 0}
        </span>
    {:else}
        {#each ["pp", "gp", "ep", "sp", "cp"] as denomination}
            <span class="total total--{denomination}">
                {totalPartyWealth[denomination] ?? 0}
            </span>
        {/each}
    {/if}
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
        font-size: var(--a5e-text-size-sm);
        font-weight: bold;
        text-align: right;
        line-height: 1;
        font-family: var(--a5e-font-serif);

        &--no-actor-image {
            grid-area: name;
        }
    }

    .total {
        font-size: var(--a5e-text-size-sm);
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

        &--cr {
            grid-area: cr;
        }
    }
</style>
