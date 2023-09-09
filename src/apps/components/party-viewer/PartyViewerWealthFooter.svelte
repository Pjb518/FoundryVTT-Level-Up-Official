<script>
    export let totalPartyWealth = {};
</script>

<footer class="wealth-footer">
    <h3 class="heading">Party Total</h3>

    {#each ["cp", "sp", "ep", "gp", "pp"] as denomination}
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
        gap: 0.5rem;
        padding: 0.375rem 0.125rem;
        border-bottom: 1px solid #ccc;
        border-top: 1px solid #ccc;
    }

    .heading {
        grid-column-start: img;
        grid-column-end: name;
        padding-right: 0.75rem;
        font-size: 0.833rem;
        font-weight: bold;
        text-align: right;
        line-height: 1;
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
