<script>
    export let actor;

    $: actorData = $actor?.system ?? {};
</script>

{#each Object.entries(actorData?.currency) as [denomination, quantity]}
    <span class="field field--{denomination}">
        {quantity}
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
