<script>
    export let actor;
    export let propData = {};

    function hasExertionPool(actor) {
        return actor?.system?.attributes.exertion?.max;
    }

    function hasSpellPoints(actor) {
        if (!actor?.flags?.a5e?.showSpellPoints) return false;
        if (!actor?.system?.spellResources?.points?.max) return false;

        return true;
    }

    $: actorData = $actor?.system;
    $: showExertion = hasExertionPool($actor);
    $: showSpellPoints = hasSpellPoints($actor);
</script>

<span class="field field--exertion">
    {#if showExertion}
        {actorData?.attributes.exertion?.current} / {actorData?.attributes
            .exertion?.max}
    {:else}
        N/A
    {/if}
</span>

<span class="field field--spell-points">
    {#if showSpellPoints}
        {actorData?.spellResources.points.current} / {actorData?.spellResources
            .points.max}
    {:else}
        N/A
    {/if}
</span>

<ol class="spell-slots">
    {#each Object.entries(actorData?.spellResources.slots ?? {}) as [level, { current }]}
        {#if level && level !== "0"}
            <li class="field field--spell-slot">
                {current}
            </li>
        {/if}
    {/each}
</ol>

<style lang="scss">
    .field {
        text-align: center;
        margin-inline: 0.25rem;

        &--exertion {
            grid-area: exertion;
        }

        &--spell-points {
            grid-area: spellPoints;
        }

        &--spell-slot {
            width: 1.75rem;
            margin: 0;
        }
    }

    .spell-slots {
        display: flex;
        gap: 0.5rem;
        padding: 0;
        margin: 0;
        list-style: none;
    }
</style>
