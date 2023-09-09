<script>
    import { getContext } from "svelte";

    import FormSection from "../components/FormSection.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";
    import PartyViewerActorSummary from "../components/party-viewer/PartyViewerActorSummary.svelte";

    export let { settings } = getContext("#external").application;

    function addNewParty() {
        console.log("WORKING");
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
                    name: "Example 1",
                    actors: [uuid],
                },
            });
        }
    }

    function updateCurrentParty(event) {
        currentParty = parties[event.detail];
    }

    function updatePartyName(event) {
        const partyData = $partiesStore[currentParty.name];
        partyData.name = event.target.value;
        game.settings.set("a5e", "parties", $partiesStore);
    }

    let partiesStore = settings.getStore("parties");

    $: parties = Object.entries($partiesStore ?? {}).map(([id, partyData]) => ({
        name: id,
        label: partyData.name || "New Party",
        actors: partyData.actors ?? [],
    }));

    $: currentParty = parties[0];
</script>

<article on:drop={(event) => onDropDocument(event)}>
    <NavigationBar
        currentTab={currentParty}
        showAdd={true}
        tabs={parties}
        on:tab-change={updateCurrentParty}
        on:add-button-clicked={addNewParty}
    />

    <FormSection
        heading="Party Name"
        --background="none"
        --gap="0.25rem"
        --margin="0.375rem 0.125rem"
        --padding="0"
    >
        <input
            type="text"
            value={$partiesStore[currentParty?.name]?.name}
            placeholder="New Party"
            on:change={updatePartyName}
        />
    </FormSection>

    <ul class="party-member-list">
        {#each currentParty?.actors ?? [] as uuid (uuid)}
            <PartyViewerActorSummary {uuid} />
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
        margin: 0 0.125rem;
        list-style: none;
        overflow-y: auto;
    }
</style>
