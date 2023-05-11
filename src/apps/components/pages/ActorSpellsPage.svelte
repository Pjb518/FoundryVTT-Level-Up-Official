<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";
    import usesRequired from "../../../utils/usesRequired";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import Filter from "../actorUtilityBar/Filter.svelte";
    import ItemCategory from "../ItemCategory.svelte";
    import Search from "../actorUtilityBar/Search.svelte";
    import Sort from "../actorUtilityBar/Sort.svelte";
    import TabFooter from "../TabFooter.svelte";
    import UtilityBar from "../actorUtilityBar/UtilityBar.svelte";

    const actor = getContext("actor");
    const { spells } = actor;
    const { spellLevels } = CONFIG.A5E;
    const reducerType = "spells";

    $: menuList = Object.entries(spellLevels);
    $: spellResources = $actor.system.spellResources;
    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;

    $: isSpellLevelVisible = (level) => {
        if (!sheetIsLocked) return true;

        const maxSlots = $actor.system.spellResources.slots[level]?.max;
        const showSpellSlots = $actor.flags?.a5e?.showSpellSlots ?? true;
        const spellQuantity = [...$spells._levels[level]].length;

        if (spellQuantity) return true;
        if (showSpellSlots && maxSlots > 0) return true;

        return false;
    };
</script>

<div class="spells-page">
    {#if $actor.isOwner}
        <UtilityBar>
            <Search {reducerType} />
            <Sort {reducerType} />
            <Filter {reducerType} />
            <CreateMenu {reducerType} {menuList} />
        </UtilityBar>
    {/if}

    <section class="spells-main-container">
        {#each Object.entries(spellLevels) as [level, label]}
            {#if isSpellLevelVisible(level)}
                <ItemCategory
                    {level}
                    {label}
                    items={$spells._levels[level]}
                    type="spellLevels"
                    usesRequired={usesRequired(spells)}
                />
            {/if}
        {/each}
    </section>

    <TabFooter>
        <!-- Spell Points -->
        {#if $actor.flags.a5e?.showSpellPoints ?? false}
            <div class="u-flex u-flex-wrap u-align-center u-gap-md">
                <h3 class="u-mb-0 u-text-bold u-text-sm u-flex-grow-1">
                    {localize("A5E.SpellPoints")}
                </h3>

                <input
                    class="a5e-footer-group__input"
                    class:disable-pointer-events={!$actor.isOwner}
                    type="number"
                    name="system.spellResources.points.current"
                    value={spellResources.points.current}
                    placeholder="0"
                    min="0"
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            Number(target.value)
                        )}
                />
                /
                <input
                    class="a5e-footer-group__input"
                    type="number"
                    name="system.spellResources.points.max"
                    value={spellResources.points.max}
                    placeholder="0"
                    min="0"
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            Number(target.value)
                        )}
                />
            </div>
        {/if}

        <!-- NPC Caster Level Configuration -->
        {#if $actor.type === "npc"}
            <div class="u-flex u-flex-wrap u-align-center u-gap-md">
                <h3 class="u-mb-0 u-text-bold u-text-sm u-flex-grow-1">
                    {localize("A5E.CasterLevel")}
                </h3>

                <input
                    class="a5e-footer-group__input"
                    class:disable-pointer-events={!$actor.isOwner ||
                        sheetIsLocked}
                    type="number"
                    name="system.attributes.casterLevel"
                    value={$actor.system.attributes.casterLevel}
                    placeholder="0"
                    min="0"
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            Number(target.value)
                        )}
                />
            </div>
        {/if}

        {#if !sheetIsLocked}
            <div
                class="u-align-center u-flex u-gap-md u-h-6 u-mr-lg"
                class:u-ml-auto={!$actor.flags.a5e?.showSpellPoints ?? true}
            >
                <h3 class="u-mb-0 u-text-bold u-text-sm">
                    {localize("A5E.ConfigureSpells")}
                </h3>

                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <i
                    class="fas fa-gear a5e-config-button u-text-sm"
                    on:click={() => $actor.configureSpellTab()}
                />
            </div>
        {/if}
    </TabFooter>
</div>

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .spells-page {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.5rem;
        overflow: hidden;
    }

    .spells-main-container {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        gap: 0.75rem;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
