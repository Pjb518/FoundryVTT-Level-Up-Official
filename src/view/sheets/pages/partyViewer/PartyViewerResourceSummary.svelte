<script>
    import { localize } from "#utils/localization/localize.ts";

    let { actor, propData = {} } = $props();

    function hasArtifactCharges(actor) {
        return actor?.system?.spellResources?.artifactCharges?.max;
    }

    function hasExertionPool(actor) {
        return actor?.system?.attributes.exertion?.max;
    }

    function hasSpellPoints(actor) {
        return actor?.system?.spellResources?.points?.max;
    }
    function hasSupply(actor) {
        return actor?.system?.supply;
    }

    const { spellLevels } = CONFIG.A5E;

    const actorData = $derived(actor?.system);
    const showArtifactCharges = $derived(hasArtifactCharges(actor));
    const showExertion = $derived(hasExertionPool(actor));
    const showSpellPoints = $derived(hasSpellPoints(actor));
    const showSupply = $derived(hasSupply(actor));

    const showResources = $derived(
        propData.partyHasArtifactCharges ||
            propData.partyHasExertionPool ||
            propData.partyHasInspiration ||
            propData.partyHasSpellPointPool ||
            propData.highestSpellSlotLevel ||
            propData.partyHasSupply,
    );
</script>

{#if showResources}
    {#if propData.partyHasInspiration}
        <span class="a5e-party-viewer__resources__field a5e-party-viewer__resources__value--inspiration">
            {#if actorData?.attributes.inspiration}
                <i
                    class="a5e-party-viewer__resources__check icon fa-solid fa-circle-check"
                    data-tooltip="{actor.name} has inspiration."
                    data-tooltip-direction="UP"
                ></i>
            {:else}
                <i
                    class="a5e-party-viewer__resources__cross icon fa-solid fa-xmark"
                    data-tooltip="{actor.name} does not have inspiration."
                    data-tooltip-direction="UP"
                ></i>
            {/if}
        </span>
    {/if}

    {#if propData.partyHasExertionPool}
        <span class="a5e-party-viewer__resources__field a5e-party-viewer__resources__value--exertion">
            {#if showExertion}
                {actorData?.attributes.exertion?.current} / {actorData?.attributes
                    .exertion?.max}
            {:else}
                <i
                    class="a5e-party-viewer__resources__cross icon fa-solid fa-xmark"
                    data-tooltip="{actor.name} does not have an exertion pool."
                    data-tooltip-direction="UP"
                ></i>
            {/if}
        </span>
    {/if}

    {#if propData.partyHasSupply}
        <span class="a5e-party-viewer__resources__field a5e-party-viewer__resources__value--supply">
            {#if showSupply}
                {actorData?.supply} / {actorData?.abilities.str.value}
            {:else}
                <i
                    class="a5e-party-viewer__resources__cross icon fa-solid fa-xmark"
                    data-tooltip="{actor.name} does not have any supply."
                    data-tooltip-direction="UP"
                ></i>
            {/if}
        </span>
    {/if}

    {#if propData.partyHasArtifactCharges}
        <span class="a5e-party-viewer__resources__field a5e-party-viewer__resources__value--artifactCharges">
            {#if showArtifactCharges}
                {actorData?.spellResources.artifactCharges.current} / {actorData
                    ?.spellResources.artifactCharges.max}
            {:else}
                <i
                    class="a5e-party-viewer__resources__cross icon fa-solid fa-xmark"
                    data-tooltip="{actor.name} does not have artifact charges."
                    data-tooltip-direction="UP"
                ></i>
            {/if}
        </span>
    {/if}

    {#if propData.partyHasSpellPointPool}
        <span class="a5e-party-viewer__resources__field a5e-party-viewer__resources__value--spellPoints">
            {#if showSpellPoints}
                {actorData?.spellResources.points.current} / {actorData?.spellResources
                    .points.max}
            {:else}
                <i
                    class="a5e-party-viewer__resources__cross icon fa-solid fa-xmark"
                    data-tooltip="{actor.name} does not have a spell point pool."
                    data-tooltip-direction="UP"
                ></i>
            {/if}
        </span>
    {/if}

    {#if propData.highestSpellSlotLevel}
        <ol class="a5e-party-viewer__resources__spell-slots">
            {#each Object.entries(actorData?.spellResources.slots ?? {}) as [level, { current, max }]}
                {#if level && level !== "0" && level <= propData.highestSpellSlotLevel}
                    <li
                        class="a5e-party-viewer__resources__field a5e-party-viewer__resources__value--spell-slot"
                        class:field--narrow-spell-slot={propData.highestSpellSlotLevel >=
                            8}
                    >
                        {#if max && max > 0}
                            {current}
                        {:else}
                            <i
                                class="a5e-party-viewer__resources__cross icon fa-solid fa-xmark"
                                data-tooltip="{actor.name} has no spell slots of {localize(
                                    spellLevels[level],
                                ).toLowerCase()}."
                                data-tooltip-direction="UP"
                            ></i>
                        {/if}
                    </li>
                {/if}
            {/each}
        </ol>
    {/if}
{:else}
    <span class="a5e-party-viewer__resources__field a5e-party-viewer__resources__value--no-resources">No resources to display</span>
{/if}
