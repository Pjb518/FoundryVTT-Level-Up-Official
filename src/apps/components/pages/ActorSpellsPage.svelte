<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import ItemCategory from "../ItemCategory.svelte";
    import TabFooter from "../TabFooter.svelte";
    import SortFilter from "../SortFilter.svelte";

    import ActorSpellConfigDialog from "../../dialogs/initializers/ActorSpellConfigDialog";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");
    const { spells } = actor;

    function isSpellLevelVisible(level) {
        const flags = $actor?.flags?.a5e ?? {};

        if (!flags.availableSpellLevels.length) return true;

        return flags.availableSpellLevels.includes(level.toString());
    }

    function configureSpells() {
        const dialog = new ActorSpellConfigDialog(actor);
        dialog.render(true);
    }

    $: spellResources = $actor.system.spellResources;
    $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<div class="spells-page">
    <SortFilter itemType="spells" />

    <section class="spells-main-container">
        {#each Object.entries(CONFIG.A5E.spellLevels) as [level, label]}
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
        {#if $actor?.flags?.a5e?.showSpellPoints ?? false}
            <div class="u-flex u-flex-wrap u-align-center u-gap-md">
                <h3 class="u-mb-0 u-text-bold u-text-sm u-flex-grow-1">
                    {localize("A5E.SpellPoints")}
                </h3>

                <input
                    class="a5e-footer-group__input"
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

        {#if !sheetIsLocked}
            <div class="u-align-center u-flex u-gap-md u-h-6 u-mr-lg u-ml-auto">
                <h3 class="u-mb-0 u-text-bold u-text-sm">
                    {localize("A5E.ConfigureSpells")}
                </h3>

                <i
                    class="fas fa-gear a5e-config-button u-text-sm"
                    on:click={configureSpells}
                />
            </div>
        {/if}
    </TabFooter>
</div>

<style lang="scss">
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
        gap: 0.25rem;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
