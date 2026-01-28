<script lang="ts">
    const useCredits = (game.settings.get("a5e", "useCredits") as boolean) ?? false;
</script>

<header class="a5e-section-header a5e-section-header--party-viewer">
    {#if useCredits}
        <h3
            class="a5e-party-viewer__wealth__header a5e-party-viewer__wealth__value--cr"
            data-tooltip="A5E.effects.keys.currency.cr"
            data-tooltip-direction="UP"
        >
            CR
        </h3>
    {:else}
        {#each ["pp", "gp", "ep", "sp", "cp"] as denomination}
            <h3
                class="a5e-party-viewer__wealth__header a5e-party-viewer__wealth__value--{denomination}"
                data-tooltip="A5E.effects.keys.currency.{denomination}"
                data-tooltip-direction="UP"
            >
                {denomination}
            </h3>
        {/each}
    {/if}
</header>
