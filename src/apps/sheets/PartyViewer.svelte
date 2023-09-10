<script>
    import { getContext } from "svelte";
    import { derived, get } from "svelte/store";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import FormSection from "../components/FormSection.svelte";
    // import NavigationBar from "../components/navigation/NavigationBar.svelte";
    import PartyViewerActorSummary from "../components/party-viewer/PartyViewerActorSummary.svelte";
    import PartyViewerCoreHeader from "../components/party-viewer/PartyViewerCoreHeader.svelte";
    import PartyViewerResourceHeader from "../components/party-viewer/PartyViewerResourceHeader.svelte";
    import PartyViewerWealthHeader from "../components/party-viewer/PartyViewerWealthHeader.svelte";
    import PartyViewerWealthFooter from "../components/party-viewer/PartyViewerWealthFooter.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    export let { settings, sheet } = getContext("#external").application;

    // async function addNewParty() {
    //     $partiesStore[foundry.utils.randomID()] = {
    //         name: "New Party",
    //         actors: [],
    //     };

    //     await game.settings.set("a5e", "parties", $partiesStore);
    // }

    function getGridAreaDefinition(viewMode) {
        switch (viewMode) {
            case "core":
                return `"img name hp ac maneuverDC spellDC perception insight investigation delete"`;
            case "resources":
                return `"img name exertion spellPoints spellSlots delete"`;
            case "wealth":
                return `"img name cp sp ep gp pp delete"`;
            default:
                return `"img name hp ac maneuverDC spellDC perception insight investigation delete"`;
        }
    }

    function getGridSizeDefinition(viewMode) {
        switch (viewMode) {
            case "core":
                return "2rem 1fr 4rem repeat(6, 3rem) 2rem";
            case "resources":
                return "2rem 1fr 3.5rem 3.5rem min-content 2rem";
            case "wealth":
                return "2rem 1fr repeat(5, 3.5rem) 2rem";
            default:
                return "2rem 1fr 4rem repeat(6, 3rem) 2rem";
        }
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
        }, 1);
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

    let totalPartyWealth = getTotalPartyWealth();
    let highestPassiveScores = getHighestPassiveScoresForParty();
    let highestSpellSlotLevel = getHighestSpellSlotLevel();

    $: currentViewMode = viewModes[0][0];
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
            propData={{ highestSpellSlotLevel }}
            --grid-areas={getGridAreaDefinition(currentViewMode)}
            --grid-template={getGridSizeDefinition(currentViewMode)}
        />

        <ul class="party-member-list">
            {#each $partyMembers ?? [] as actor}
                <PartyViewerActorSummary
                    {actor}
                    {currentViewMode}
                    {highestPassiveScores}
                    {highestSpellSlotLevel}
                    --grid-areas={getGridAreaDefinition(currentViewMode)}
                    --grid-template={getGridSizeDefinition(currentViewMode)}
                    on:actor-updated={updatePartyData}
                    on:remove-actor={removeActorFromParty}
                />
            {/each}
        </ul>

        {#if currentViewMode === "wealth"}
            <footer>
                <PartyViewerWealthFooter
                    {totalPartyWealth}
                    --grid-areas={getGridAreaDefinition(currentViewMode)}
                    --grid-template={getGridSizeDefinition(currentViewMode)}
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
        min-height: 20rem;
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
