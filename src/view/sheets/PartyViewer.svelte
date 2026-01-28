<script lang="ts">
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    import PartyViewerActorSummary from "#view/sheets/pages/partyViewer/PartyViewerActorSummary.svelte";
    import PartyViewerAttributesHeader from "#view/sheets/pages/partyViewer/PartyViewerAttributesHeader.svelte";
    import PartyViewerCoreHeader from "#view/sheets/pages/partyViewer/PartyViewerCoreHeader.svelte";
    import PartyViewerLanguagesHeader from "#view/sheets/pages/partyViewer/PartyViewerLanguagesHeader.svelte";
    import PartyViewerResourceHeader from "#view/sheets/pages/partyViewer/PartyViewerResourceHeader.svelte";
    import PartyViewerSkillsHeader from "#view/sheets/pages/partyViewer/PartyViewerSkillsHeader.svelte";
    import PartyViewerWealthHeader from "#view/sheets/pages/partyViewer/PartyViewerWealthHeader.svelte";
    import PartyViewerWealthFooter from "#view/sheets/pages/partyViewer/PartyViewerWealthFooter.svelte";

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

    function getAnyMemberHasSupply() {
        return (partyMembers ?? []).some((actor) => {
            return actor?.system?.supply;
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
                return `"${base} hp ac maneuverDC spellDC perception insight investigation xp ${end}"`;
            case "languages":
                return `"${base} languages ${end}"`;
            case "resources":
                return getResourcePanelGridAreaDefinition();
            case "skills":
                return getSkillsPanelGridAreaDefinition(base, end);
            case "wealth":
                return getWealthPanelGridAreaDefinition(base, end);
            default:
                return `"${base} hp ac maneuverDC spellDC perception insight investigation xp ${end}"`;
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
        if (partyHasSupply) tableElements.push("supply");
        if (highestSpellSlotLevel) tableElements.push("spellSlots");

        if (
            !partyHasInspiration &&
            !partyHasArtifactCharges &&
            !partyHasExertionPool &&
            !partyHasSpellPointPool &&
            !partyHasSupply &&
            !highestSpellSlotLevel
        ) {
            tableElements.push("noResources");
        }

        if (game.user.isGM && !partyIsLocked) tableElements.push("delete");

        return `"${tableElements.join(" ")}"`;
    }

    function getSkillsPanelGridAreaDefinition(base, end) {
        const skillKeys = Object.keys(CONFIG.A5E.skills);
        const skillAreas = skillKeys.join(" ");

        return `"${base} ${skillAreas} ${end}"`;
    }

    function getWealthPanelGridAreaDefinition(base, end) {
        if (useCredits) {
            return `"${base} cr ${end}"`;
        } else {
            return `"${base} pp gp ep sp cp ${end}"`;
        }
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
                return `${base} 4rem repeat(6, 3rem) 4rem ${end}`;
            case "languages":
                return `${base} 2.5fr ${end}`;
            case "resources":
                return getResourcePanelGridSizeDefinition();
            case "skills":
                return getSkillsPanelGridSizeDefinition(base, end);
            case "wealth":
                return getWealthPanelGridSizeDefinition(base, end);
            default:
                return `${base} 4rem repeat(6, 3rem) 4rem ${end}`;
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
        if (partyHasSupply) tableElements.push(poolWidth);
        if (highestSpellSlotLevel) tableElements.push("min-content");

        if (
            !partyHasArtifactCharges &&
            !partyHasExertionPool &&
            !partyHasSpellPointPool &&
            !partyHasSupply &&
            !highestSpellSlotLevel
        ) {
            tableElements.push("1fr");
        }

        if (game.user.isGM && !partyIsLocked) tableElements.push("2rem");

        return tableElements.join(" ");
    }

    function getSkillsPanelGridSizeDefinition(base, end) {
        let skillCount = Object.keys(CONFIG.A5E.skills).length;

        return `${base} repeat(${skillCount}, 1.5rem) ${end}`;
    }

    function getWealthPanelGridSizeDefinition(base, end) {
        if (useCredits) {
            return `${base} 3.5rem ${end}`;
        } else {
            return `${base} repeat(5, 3.5rem) ${end}`;
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

                wealthData.cr += currency?.cr ?? 0;

                return wealthData;
            },
            { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0, cr: 0 },
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
        partyHasSupply = getAnyMemberHasSupply();
        totalPartyWealth = getTotalPartyWealth();

        gridAreaDefinition = getGridAreaDefinition(currentViewMode);
        gridSizeDefinition = getGridSizeDefinition(currentViewMode);
    }

    function updateWindowWidth(viewMode) {
        if (viewMode === "skills") sheet.setPosition({ width: 900 });
        else sheet.setPosition({ width: 672 });

        return;
    }

    const viewModes = [
        ["core", "Core"],
        ["attributes", "Attributes"],
        ["skills", "Skills"],
        ["languages", "Languages"],
        ["resources", "Resources"],
        ["wealth", "Wealth"],
    ];

    const { isGM } = game.user;

    const useCredits = (game.settings.get("a5e", "useCredits") as boolean) ?? false;

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
    let partyHasSupply = $state(getAnyMemberHasSupply());
    let totalPartyWealth = $state(getTotalPartyWealth());

    let gridAreaDefinition = $derived(getGridAreaDefinition(currentViewMode));
    let gridSizeDefinition = $derived(getGridSizeDefinition(currentViewMode));

    $effect(() => {
        partyMembers;
        updateDerivedData();
        updateWindowWidth(currentViewMode);
    });
</script>

<article class="a5e-party-viewer__article" ondrop={(event) => onDropDocument(event)}>
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
                onUpdateSelection={(selection) => {
                    currentViewMode = selection;
                }}
            />

            {#if isGM}
                <button
                    class="a5e-party-viewer__sheet-lock icon fas {partyIsLocked
                        ? 'a5e-party-viewer__sheet-lock--locked fa-lock'
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

        {#if currentViewMode === "attributes"}
            <PartyViewerAttributesHeader
                --a5e-section-heading-template-areas={gridAreaDefinition}
                --a5e-section-heading-template-columns={gridSizeDefinition}
            />
        {:else if currentViewMode === "core"}
            <PartyViewerCoreHeader
                --a5e-section-heading-template-areas={gridAreaDefinition}
                --a5e-section-heading-template-columns={gridSizeDefinition}
            />
        {:else if currentViewMode === "languages"}
            <PartyViewerLanguagesHeader
                --a5e-section-heading-template-areas={gridAreaDefinition}
                --a5e-section-heading-template-columns={gridSizeDefinition}
            />
        {:else if currentViewMode === "resources"}
            <PartyViewerResourceHeader
                {highestSpellSlotLevel}
                {partyHasArtifactCharges}
                {partyHasExertionPool}
                {partyHasInspiration}
                {partyHasSpellPointPool}
                {partyHasSupply}
                {partyIsLocked}
                {showActorImagesInPartyViewer}
                --a5e-section-heading-template-areas={gridAreaDefinition}
                --a5e-section-heading-template-columns={gridSizeDefinition}
            />
        {:else if currentViewMode === "skills"}
            <PartyViewerSkillsHeader
                --a5e-section-heading-template-areas={gridAreaDefinition}
                --a5e-section-heading-template-columns={gridSizeDefinition}
            />
        {:else if currentViewMode === "wealth"}
            <PartyViewerWealthHeader
                --a5e-section-heading-template-areas={gridAreaDefinition}
                --a5e-section-heading-template-columns={gridSizeDefinition}
            />
        {/if}

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
                    {partyHasSupply}
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
        <div class="a5e-party-viewer__instructions">
            Drop actors into this window to populate the party.
        </div>
    {/if}
</article>
