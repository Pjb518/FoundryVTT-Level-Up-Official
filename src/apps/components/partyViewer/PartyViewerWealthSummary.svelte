<script>
    export let actor;
    export let propData = {};

    $: actorData = $actor?.system ?? {};
</script>

{#each ["pp", "gp", "ep", "sp", "cp"] as denomination}
    <span class="field field--{denomination}">
        {actorData?.currency ? actorData?.currency[denomination] : 0}
    </span>
{/each}

<style lang="scss">
    .field {
        text-align: center;
        margin-inline: 0.25rem;

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
