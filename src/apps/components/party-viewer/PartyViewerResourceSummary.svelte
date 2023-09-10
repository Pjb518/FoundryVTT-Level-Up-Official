<script>
    export let actor;
    export let propData = {};

    $: actorData = $actor?.system;
</script>

<span class="field field--exertion">
    {#if actorData?.attributes.exertion}
        {actorData?.attributes.exertion?.current} / {actorData?.attributes
            .exertion?.max}
    {:else}
        N/A
    {/if}
</span>

<span class="field field--spell-points">
    {actorData?.spellResources.points.current} / {actorData?.spellResources
        .points.max}
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
