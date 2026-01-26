<script>
    import PartyViewerAttributesSummary from "./PartyViewerAttributesSummary.svelte";
    import PartyViewerCoreSummary from "./PartyViewerCoreSummary.svelte";
    import PartyViewerLanguagesSummary from "./PartyViewerLanguagesSummary.svelte";
    import PartyViewerResourceSummary from "./PartyViewerResourceSummary.svelte";
    import PartyViewerSkillsSummary from "./PartyViewerSkillsSummary.svelte";
    import PartyViewerWealthSummary from "./PartyViewerWealthSummary.svelte";

    let {
        actor,
        currentViewMode = "core",
        highestPassiveScores = {},
        highestSpellSlotLevel = 0,
        partyHasArtifactCharges = true,
        partyHasExertionPool = true,
        partyHasInspiration = false,
        partyHasSpellPointPool = true,
        partyHasSupply = false,
        partyIsLocked = false,
        showActorImagesInPartyViewer = true,
        onActorUpdated,
        onRemoveActor,
    } = $props();

    const actorId = actor.uuid;
    const { isGM } = game.user;
</script>

<li class="a5e-item a5e-item--party-member" ondblclick={() => actor?.sheet.render(true)}>
    {#if showActorImagesInPartyViewer}
        <img class="actor-image" src={actor?.img} alt={actor?.name} />
    {/if}

    <span class="actor-name">{actor?.name}</span>

    {#if currentViewMode === "attributes"}
        <PartyViewerAttributesSummary {actor} />
    {:else if currentViewMode === "core"}
        <PartyViewerCoreSummary
            {actor}
            propData={{
                highestPassiveScores,
                highestSpellSlotLevel,
                partyHasArtifactCharges,
                partyHasExertionPool,
                partyHasInspiration,
                partyHasSpellPointPool,
                partyHasSupply,
            }}
        />
    {:else if currentViewMode === "languages"}
        <PartyViewerLanguagesSummary {actor} />
    {:else if currentViewMode === "resources"}
        <PartyViewerResourceSummary
            {actor}
            propData={{
                highestPassiveScores,
                highestSpellSlotLevel,
                partyHasArtifactCharges,
                partyHasExertionPool,
                partyHasInspiration,
                partyHasSpellPointPool,
                partyHasSupply,
            }}
        />
    {:else if currentViewMode === "skills"}
        <PartyViewerSkillsSummary {actor} />
    {:else if currentViewMode === "wealth"}
        <PartyViewerWealthSummary {actor} />
    {/if}

    {#if isGM && !partyIsLocked}
        <span class="delete-wrapper">
            <button
                class="a5e-button a5e-button--delete delete-button icon fas fa-trash"
                data-tooltip="Remove Actor from the Party"
                data-tooltip-direction="UP"
                aria-labelledby="Remove Actor from the Party"
                onclick={() => {
                    if (onRemoveActor) {
                        onRemoveActor(actor.uuid);
                    }
                }}
            ></button>
        </span>
    {/if}
</li>

<style lang="scss">
    .actor-image {
        height: 1.75rem;
        width: 1.75rem;
        margin: 0;
        padding: 0;
        object-fit: cover;
        object-position: 50% 0;
        grid-area: img;
    }

    .actor-name {
        grid-area: name;
        padding-left: 0.25rem;
        text-overflow: ellipsis;
    }

    .delete-button {
        padding: 0.25rem;
        grid-area: delete;
    }

    .delete-wrapper {
        text-align: center;
    }
</style>
