<script>
    import { getContext, onDestroy } from "svelte";
    import { derived, get } from "svelte/store";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import FormSection from "../components/FormSection.svelte";
    // import NavigationBar from "../components/navigation/NavigationBar.svelte";
    import PartyViewerActorSummary from "../components/partyViewer/PartyViewerActorSummary.svelte";
    import PartyViewerAttributesHeader from "../components/partyViewer/PartyViewerAttributesHeader.svelte";
    import PartyViewerCoreHeader from "../components/partyViewer/PartyViewerCoreHeader.svelte";
    import PartyViewerLanguagesHeader from "../components/partyViewer/PartyViewerLanguagesHeader.svelte";
    import PartyViewerResourceHeader from "../components/partyViewer/PartyViewerResourceHeader.svelte";
    import PartyViewerWealthHeader from "../components/partyViewer/PartyViewerWealthHeader.svelte";
    import PartyViewerWealthFooter from "../components/partyViewer/PartyViewerWealthFooter.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    export let { settings, sheet } = getContext("#external").application;

    // async function addNewParty() {
    //     $partiesStore[foundry.utils.randomID()] = {
    //         name: "New Party",
    //         actors: [],
    //     };

    //     await game.settings.set("a5e", "parties", $partiesStore);
    // }

    function getAnyMemberHasExertionPool() {
        return ($partyMembers ?? []).some((actor) => {
            const actorData = get(actor);

            return actorData?.system?.attributes?.exertion?.max;
        });
    }

    function getAnyMemberHasInspiration() {
        return ($partyMembers ?? []).some((actor) => {
            const actorData = get(actor);

            return actorData?.system?.attributes?.inspiration;
        });
    }

    function getAnyMemberHasSpellPointPool() {
        return ($partyMembers ?? []).some((actor) => {
            const actorData = get(actor);

            return actorData?.system?.spellResources?.points?.max;
        });
    }

    function getGridAreaDefinition(viewMode) {
        let base;

        if ($showActorImagesInPartyViewer) base = "img name";
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
        // Initialize the elements array with cells for the image and name.
        const tableElements = [];

        if ($showActorImagesInPartyViewer) tableElements.push("img", "name");
        else tableElements.push("name");

        // Conditionally add cells for inspiration, exertion, spell points, and spell slots.
        if (partyHasInspiration) tableElements.push("inspiration");
        if (partyHasExertionPool) tableElements.push("exertion");
        if (partyHasSpellPointPool) tableElements.push("spellPoints");
        if (highestSpellSlotLevel) tableElements.push("spellSlots");

        // Add a section to show the "no resources" message when there's nothing to display.
        if (
            !partyHasExertionPool &&
            !partyHasSpellPointPool &&
            !highestSpellSlotLevel
        ) {
            tableElements.push("noResources");
        }

        // Add a cell for the delete button if user is a GM
        if (game.user.isGM && !partyIsLocked) tableElements.push("delete");

        return `"${tableElements.join(" ")}"`;
    }

    function getGridSizeDefinition(viewMode) {
        let base;

        if ($showActorImagesInPartyViewer) base = "1.75rem 1fr";
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
        // Initialize the elements array with cells for the image and name.
        const tableElements = [];

        if ($showActorImagesInPartyViewer) tableElements.push("1.75rem", "1fr");
        else tableElements.push("1fr");

        let inspirationWidth = "1.75rem";
        let poolWidth = "3.5rem";

        // Conditionally decrease the width of various cells to account for very full tables.
        if (highestSpellSlotLevel >= 8) {
            inspirationWidth = "1.5rem";
            poolWidth = "3.25rem";
        }

        // Conditionally add cells for inspiration, exertion, spell points, and spell slots.
        if (partyHasInspiration) tableElements.push(inspirationWidth);
        if (partyHasExertionPool) tableElements.push(poolWidth);
        if (partyHasSpellPointPool) tableElements.push(poolWidth);
        if (highestSpellSlotLevel) tableElements.push("min-content");

        // Add a section to show the "no resources" message when there's nothing to display.
        if (
            !partyHasExertionPool &&
            !partyHasSpellPointPool &&
            !highestSpellSlotLevel
        ) {
            tableElements.push("1fr");
        }

        // Add a cell for the delete button if user is a GM
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
        return ($partyMembers ?? []).reduce((passiveScores, actor) => {
            const actorData = get(actor);

            Object.entries(actorData?.system?.skills ?? {}).forEach(
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
        return ($partyMembers ?? []).reduce((highestSlotLevel, actor) => {
            const actorData = get(actor);

            Object.entries(
                actorData?.system?.spellResources?.slots ?? {},
            ).forEach(([slotLevel, { max }]) => {
                if (slotLevel > highestSlotLevel && max && max > 0) {
                    highestSlotLevel = slotLevel;
                }
            });

            return highestSlotLevel;
        }, 0);
    }

    function getTotalPartyWealth() {
        return ($partyMembers ?? []).reduce(
            (wealthData, actor) => {
                const reactiveDocument = get(actor);
                const currency = reactiveDocument?.system?.currency;

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
            ui.notifications.warn(
                "You do not have permission to edit this party.",
            );

            return;
        }

        try {
            const { uuid } = JSON.parse(
                event.dataTransfer.getData("text/plain"),
            );

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

        if ($currentParty?.actors?.length) {
            if ($currentParty.actors?.includes(uuid)) return;

            $currentParty.actors?.push(uuid);

            await game.settings.set("a5e", "parties", $partiesStore);
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
        const { actors } = $currentParty;
        const targetIndex = actors.indexOf(uuid);

        if (targetIndex === -1) return;

        actors.splice(targetIndex, 1);

        await game.settings.set("a5e", "parties", $partiesStore);
    }

    async function togglePartyLock() {
        const parties = Object.entries($partiesStore ?? {}).map(
            ([id, partyData]) => ({
                id,
                label: partyData.name || "New Party",
                actors: partyData.actors ?? [],
                isLocked: partyData.isLocked ?? false,
            }),
        );

        if (parties.length) {
            const p = $partiesStore[parties[0]?.id];
            p.isLocked = !p?.isLocked;
            await game.settings.set("a5e", "parties", $partiesStore);
        }
    }

    function updatePartyData(updatedActor) {
        const actor = fromUuidSync(updatedActor);
        if (!actor) removeActorFromParty(updatedActor);

        highestPassiveScores = getHighestPassiveScoresForParty();
        highestSpellSlotLevel = getHighestSpellSlotLevel();
        partyHasExertionPool = getAnyMemberHasExertionPool();
        partyHasInspiration = getAnyMemberHasInspiration();
        partyHasSpellPointPool = getAnyMemberHasSpellPointPool();
        totalPartyWealth = getTotalPartyWealth();

        gridAreaDefinition = getGridAreaDefinition(
            currentViewMode,
            partyIsLocked,
        );

        gridSizeDefinition = getGridSizeDefinition(
            currentViewMode,
            partyIsLocked,
        );
    }

    // function updateCurrentParty(event) {
    //     currentParty = parties[event.detail];
    // }

    // function updatePartyName(event) {
    //     const partyData = $partiesStore[currentParty.name];
    //     partyData.name = event.target.value;
    //     game.settings.set("a5e", "parties", $partiesStore);
    // }

    const viewModes = [
        ["core", "Core"],
        ["attributes", "Attributes"],
        ["resources", "Resources"],
        ["languages", "Languages"],
        ["wealth", "Wealth"],
    ];

    let partiesStore = settings.getStore("parties");

    let currentParty = derived(partiesStore, ($partiesStore) => {
        const parties = Object.entries($partiesStore ?? {}).map(
            ([id, partyData]) => ({
                id,
                label: partyData.name || "New Party",
                actors: partyData.actors ?? [],
                isLocked: partyData.isLocked ?? false,
            }),
        );

        if (parties.length) {
            return $partiesStore[parties[0]?.id];
        }

        return {};
    });

    let partyMembers = derived(currentParty, ($currentParty) => {
        return ($currentParty?.actors ?? []).reduce((actors, uuid) => {
            const actor = fromUuidSync(uuid);

            if (actor) {
                const reactiveDocument = new TJSDocument(actor);
                actors.push(reactiveDocument);
            }

            return actors;
        }, []);
    });

    let highestPassiveScores = getHighestPassiveScoresForParty();
    let highestSpellSlotLevel = getHighestSpellSlotLevel();
    let partyHasExertionPool = getAnyMemberHasExertionPool();
    let partyHasInspiration = getAnyMemberHasInspiration();
    let partyHasSpellPointPool = getAnyMemberHasSpellPointPool();
    let totalPartyWealth = getTotalPartyWealth();

    $: currentViewMode = viewModes[0][0];
    $: partyIsLocked = getIsLocked($partyMembers, $currentParty);

    $: gridAreaDefinition = getGridAreaDefinition(
        currentViewMode,
        partyIsLocked,
    );

    $: gridSizeDefinition = getGridSizeDefinition(
        currentViewMode,
        partyIsLocked,
    );

    const showActorImagesInPartyViewer = settings.getStore(
        "showActorImagesInPartyViewer",
    );

    const unsubscribe = partyMembers.subscribe((_) => {
        highestPassiveScores = getHighestPassiveScoresForParty();
        highestSpellSlotLevel = getHighestSpellSlotLevel();
        partyHasExertionPool = getAnyMemberHasExertionPool();
        partyHasInspiration = getAnyMemberHasInspiration();
        partyHasSpellPointPool = getAnyMemberHasSpellPointPool();
        totalPartyWealth = getTotalPartyWealth();

        gridAreaDefinition = getGridAreaDefinition(
            currentViewMode,
            partyIsLocked,
        );

        gridSizeDefinition = getGridSizeDefinition(
            currentViewMode,
            partyIsLocked,
        );
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<article on:drop={(event) => onDropDocument(event)}>
    <!-- <NavigationBar
        currentTab={currentParty}
        showAdd={true}
        tabs={parties}
        on:tab-change={updateCurrentParty}
        on:add-button-clicked={addNewParty}
    /> -->

    <!-- <FormSection
        heading="Party Name"
        --background="none"
        --gap="0.25rem"
        --margin="0.375rem 0 0.375rem 0.12rem"
        --padding="0"
    >
        <input
            type="text"
            value={$partiesStore[currentParty?.name]?.name}
            placeholder="New Party"
            on:change={updatePartyName}
        />
    </FormSection> -->

    {#if $partyMembers.length}
        <FormSection
            --background="none"
            --gap="0.75rem"
            --margin="0.375rem 0 0.375rem"
            --padding="0"
            --wrap="no-wrap"
        >
            <RadioGroup
                allowDeselect={false}
                options={viewModes}
                selected={currentViewMode}
                --radio-group-width="fit-content"
                on:updateSelection={(event) => (currentViewMode = event.detail)}
            />

            <!-- svelte-ignore missing-declaration -->
            {#if game.user.isGM}
                <button
                    class="sheet-lock fas {partyIsLocked
                        ? 'sheet-lock--locked fa-lock'
                        : 'fa-unlock'}"
                    on:click={togglePartyLock}
                    data-tooltip={partyIsLocked
                        ? "Unlock this party"
                        : "Lock this party"}
                    data-tooltip-direction="UP"
                />
            {/if}
        </FormSection>

        <svelte:component
            this={getViewModeComponent(currentViewMode)}
            propData={{
                highestSpellSlotLevel,
                partyHasExertionPool,
                partyHasInspiration,
                partyHasSpellPointPool,
                partyIsLocked,
                showActorImagesInPartyViewer,
            }}
            --grid-areas={gridAreaDefinition}
            --grid-template={gridSizeDefinition}
        />

        <ul class="a5e-item-list a5e-item-list--party">
            {#each $partyMembers ?? [] as actor}
                <PartyViewerActorSummary
                    {actor}
                    {currentViewMode}
                    {highestPassiveScores}
                    {highestSpellSlotLevel}
                    {partyHasExertionPool}
                    {partyHasInspiration}
                    {partyHasSpellPointPool}
                    {partyIsLocked}
                    {showActorImagesInPartyViewer}
                    --grid-areas={gridAreaDefinition}
                    --grid-template={gridSizeDefinition}
                    on:actor-updated={({ detail }) => updatePartyData(detail)}
                    on:remove-actor={({ detail }) =>
                        removeActorFromParty(detail)}
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
        padding: 0.25rem 0.5rem;
    }

    .instructions {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 5rem;
        padding: 1rem;
        margin: 1rem;
        font-size: 1rem;
        border: 2px solid #ccc;
        border-radius: 3px;
    }

    .sheet-lock {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        width: fit-content;
        padding: 0 0.125rem;
        margin-right: auto;
        font-size: var(--a5e-text-size-md);
        color: #999;
        opacity: 0.85;
        background: transparent;
        cursor: pointer;

        // Nudge the button down 1px so that it _looks_ centred
        top: 1px;

        transition: var(--a5e-transition-standard);

        &--locked {
            color: $color-primary;
        }

        &:focus,
        &:hover {
            transform: scale(1.1);
            box-shadow: none;
        }
    }
</style>
