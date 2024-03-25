<script>
    import { getContext, onDestroy } from "svelte";

    import SpellCompendiumSheet from "../SpellCompendiumSheet";

    import CreateMenu from "./actorUtilityBar/CreateMenu.svelte";
    import Filter from "./actorUtilityBar/Filter.svelte";
    import ItemCategory from "./ItemCategory.svelte";
    import Search from "./actorUtilityBar/Search.svelte";
    import ShowDescription from "./actorUtilityBar/ShowDescription.svelte";
    import Sort from "./actorUtilityBar/Sort.svelte";
    import UtilityBar from "./actorUtilityBar/UtilityBar.svelte";

    import usesRequired from "../../utils/usesRequired";

    export let spellBookId;
    export let reducer;

    function openSpellCompendium() {
        const pack = new SpellCompendiumSheet(
            { collection: game.packs.get("a5e.a5e-spells") },
            {
                importer: (docs) => {
                    docs.forEach((doc) => {
                        doc.system.spellBook = spellBookId;
                    });

                    $actor.createEmbeddedDocuments("Item", docs);
                },
            },
        );

        pack.render(true);
    }

    const actor = getContext("actor");
    const { spellLevels } = CONFIG.A5E;
    const reducerType = "spells";

    let showUses = false;

    const unsubscribe = reducer.subscribe((_) => {
        const spells = Object.keys(spellLevels).reduce(
            (spellBookSpells, level) => {
                spellBookSpells.push(...$reducer?._levels[level]);
                return spellBookSpells;
            },
            [],
        );
        showUses = usesRequired(spells);
    });

    $: menuList = Object.entries(spellLevels);
    $: spellBook = $actor?.spellBooks?.get(spellBookId);

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

    onDestroy(() => {
        unsubscribe();
    });
</script>

<!-- The class name shouldn't change as it is used to find the closest spell book for onDrop -->
<article
    class="a5e-page-wrapper a5e-page-wrapper--scrollable"
    data-spell-book-id={spellBookId}
>
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
                on:click={openSpellCompendium}
                data-tooltip="Import Spells from Compendium"
                data-tooltip-direction="UP"
            />
        </UtilityBar>
    {/if}

    <section class="a5e-page-wrapper a5e-page-wrapper--item-list">
        {#each Object.entries(spellLevels) as [level, label]}
            {#if isSpellLevelVisible(level)}
                <ItemCategory
                    {level}
                    {label}
                    {showDescription}
                    showSpellPoints={spellBook?.showSpellPoints ?? false}
                    showSpellSlots={spellBook?.showSpellSlots ?? true}
                    {showUses}
                    items={$reducer?._levels?.[level]}
                    type="spellLevels"
                />
            {/if}
        {/each}
    </section>
</article>
