<script lang="ts">
    const useCredits = (game.settings.get("a5e", "useCredits") as boolean) ?? false;

    let { totalPartyWealth = {}, showActorImagesInPartyViewer = true } = $props();
</script>

<footer class="a5e-party-viewer__wealth__footer">
    <h3
        class="a5e-party-viewer__wealth__footer__header"
        class:a5e-party-viewer__wealth__footer__header--no-actor-image={!showActorImagesInPartyViewer}
    >
        Party Total
    </h3>

    {#if useCredits}
        <span
            class="a5e-party-viewer__wealth__footer__total a5e-party-viewer__wealth__value--cr"
        >
            {totalPartyWealth.cr ?? 0}
        </span>
    {:else}
        {#each ["pp", "gp", "ep", "sp", "cp"] as denomination}
            <span
                class="a5e-party-viewer__wealth__footer__total a5e-party-viewer__wealth__value--{denomination}"
            >
                {totalPartyWealth[denomination] ?? 0}
            </span>
        {/each}
    {/if}
</footer>
