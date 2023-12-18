<script>
    import { createEventDispatcher, getContext } from "svelte";
    import { fade } from "svelte/transition";

    import getCategoryName from "../../handlers/getCategoryName";

    import CompendiumManeuverItem from "../CompendiumManeuverItem.svelte";
    import CompendiumMonsterItem from "../CompendiumMonsterItem.svelte";
    import CompendiumObjectItem from "../CompendiumObjectItem.svelte";
    import CompendiumSpellItem from "../CompendiumSpellItem.svelte";

    export let documents = [];
    export let compendiumType;
    export let enableGrouping = false;

    const compendiumItemComponents = {
        "5eSpell": CompendiumSpellItem,
        magicItem: CompendiumObjectItem,
        maneuver: CompendiumManeuverItem,
        monster: CompendiumMonsterItem,
        object: CompendiumObjectItem,
        spell: CompendiumSpellItem,
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
        monster: [
            0,
            0.125,
            0.25,
            0.5,
            ...Array.from(Array(30).keys(), (n) => n + 1),
        ],
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
                (doc) =>
                    foundry.utils.getProperty(doc, property) == filterValue,
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

    const dispatch = createEventDispatcher();

    $: setupGrouping(enableGrouping);
</script>

<ul
    class="a5efc-document-list"
    transition:fade
    on:scroll={({ target }) =>
        dispatch(
            "listScrolled",
            (target.scrollTop / (target.scrollHeight - target.clientHeight)) *
                100,
        )}
>
    {#if derived.length}
        {#each derived as { name, derivedReducer }}
            {#if [...derivedReducer].length !== 0}
                <h3 class="a5efc-category-heading">
                    {name}
                </h3>

                {#each [...derivedReducer] as document}
                    <svelte:component
                        this={compendiumItemComponents[compendiumType]}
                        {document}
                    />
                {/each}
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

<style>
    .a5efc-category-heading {
        display: flex;
        align-items: center;
        margin-block: 0;
        padding: 0.25rem 0.5rem;
        font-family: Signika, sans-serif;
        font-size: 0.833rem;
        line-height: 1;
        color: #f6f2eb;
        background: #425f65;
        border-bottom: none;
        border-radius: 3px;
        box-shadow: inset 0 0 10px #2e4246;
    }
</style>
