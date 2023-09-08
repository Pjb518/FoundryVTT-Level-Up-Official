<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";

    export let { settings } = getContext("#external").application;

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

    let partiesStore = settings.getStore("parties");

    $: parties = Object.entries($partiesStore ?? {}).map(([id, partyData]) => ({
        name: id,
        label: partyData.name ?? "New Party",
        actors: partyData.actors ?? [],
    }));

    $: currentParty = parties[0];
</script>

<main>
    <NavigationBar
        currentTab={currentParty}
        tabs={parties}
        on:tab-change={updateCurrentParty}
    />

    <div class="drop-area" on:drop={(event) => onDropDocument(event)}>
        Drop Area
    </div>

    <ul>
        {#each currentParty.actors ?? [] as actor}
            <li>{actor}</li>
        {/each}
    </ul>
</main>

<style lang="scss">
    main {
        padding: 0.25rem 0.5rem;
    }

    .drop-area {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 4rem;
        margin-block: 0.5rem;
        background: #ddd;
        border-radius: 3px;
    }
</style>
