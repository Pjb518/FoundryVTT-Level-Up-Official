<script>
    import { localize } from "#runtime/svelte/helper";
    import { getContext } from "svelte";

    import SpellCompendiumSheet from "../SpellCompendiumSheet";

    import CreateMenu from "./actorUtilityBar/CreateMenu.svelte";
    import Filter from "./actorUtilityBar/Filter.svelte";
    import ItemCategory from "./ItemCategory.svelte";
    import Search from "./actorUtilityBar/Search.svelte";
    import ShowDescription from "./actorUtilityBar/ShowDescription.svelte";
    import Sort from "./actorUtilityBar/Sort.svelte";
    import UtilityBar from "./actorUtilityBar/UtilityBar.svelte";

    export let spellBookId;
    export let spellBook;
    export let showUses;
    export let reducer;

    function openCompendium() {
        const pack = new SpellCompendiumSheet(
            { collection: game.packs.get("a5e.a5e-spells") },
            {
                importer: (docs) => {
                    docs.forEach((doc) => (doc.system.spellBook = spellBookId));
                    $actor.createEmbeddedDocuments("Item", docs);
                },
            },
        );

        pack.render(true);
    }

    const actor = getContext("actor");
    const { spellLevels } = CONFIG.A5E;
    const reducerType = "spells";

    $: menuList = Object.entries(spellLevels);

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;

    $: isSpellLevelVisible = (level) => {
        if (!sheetIsLocked) return true;

        const maxSlots = $actor.system.spellResources.slots[level]?.max;
        const showSpellSlots = $actor.flags?.a5e?.showSpellSlots ?? true;
        const spellQuantity = [...($reducer?._levels[level] ?? [])].length;

        if (spellQuantity) return true;
        if (showSpellSlots && maxSlots > 0) return true;

        return false;
    };

    let showDescription = false;
</script>

<article>
    <header>
        <h3>{spellBook.name}</h3>
    </header>
    {#if $actor.isOwner}
        <UtilityBar>
            <Search {reducerType} {reducer} />
            <ShowDescription
                on:updateSelection={() => (showDescription = !showDescription)}
            />
            <Sort {reducerType} {reducer} reducerId={spellBookId} />
            <Filter {reducerType} reducerId={spellBookId} {reducer} />
            <CreateMenu {reducerType} {menuList} {reducer} />

            <button
                class="a5e-import-from-compendium-button fa-solid fa-download"
                on:click={openCompendium}
                data-tooltip="Import Spells from Compendium"
                data-tooltip-direction="UP"
            ></button>
        </UtilityBar>
    {/if}

    <section class="a5e-page-wrapper a5e-page-wrapper--item-list">
        {#each Object.entries(spellLevels) as [level, label]}
            {#if isSpellLevelVisible(level)}
                <ItemCategory
                    {level}
                    {label}
                    {showDescription}
                    {showUses}
                    items={$reducer?._levels?.[level]}
                    type="spellLevels"
                />
            {/if}
        {/each}
    </section>
</article>
