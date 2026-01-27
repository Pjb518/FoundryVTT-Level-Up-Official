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
        <img class="a5e-party-viewer__actor-image" src={actor?.img} alt={actor?.name} />
    {/if}

    <span class="a5e-party-viewer__actor-name">{actor?.name}</span>

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
        <span class="a5e-party-viewer__delete-wrapper">
            <button
                class="a5e-button a5e-button--delete a5e-party-viewer__delete-button icon fas fa-trash"
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
