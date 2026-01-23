<script lang="ts">
    let { actor, propData = {} } = $props();

    const actorData = $derived(actor?.system ?? {});

    const useCredits = (game.settings.get("a5e", "useCredits") as boolean) ?? false;
</script>

{#if useCredits}
    <span class="field field--cr">
        {actorData?.currency ? actorData?.currency.cr : 0}
    </span>
{:else}
    {#each ["pp", "gp", "ep", "sp", "cp"] as denomination}
        <span class="field field--{denomination}">
            {actorData?.currency ? actorData?.currency[denomination] : 0}
        </span>
    {/each}
{/if}

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

        &--cr {
            grid-area: cr;
        }
    }
</style>
