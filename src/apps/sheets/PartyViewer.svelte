<script>
    import { getContext, onDestroy } from "svelte";
    import { derived, get } from "svelte/store";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import FormSection from "../components/FormSection.svelte";
    // import NavigationBar from "../components/navigation/NavigationBar.svelte";
    import PartyViewerActorSummary from "../components/partyViewer/PartyViewerActorSummary.svelte";
    import PartyViewerCoreHeader from "../components/partyViewer/PartyViewerCoreHeader.svelte";
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

    function getAnyMemberHasSpellPointPool() {
        return ($partyMembers ?? []).some((actor) => {
            const actorData = get(actor);

            return actorData?.system?.spellResources?.points?.max;
        });
    }

    function getGridAreaDefinition(viewMode) {
        const base = "img name";
        const end = game.user.isGM ? "delete" : "";

        switch (viewMode) {
            case "core":
                return `"${base} hp ac maneuverDC spellDC perception insight investigation ${end}"`;
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
        const tableElements = ["img", "name"];

        // Conditionally add cells for exertion, spell points, and spell slots.
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
        if (game.user.isGM) tableElements.push("delete");

        return `"${tableElements.join(" ")}"`;
    }

    function getGridSizeDefinition(viewMode) {
        const base = "1.75rem 1fr";
        const end = game.user.isGM ? "2rem" : "";

        switch (viewMode) {
            case "core":
                return `${base} 4rem repeat(6, 3rem) ${end}`;
            case "resources":
                return getResourcePanelGridSizeDefinition();
            case "wealth":
                return `${base} repeat(5, 3.5rem) ${end}`;
            default:
                return `${base} 4rem repeat(6, 3rem) ${end}`;
        }
    }

    function getResourcePanelGridSizeDefinition() {
        // Initialize the elements array with cells for the image and name.
        const tableElements = ["1.75rem", "1fr"];

        // Conditionally add cells for exertion, spell points, and spell slots.
        if (partyHasExertionPool) tableElements.push("3.5rem");
        if (partyHasSpellPointPool) tableElements.push("3.5rem");
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
        if (game.user.isGM) tableElements.push("2rem");

        return tableElements.join(" ");
    }

    function getViewModeComponent(viewMode) {
        switch (viewMode) {
            case "core":
                return PartyViewerCoreHeader;
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
                }
            );

            return passiveScores;
        }, {});
    }

    function getHighestSpellSlotLevel() {
        return ($partyMembers ?? []).reduce((highestSlotLevel, actor) => {
            const actorData = get(actor);

            Object.entries(
                actorData?.system?.spellResources?.slots ?? {}
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
            { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }
        );
    }

    async function onDropDocument(event) {
        if (!game.user.isGM) {
            ui.notifications.warn(
                "You do not have permission to edit this party."
            );

            return;
        }

        try {
            const { uuid } = JSON.parse(
                event.dataTransfer.getData("text/plain")
            );

            const document = await fromUuid(uuid);

            if (document?.documentName === "Actor") onDropActor(uuid);
        } catch (err) {
            console.error(err);
        }
    }

    async function onDropActor(uuid) {
        if ($currentParty?.actors?.length) {
            if ($currentParty.actors?.includes(uuid)) return;

            $currentParty.actors?.push(uuid);

            await game.settings.set("a5e", "parties", $partiesStore);
        } else {
            await game.settings.set("a5e", "parties", {
                [foundry.utils.randomID()]: {
                    name: "New Party",
                    actors: [uuid],
                },
            });
        }
    }

    async function removeActorFromParty({ detail: uuid }) {
        const { actors } = $currentParty;
        const targetIndex = actors.indexOf(uuid);

        if (targetIndex === -1) return;

        actors.splice(targetIndex, 1);

        await game.settings.set("a5e", "parties", $partiesStore);
    }

    function updatePartyData() {
        totalPartyWealth = getTotalPartyWealth();
        highestPassiveScores = getHighestPassiveScoresForParty();
        highestSpellSlotLevel = getHighestSpellSlotLevel();
        partyHasExertionPool = getAnyMemberHasExertionPool();
        partyHasSpellPointPool = getAnyMemberHasSpellPointPool();
        gridAreaDefinition = getGridAreaDefinition(currentViewMode);
        gridSizeDefinition = getGridSizeDefinition(currentViewMode);
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
        ["resources", "Resources"],
        // ["languages", "Languages"],
        ["wealth", "Wealth"],
    ];

    let partiesStore = settings.getStore("parties");

    let currentParty = derived(partiesStore, ($partiesStore) => {
        const parties = Object.entries($partiesStore ?? {}).map(
            ([id, partyData]) => ({
                id,
                label: partyData.name || "New Party",
                actors: partyData.actors ?? [],
            })
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
    let partyHasSpellPointPool = getAnyMemberHasSpellPointPool();
    let totalPartyWealth = getTotalPartyWealth();

    $: currentViewMode = viewModes[0][0];
    $: gridAreaDefinition = getGridAreaDefinition(currentViewMode);
    $: gridSizeDefinition = getGridSizeDefinition(currentViewMode);

    const unsubscribe = partyMembers.subscribe((_) => {
        highestPassiveScores = getHighestPassiveScoresForParty();
        highestSpellSlotLevel = getHighestSpellSlotLevel();
        partyHasExertionPool = getAnyMemberHasExertionPool();
        partyHasSpellPointPool = getAnyMemberHasSpellPointPool();
        gridAreaDefinition = getGridAreaDefinition(currentViewMode);
        gridSizeDefinition = getGridSizeDefinition(currentViewMode);
        totalPartyWealth = getTotalPartyWealth();
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
            --gap="0.25rem"
            --margin="0.375rem 0 0.375rem"
            --padding="0"
        >
            <RadioGroup
                options={viewModes}
                selected={currentViewMode}
                on:updateSelection={(event) => (currentViewMode = event.detail)}
            />
        </FormSection>

        <svelte:component
            this={getViewModeComponent(currentViewMode)}
            propData={{
                highestSpellSlotLevel,
                partyHasExertionPool,
                partyHasSpellPointPool,
            }}
            --grid-areas={gridAreaDefinition}
            --grid-template={gridSizeDefinition}
        />

        <ul class="party-member-list">
            {#each $partyMembers ?? [] as actor}
                <PartyViewerActorSummary
                    {actor}
                    {currentViewMode}
                    {highestPassiveScores}
                    {highestSpellSlotLevel}
                    {partyHasExertionPool}
                    {partyHasSpellPointPool}
                    --grid-areas={gridAreaDefinition}
                    --grid-template={gridSizeDefinition}
                    on:actor-updated={updatePartyData}
                    on:remove-actor={removeActorFromParty}
                />
            {/each}
        </ul>

        {#if currentViewMode === "wealth"}
            <footer>
                <PartyViewerWealthFooter
                    {totalPartyWealth}
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
        min-height: 15rem;
        min-width: 40rem;
        padding: 0.25rem 0.5rem;
    }

    .party-member-list {
        display: grid;
        gap: 0.25rem;
        max-height: 30rem;
        padding: 0;
        margin: 0.25rem 0;
        list-style: none;
        overflow-y: auto;
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
</style>
