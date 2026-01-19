<script>
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    import PartyViewerActorSummary from "#view/sheets/pages/partyViewer/PartyViewerActorSummary.svelte";
    //import PartyViewerAttributesHeader from "../components/partyViewer/PartyViewerAttributesHeader.svelte";
    import PartyViewerCoreHeader from "#view/sheets/pages/partyViewer/PartyViewerCoreHeader.svelte";
    //import PartyViewerLanguagesHeader from "../components/partyViewer/PartyViewerLanguagesHeader.svelte";
    //import PartyViewerResourceHeader from "../components/partyViewer/PartyViewerResourceHeader.svelte";
    //import PartyViewerWealthHeader from "../components/partyViewer/PartyViewerWealthHeader.svelte";
    //import PartyViewerWealthFooter from "../components/partyViewer/PartyViewerWealthFooter.svelte";

    let { sheet } = $props();

    function getAnyMemberHasArtifactCharges() {
        return (partyMembers ?? []).some((actor) => {
            return actor?.system?.spellResources?.artifactCharges?.max;
        });
    }

    function getAnyMemberHasExertionPool() {
        return (partyMembers ?? []).some((actor) => {
            return actor?.system?.attributes?.exertion?.max;
        });
    }

    function getAnyMemberHasInspiration() {
        return (partyMembers ?? []).some((actor) => {
            return actor?.system?.attributes?.inspiration;
        });
    }

    function getAnyMemberHasSpellPointPool() {
        return (partyMembers ?? []).some((actor) => {
            return actor?.system?.spellResources?.points?.max;
        });
    }

    function getGridAreaDefinition(viewMode) {
        let base;

        if (showActorImagesInPartyViewer) base = "img name";
        else base = "name";

        const end = game.user.isGM && !partyIsLocked ? "delete" : "";

        switch (viewMode) {
            case "attributes":
                return `"${base} str dex con int wis cha ${end}"`;
            case "core":
                return `"${base} hp ac maneuverDC spellDC perception insight investigation ${end}"`;
            case "languages":
                return `"${base} languages ${end}"`;
            case "resources":
                return getResourcePanelGridAreaDefinition();
            case "wealth":
                return `"${base} pp gp ep sp cp ${end}"`;
            default:
                return `"${base} hp ac maneuverDC spellDC perception insight investigation ${end}"`;
        }
    }

    function getResourcePanelGridAreaDefinition() {
        const tableElements = [];

        if (showActorImagesInPartyViewer) tableElements.push("img", "name");
        else tableElements.push("name");

        if (partyHasInspiration) tableElements.push("inspiration");
        if (partyHasExertionPool) tableElements.push("exertion");
        if (partyHasArtifactCharges) tableElements.push("artifactCharges");
        if (partyHasSpellPointPool) tableElements.push("spellPoints");
        if (highestSpellSlotLevel) tableElements.push("spellSlots");

        if (
            !partyHasArtifactCharges &&
            !partyHasExertionPool &&
            !partyHasSpellPointPool &&
            !highestSpellSlotLevel
        ) {
            tableElements.push("noResources");
        }

        if (game.user.isGM && !partyIsLocked) tableElements.push("delete");

        return `"${tableElements.join(" ")}"`;
    }

    function getGridSizeDefinition(viewMode) {
        let base;

        if (showActorImagesInPartyViewer) base = "1.75rem 1fr";
        else base = "1fr";

        const end = game.user.isGM && !partyIsLocked ? "2rem" : "";

        switch (viewMode) {
            case "attributes":
                return `${base} repeat(6, 0.5fr) ${end}`;
            case "core":
                return `${base} 4rem repeat(6, 3rem) ${end}`;
            case "languages":
                return `${base} 2.5fr ${end}`;
            case "resources":
                return getResourcePanelGridSizeDefinition();
            case "wealth":
                return `${base} repeat(5, 3.5rem) ${end}`;
            default:
                return `${base} 4rem repeat(6, 3rem) ${end}`;
        }
    }

    function getIsLocked(partyMembers, currentParty) {
        if (!partyMembers.length) {
            return false;
        }

        return currentParty.isLocked ?? false;
    }

    function getResourcePanelGridSizeDefinition() {
        const tableElements = [];

        if (showActorImagesInPartyViewer) tableElements.push("1.75rem", "1fr");
        else tableElements.push("1fr");

        let inspirationWidth = "1.75rem";
        let poolWidth = "3.5rem";

        if (highestSpellSlotLevel >= 8) {
            inspirationWidth = "1.5rem";
            poolWidth = "3.25rem";
        }

        if (partyHasInspiration) tableElements.push(inspirationWidth);
        if (partyHasExertionPool) tableElements.push(poolWidth);
        if (partyHasArtifactCharges) tableElements.push(poolWidth);
        if (partyHasSpellPointPool) tableElements.push(poolWidth);
        if (highestSpellSlotLevel) tableElements.push("min-content");

        if (
            !partyHasArtifactCharges &&
            !partyHasExertionPool &&
            !partyHasSpellPointPool &&
            !highestSpellSlotLevel
        ) {
            tableElements.push("1fr");
        }

        if (game.user.isGM && !partyIsLocked) tableElements.push("2rem");

        return tableElements.join(" ");
    }

    function getViewModeComponent(viewMode) {
        switch (viewMode) {
            case "attributes":
                return PartyViewerAttributesHeader;
            case "core":
                return PartyViewerCoreHeader;
            case "languages":
                return PartyViewerLanguagesHeader;
            case "resources":
                return PartyViewerResourceHeader;
            case "wealth":
                return PartyViewerWealthHeader;
            default:
                return PartyViewerCoreHeader;
        }
    }

    function getHighestPassiveScoresForParty() {
        return (partyMembers ?? []).reduce((passiveScores, actor) => {
            Object.entries(actor?.system?.skills ?? {}).forEach(
                ([skillKey, { passive }]) => {
                    passiveScores[skillKey] ??= 0;

                    if (passive > passiveScores[skillKey]) {
                        passiveScores[skillKey] = passive;
                    }
                },
            );

            return passiveScores;
        }, {});
    }

    function getHighestSpellSlotLevel() {
        return (partyMembers ?? []).reduce((highestSlotLevel, actor) => {
            Object.entries(actor?.system?.spellResources?.slots ?? {}).forEach(
                ([slotLevel, { max }]) => {
                    if (slotLevel > highestSlotLevel && max && max > 0) {
                        highestSlotLevel = slotLevel;
                    }
                },
            );

            return highestSlotLevel;
        }, 0);
    }

    function getTotalPartyWealth() {
        return (partyMembers ?? []).reduce(
            (wealthData, actor) => {
                const currency = actor?.system?.currency;

                wealthData.cp += currency?.cp ?? 0;
                wealthData.sp += currency?.sp ?? 0;
                wealthData.ep += currency?.ep ?? 0;
                wealthData.gp += currency?.gp ?? 0;
                wealthData.pp += currency?.pp ?? 0;

                return wealthData;
            },
            { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
        );
    }

    async function onDropDocument(event) {
        if (!game.user.isGM) {
            ui.notifications.warn("You do not have permission to edit this party.");
            return;
        }

        try {
            const { uuid } = JSON.parse(event.dataTransfer.getData("text/plain"));
            const document = await fromUuid(uuid);

            if (document?.documentName === "Actor") onDropActor(uuid);
        } catch (err) {
            console.error(err);
        }
    }

    async function onDropActor(uuid) {
        if (partyIsLocked) {
            ui.notifications.warn("This party is locked.");
            return;
        }

        if (currentParty?.actors?.length) {
            if (currentParty.actors?.includes(uuid)) return;

            currentParty.actors?.push(uuid);

            await game.settings.set("a5e", "parties", partiesStore);
        } else {
            await game.settings.set("a5e", "parties", {
                [foundry.utils.randomID()]: {
                    name: "New Party",
                    actors: [uuid],
                    isLocked: false,
                },
            });
        }
    }

    async function removeActorFromParty(uuid) {
        const { actors } = currentParty;
        const targetIndex = actors.indexOf(uuid);

        if (targetIndex === -1) return;

        actors.splice(targetIndex, 1);

        await game.settings.set("a5e", "parties", partiesStore);
    }

    async function togglePartyLock() {
        const parties = Object.entries(partiesStore ?? {}).map(([id, partyData]) => ({
            id,
            label: partyData.name || "New Party",
            actors: partyData.actors ?? [],
            isLocked: partyData.isLocked ?? false,
        }));

        if (parties.length) {
            const p = partiesStore[parties[0]?.id];
            p.isLocked = !p?.isLocked;
            await game.settings.set("a5e", "parties", partiesStore);
        }
    }

    function updatePartyData(updatedActor) {
        const actor = fromUuidSync(updatedActor);
        if (!actor) removeActorFromParty(updatedActor);

        updateDerivedData();
    }

    function updateDerivedData() {
        highestPassiveScores = getHighestPassiveScoresForParty();
        highestSpellSlotLevel = getHighestSpellSlotLevel();
        partyHasArtifactCharges = getAnyMemberHasArtifactCharges();
        partyHasExertionPool = getAnyMemberHasExertionPool();
        partyHasInspiration = getAnyMemberHasInspiration();
        partyHasSpellPointPool = getAnyMemberHasSpellPointPool();
        totalPartyWealth = getTotalPartyWealth();

        gridAreaDefinition = getGridAreaDefinition(currentViewMode);

        gridSizeDefinition = getGridSizeDefinition(currentViewMode);
    }

    const viewModes = [
        ["core", "Core"],
        ["attributes", "Attributes"],
        ["resources", "Resources"],
        ["languages", "Languages"],
        ["wealth", "Wealth"],
    ];

    const { isGM } = game.user;

    // Reactive state
    let partiesStore = $state(game.settings.get("a5e", "parties"));
    let showActorImagesInPartyViewer = $state(
        game.settings.get("a5e", "showActorImagesInPartyViewer"),
    );
    let currentViewMode = $state(viewModes[0][0]);

    // Derived state
    let currentParty = $derived.by(() => {
        const parties = Object.entries(partiesStore ?? {}).map(([id, partyData]) => ({
            id,
            label: partyData.name || "New Party",
            actors: partyData.actors ?? [],
            isLocked: partyData.isLocked ?? false,
        }));

        if (parties.length) {
            return partiesStore[parties[0]?.id];
        }

        return {};
    });

    let partyMembers = $derived.by(() => {
        return (currentParty?.actors ?? []).reduce((actors, uuid) => {
            const actor = fromUuidSync(uuid);
            if (actor) actors.push(actor);
            return actors;
        }, []);
    });

    let partyIsLocked = $derived(getIsLocked(partyMembers, currentParty));

    let highestPassiveScores = $state(getHighestPassiveScoresForParty());
    let highestSpellSlotLevel = $state(getHighestSpellSlotLevel());
    let partyHasArtifactCharges = $state(getAnyMemberHasArtifactCharges());
    let partyHasExertionPool = $state(getAnyMemberHasExertionPool());
    let partyHasInspiration = $state(getAnyMemberHasInspiration());
    let partyHasSpellPointPool = $state(getAnyMemberHasSpellPointPool());
    let totalPartyWealth = $state(getTotalPartyWealth());

    let gridAreaDefinition = $derived(getGridAreaDefinition(currentViewMode));
    let gridSizeDefinition = $derived(getGridSizeDefinition(currentViewMode));

    // Watch for party member changes and update derived data
    $effect(() => {
        // Trigger effect when partyMembers changes
        partyMembers;
        updateDerivedData();
    });
</script>

<article ondrop={(event) => onDropDocument(event)}>
    {#if partyMembers.length}
        <FieldWrapper
            --a5e-field-wrapper-direction="row"
            --a5e-field-wrapper-item-alignment="center"
            --a5e-field-wrapper-gap="0.75rem"
            --a5e-field-wrapper-margin="0"
            --a5e-field-wrapper-padding="0"
            --a5e-field-wrapper-wrap="no-wrap"
        >
            <RadioGroup
                allowDeselect={false}
                options={viewModes}
                selected={currentViewMode}
                --radio-group-width="fit-content"
                onupdateSelection={(event) => (currentViewMode = event.detail)}
            />

            {#if isGM}
                <button
                    class="sheet-lock icon fas {partyIsLocked
                        ? 'sheet-lock--locked fa-lock'
                        : 'fa-unlock'}"
                    onclick={togglePartyLock}
                    data-tooltip={partyIsLocked ? "Unlock this party" : "Lock this party"}
                    data-tooltip-direction="UP"
                    aria-labelledby={partyIsLocked
                        ? "Unlock this party"
                        : "Lock this party"}
                ></button>
            {/if}
        </FieldWrapper>

        {@const HeaderComponent = getViewModeComponent(currentViewMode)}
        <HeaderComponent
            propData={{
                highestSpellSlotLevel,
                partyHasArtifactCharges,
                partyHasExertionPool,
                partyHasInspiration,
                partyHasSpellPointPool,
                partyIsLocked,
                showActorImagesInPartyViewer,
            }}
            --a5e-section-heading-template-areas={gridAreaDefinition}
            --a5e-section-heading-template-columns={gridSizeDefinition}
        />

        <ul class="a5e-item-list a5e-item-list--party">
            {#each partyMembers ?? [] as actor}
                <PartyViewerActorSummary
                    {actor}
                    {currentViewMode}
                    {highestPassiveScores}
                    {highestSpellSlotLevel}
                    {partyHasArtifactCharges}
                    {partyHasExertionPool}
                    {partyHasInspiration}
                    {partyHasSpellPointPool}
                    {partyIsLocked}
                    {showActorImagesInPartyViewer}
                    onActorUpdated={(actorId) => updatePartyData(actorId)}
                    onRemoveActor={(uuid) => removeActorFromParty(uuid)}
                    --grid-areas={gridAreaDefinition}
                    --grid-template={gridSizeDefinition}
                />
            {/each}
        </ul>

        {#if currentViewMode === "wealth"}
            <footer>
                <PartyViewerWealthFooter
                    {partyIsLocked}
                    {totalPartyWealth}
                    {showActorImagesInPartyViewer}
                    --grid-areas={gridAreaDefinition}
                    --grid-template={gridSizeDefinition}
                />
            </footer>
        {/if}
    {:else}
        <div class="instructions">
            Drop actors into this window to populate the party.
        </div>
    {/if}
</article>

<style lang="scss">
    article {
        min-height: 14rem;
        min-width: 40rem;
        padding: 0;
    }

    .instructions {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 5rem;
        padding: 1rem;
        margin: 1rem;
        font-size: var(--a5e-text-size-md);
        border: 2px solid #ccc;
        border-radius: var(--a5e-border-radius-standard);
    }

    .sheet-lock {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        width: fit-content;
        padding: 0 0.125rem;
        margin-bottom: 0.25rem;
        margin-right: auto;
        font-size: var(--a5e-text-size-md);
        color: #999;
        opacity: 0.85;
        background: transparent;
        border: none;
        cursor: pointer;

        transition: var(--a5e-transition-standard);

        &--locked {
            color: var(--a5e-color-primary);
        }

        &:focus,
        &:hover {
            transform: scale(1.1);
            box-shadow: none;
            outline: none;
        }
    }
</style>
