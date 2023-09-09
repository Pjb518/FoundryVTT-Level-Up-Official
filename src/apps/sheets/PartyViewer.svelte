<script>
    import { getContext } from "svelte";

    import FormSection from "../components/FormSection.svelte";
    // import NavigationBar from "../components/navigation/NavigationBar.svelte";
    import PartyViewerActorSummary from "../components/party-viewer/PartyViewerActorSummary.svelte";
    import PartyViewerCoreHeader from "../components/party-viewer/PartyViewerCoreHeader.svelte";
    import PartyViewerResourceHeader from "../components/party-viewer/PartyViewerResourceHeader.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    export let { settings } = getContext("#external").application;

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
                return `"img name hp ac passivePerception passiveInsight passiveInvestigation passiveStealth"`;
            case "resources":
                return `"img name"`;
            default:
                return `"img name hp ac passivePerception passiveInsight passiveInvestigation passiveStealth"`;
        }
    }

    function getGridSizeDefinition(viewMode) {
        switch (viewMode) {
            case "core":
                return "2rem 1fr 4rem repeat(5, 3rem)";
            case "resources":
                return "2rem 1fr";
            default:
                return "2rem 1fr 4rem repeat(5, 3rem)";
        }
    }

    function getViewModeComponent(viewMode) {
        switch (viewMode) {
            case "core":
                return PartyViewerCoreHeader;
            case "resources":
                return PartyViewerResourceHeader;
            default:
                return PartyViewerCoreHeader;
        }
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
        if (currentParty?.name) {
            const currentPartyData = $partiesStore[currentParty.name];

            if (currentParty.actors.includes(uuid)) return;

            currentPartyData.actors.push(uuid);

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
        ["languages", "Languages"],
        ["wealth", "Wealth"],
    ];

    let partiesStore = settings.getStore("parties");

    $: parties = Object.entries($partiesStore ?? {}).map(([id, partyData]) => ({
        name: id,
        label: partyData.name || "New Party",
        actors: partyData.actors ?? [],
    }));

    $: currentParty = parties[0];
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
        --grid-areas={getGridAreaDefinition(currentViewMode)}
        --grid-template={getGridSizeDefinition(currentViewMode)}
    />

    <ul class="party-member-list">
        {#each currentParty?.actors ?? [] as uuid (uuid)}
            <PartyViewerActorSummary
                {uuid}
                --grid-areas={getGridAreaDefinition(currentViewMode)}
                --grid-template={getGridSizeDefinition(currentViewMode)}
            />
        {/each}
    </ul>
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
</style>
