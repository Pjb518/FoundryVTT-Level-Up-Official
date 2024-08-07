<script>
    import { localize } from "#runtime/svelte/helper";

    export let actor;
    export let propData = {};

    function hasArtifactCharges(actor) {
        return actor?.system?.spellResources?.artifactCharges?.max;
    }

    function hasExertionPool(actor) {
        return actor?.system?.attributes.exertion?.max;
    }

    function hasSpellPoints(actor) {
        return actor?.system?.spellResources?.points?.max;
    }

    const { spellLevels } = CONFIG.A5E;

    $: actorData = $actor?.system;
    $: showArtifactCharges = hasArtifactCharges($actor);
    $: showExertion = hasExertionPool($actor);
    $: showSpellPoints = hasSpellPoints($actor);

    $: showResources =
        propData.partyHasArtifactCharges ||
        propData.partyHasExertionPool ||
        propData.partyHasInspiration ||
        propData.partyHasSpellPointPool ||
        propData.highestSpellSlotLevel;
</script>

{#if showResources}
    {#if propData.partyHasInspiration}
        <span class="field field--inspiration">
            {#if actorData?.attributes.inspiration}
                <i
                    class="check fa-solid fa-circle-check"
                    data-tooltip="{$actor.name} has inspiration."
                    data-tooltip-direction="UP"
                />
            {:else}
                <i
                    class="cross fa-solid fa-xmark"
                    data-tooltip="{$actor.name} does not have inspiration."
                    data-tooltip-direction="UP"
                />
            {/if}
        </span>
    {/if}

    {#if propData.partyHasExertionPool}
        <span class="field field--exertion">
            {#if showExertion}
                {actorData?.attributes.exertion?.current} / {actorData?.attributes
                    .exertion?.max}
            {:else}
                <i
                    class="cross fa-solid fa-xmark"
                    data-tooltip="{$actor.name} does not have an exertion pool."
                    data-tooltip-direction="UP"
                />
            {/if}
        </span>
    {/if}

    {#if propData.partyHasArtifactCharges}
        <span class="field field--artifact-charges">
            {#if showArtifactCharges}
                {actorData?.spellResources.artifactCharges.current} / {actorData
                    ?.spellResources.artifactCharges.max}
            {:else}
                <i
                    class="cross fa-solid fa-xmark"
                    data-tooltip="{$actor.name} does not have artifact charges."
                    data-tooltip-direction="UP"
                />
            {/if}
        </span>
    {/if}

    {#if propData.partyHasSpellPointPool}
        <span class="field field--spell-points">
            {#if showSpellPoints}
                {actorData?.spellResources.points.current} / {actorData?.spellResources
                    .points.max}
            {:else}
                <i
                    class="cross fa-solid fa-xmark"
                    data-tooltip="{$actor.name} does not have a spell point pool."
                    data-tooltip-direction="UP"
                />
            {/if}
        </span>
    {/if}

    {#if propData.highestSpellSlotLevel}
        <ol class="spell-slots">
            {#each Object.entries(actorData?.spellResources.slots ?? {}) as [level, { current, max }]}
                {#if level && level !== "0" && level <= propData.highestSpellSlotLevel}
                    <li
                        class="field field--spell-slot"
                        class:field--narrow-spell-slot={propData.highestSpellSlotLevel >=
                            8}
                    >
                        {#if max && max > 0}
                            {current}
                        {:else}
                            <i
                                class="cross fa-solid fa-xmark"
                                data-tooltip="{$actor.name} has no spell slots of {localize(
                                    spellLevels[level],
                                ).toLowerCase()}."
                                data-tooltip-direction="UP"
                            />
                        {/if}
                    </li>
                {/if}
            {/each}
        </ol>
    {/if}
{:else}
    <span class="field field--no-resources">No resources to display</span>
{/if}

<style lang="scss">
    .check {
        color: var(--a5e-color-primary);
    }

    .cross {
        color: var(--a5e-color-disabled);
    }

    .field {
        text-align: center;
        margin-inline: 0.25rem;

        &--artifact-charges {
            grid-area: artifactCharges;
        }

        &--exertion {
            grid-area: exertion;
        }

        &--inspiration {
            grid-area: inspiration;
        }

        &--no-resources {
            white-space: nowrap;
            text-align: left;
            grid-area: noResources;
        }

        &--spell-points {
            grid-area: spellPoints;
        }

        &--spell-slot {
            width: 1.75rem;
            margin: 0;
        }

        &--narrow-spell-slot {
            width: 1.5rem;
        }
    }

    .spell-slots {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        // min-width: 7.5rem;
        padding: 0;
        margin: 0;
        list-style: none;
    }
</style>
