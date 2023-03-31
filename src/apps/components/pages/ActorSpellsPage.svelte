<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import ItemCategory from "../ItemCategory.svelte";
    import TabFooter from "../TabFooter.svelte";
    import SortFilter from "../SortFilter.svelte";

    const actor = getContext("actor");
    const { spells } = actor;
    const { spellLevels } = CONFIG.A5E;

    $: isSpellLevelVisible = (level) => {
        const flags = $actor.flags?.a5e ?? {};
        if (!flags.availableSpellLevels?.length) return true;
        return flags.availableSpellLevels.includes(level.toString());
    };
    $: spellResources = $actor.system.spellResources;
    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<div class="spells-page">
    {#if $actor.isOwner}
        <SortFilter itemType="spells" subTypes={spellLevels} />
    {/if}

    <section class="spells-main-container">
        {#each Object.entries(spellLevels) as [level, label]}
            {#if isSpellLevelVisible(level)}
                <ItemCategory
                    {level}
                    {label}
                    items={$spells._levels[level]}
                    type="spellLevels"
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
        <!-- {#if $actor.type === "npc"}
            <div class="u-flex u-flex-wrap u-align-center u-gap-md">
                <h3 class="u-mb-0 u-text-bold u-text-sm u-flex-grow-1">
                    {localize("A5E.CasterLevel")}
                </h3>

                <input
                    class="a5e-footer-group__input"
                    class:disable-pointer-events={!$actor.isOwner ||
                        sheetIsLocked}
                    type="number"
                    name="system.casterLevel"
                    value={$actor.system.casterLevel}
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
        {/if} -->

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
