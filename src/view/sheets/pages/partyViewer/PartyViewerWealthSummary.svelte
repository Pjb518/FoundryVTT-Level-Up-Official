<script lang="ts">
    let { actor, propData = {} } = $props();

    const actorData = $derived(actor?.system ?? {});

    const useCredits = (game.settings.get("a5e", "useCredits") as boolean) ?? false;
</script>

{#if useCredits}
    <span class="a5e-party-viewer__wealth__field a5e-party-viewer__wealth__value--cr">
        {actorData?.currency ? actorData?.currency.cr : 0}
    </span>
{:else}
    {#each ["pp", "gp", "ep", "sp", "cp"] as denomination}
        <span
            class="a5e-party-viewer__wealth__field a5e-party-viewer__wealth__value--{denomination}"
        >
            {actorData?.currency ? actorData?.currency[denomination] : 0}
        </span>
    {/each}
{/if}
