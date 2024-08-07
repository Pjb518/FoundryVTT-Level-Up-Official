<script>
    import { createEventDispatcher, getContext } from "svelte";
    import { fade } from "svelte/transition";

    import getCategoryName from "../../handlers/getCategoryName";

    import CompendiumClassFeatureItem from "./CompendiumClassFeatureItem.svelte";
    import CompendiumManeuverItem from "./CompendiumManeuverItem.svelte";
    import CompendiumMonsterItem from "./CompendiumMonsterItem.svelte";
    import CompendiumObjectItem from "./CompendiumObjectItem.svelte";
    import CompendiumOriginItem from "./CompendiumOriginItem.svelte";
    import CompendiumSpellItem from "./CompendiumSpellItem.svelte";
    import CompendiumSubItemList from "./CompendiumSubItemList.svelte";

    export let documents = [];
    export let compendiumType;
    export let enableGrouping = false;

    const collection = getContext("collection");

    const compendiumItemComponents = {
        "5eSpell": CompendiumSpellItem,
        classFeature: CompendiumClassFeatureItem,
        magicItem: CompendiumObjectItem,
        maneuver: CompendiumManeuverItem,
        monster: CompendiumMonsterItem,
        object: CompendiumObjectItem,
        spell: CompendiumSpellItem,

        archetype: CompendiumOriginItem,
    };

    const groups = {
        "5eSpell": "level",
        magicItem: "rarity",
        maneuver: "degree",
        monster: "details.cr",
        object: "rarity",
        spell: "level",
    };

    const filterBy = {
        "5eSpell": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        magicItem: [
            "mundane",
            "common",
            "uncommon",
            "rare",
            "very rare",
            "legendary",
            "artifact",
        ],
        maneuver: [0, 1, 2, 3, 4, 5],
        monster: [0, 0.125, 0.25, 0.5, ...Array.from(Array(30).keys(), (n) => n + 1)],
        object: [
            "mundane",
            "common",
            "uncommon",
            "rare",
            "very rare",
            "legendary",
            "artifact",
        ],
        spell: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    };

    const reducer = getContext("reducer");
    let derived = [];

    function setupGrouping(enableGrouping) {
        if (!enableGrouping) {
            reducer.derived.clear();
            derived = [];
            return;
        }

        const filters = filterBy[compendiumType];
        const property = `system.${groups[compendiumType]}`;

        for (const filterValue of filters) {
            const dr = $reducer.derived.create(`${filterValue}`);
            dr.filters.add(
                (doc) => foundry.utils.getProperty(doc, property) == filterValue,
            );

            dr.index.update(true);
            const categoryName = getCategoryName(compendiumType, filterValue);

            derived.push({
                name: categoryName,
                derivedReducer: dr,
            });
        }

        derived = derived;
    }

    async function onDocumentDrop(event) {
        const transferData = event.dataTransfer.getData("text/plain");
        if (!transferData) return;

        try {
            const dragData = JSON.parse(transferData);
            const document = await fromUuid(dragData.uuid);
            return collection.importDocument(document);
        } catch (e) {
            return;
        }
    }

    const dispatch = createEventDispatcher();

    $: setupGrouping(enableGrouping);
</script>

<ul
    class="a5e-item-list a5e-item-list--compendium"
    transition:fade
    on:scroll={({ target }) =>
        dispatch(
            "listScrolled",
            (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100,
        )}
    on:drop={onDocumentDrop}
>
    {#if derived.length}
        {#each derived as { name, derivedReducer }}
            {#if [...derivedReducer].length !== 0}
                <CompendiumSubItemList
                    {name}
                    ItemComponent={compendiumItemComponents[compendiumType]}
                    reducer={derivedReducer}
                />
            {/if}
        {/each}
    {:else}
        {#each documents as document}
            <svelte:component
                this={compendiumItemComponents[compendiumType]}
                {document}
            />
        {/each}
    {/if}
</ul>
