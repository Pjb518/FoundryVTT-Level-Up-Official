<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import FormSection from "../FormSection.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    const globalCurrencyWeightTrackingSelection = game.settings.get(
        "a5e",
        "currencyWeight"
    );

    $: flags = $actor.flags;
</script>

<section
    class="u-flex-grow u-flex u-flex-col u-overflow-y-auto u-gap-md u-px-md"
    style="grid-auto-rows: min-content;"
>
    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Inventory Settings</h3>
        </header>

        <FormSection>
            <div class="checkbox-row">
                <input
                    class="checkbox"
                    type="checkbox"
                    name="flags.a5e.trackInventoryWeight"
                    id="{$actor.id}-track-inventory-weight"
                    checked={$actor.flags?.a5e?.trackInventoryWeight ?? true}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.checked
                        )}
                />

                <label
                    class="u-pointer"
                    for="{$actor.id}-track-inventory-weight"
                >
                    {localize("A5E.settings.trackInventoryWeight")}
                </label>
            </div>
        </FormSection>

        {#if $actor.flags?.a5e?.trackInventoryWeight ?? true}
            <FormSection>
                <div class="checkbox-row">
                    <input
                        class="checkbox"
                        type="checkbox"
                        name="flags.a5e.doubleCarryCapacity"
                        id="{$actor.id}-double-carry-capacity"
                        checked={flags.a5e?.doubleCarryCapacity ?? false}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                target.checked
                            )}
                    />

                    <label
                        class="u-pointer"
                        for="{$actor.id}-double-carry-capacity"
                    >
                        {localize("A5E.settings.doubleCarryingCapacity")}
                    </label>
                </div>
            </FormSection>

            <FormSection
                hint="A5E.settings.hints.trackCurrencyWeight"
                --gap="0.25rem"
            >
                <div class="checkbox-row">
                    <input
                        class="checkbox"
                        type="checkbox"
                        name="flags.a5e.trackCurrencyWeight"
                        id="{$actor.id}-track-currency-weight"
                        checked={flags.a5e?.trackCurrencyWeight ??
                            globalCurrencyWeightTrackingSelection}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                target.checked
                            )}
                    />

                    <label
                        class="u-pointer"
                        for="{$actor.id}-track-currency-weight"
                    >
                        {localize("A5E.settings.trackCurrencyWeight")}
                    </label>
                </div>
            </FormSection>
        {/if}
    </section>

    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Roll Modifiers</h3>
        </header>

        {#if $actor.type === "character"}
            <FormSection hint="A5E.settings.hints.halflingLuck" --gap="0.25rem">
                <div class="checkbox-row">
                    <input
                        class="checkbox"
                        type="checkbox"
                        name="flags.a5e.halflingLuck"
                        id="{$actor.id}-halfling-luck"
                        checked={flags.a5e?.halflingLuck ?? false}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                target.checked
                            )}
                    />

                    <label class="u-pointer" for="{$actor.id}-halfling-luck">
                        {localize("A5E.settings.halflingLuck")}
                    </label>
                </div>
            </FormSection>

            <FormSection
                hint="A5E.settings.hints.jackOfAllTrades"
                --gap="0.25rem"
            >
                <div class="checkbox-row">
                    <input
                        class="checkbox"
                        type="checkbox"
                        name="flags.a5e.jackOfAllTrades"
                        id="{$actor.id}-jack-of-all-trades"
                        checked={flags.a5e?.jackOfAllTrades ?? false}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                target.checked
                            )}
                    />

                    <label
                        class="u-pointer"
                        for="{$actor.id}-jack-of-all-trades"
                    >
                        {localize("A5E.settings.jackOfAllTrades")}
                    </label>
                </div>
            </FormSection>
        {/if}
    </section>

    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Sheet Customization</h3>
        </header>

        <FormSection>
            <div class="checkbox-row">
                <input
                    class="checkbox"
                    type="checkbox"
                    name="flags.a5e.hideGenericResources"
                    id="{$actor.id}-hide-generic-resources"
                    checked={flags.a5e?.hideGenericResources ??
                        $actor.type === "npc"}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.checked
                        )}
                />

                <label
                    class="u-pointer"
                    for="{$actor.id}-hide-generic-resources"
                >
                    {localize("A5E.HideGenericResources")}
                </label>
            </div>
        </FormSection>

        <FormSection>
            <div class="checkbox-row">
                <input
                    class="checkbox"
                    type="checkbox"
                    name="flags.a5e.includeAbilityModifiersForSkills"
                    id="{$actor.id}-include-ability-mods-for-skills"
                    checked={flags.a5e?.includeAbilityModifiersForSkills ??
                        $actor.type === "npc"}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.checked
                        )}
                />

                <label
                    class="u-pointer"
                    for="{$actor.id}-include-ability-mods-for-skills"
                >
                    {localize("A5E.settings.includeAbilityModifiersForSkills")}
                </label>
            </div>
        </FormSection>

        <FormSection>
            <div class="checkbox-row">
                <input
                    class="checkbox"
                    type="checkbox"
                    name="flags.a5e.showFavoritesSection"
                    id="{$actor.id}-show-favorites-section"
                    checked={flags.a5e?.showFavoritesSection ?? true}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.checked
                        )}
                />

                <label
                    class="u-pointer"
                    for="{$actor.id}-show-favorites-section"
                >
                    {localize("A5E.settings.showFavoritesSection")}
                </label>
            </div>
        </FormSection>

        <FormSection>
            <div class="checkbox-row">
                <input
                    class="checkbox"
                    type="checkbox"
                    name="flags.a5e.showManeuverTab"
                    id="{$actor.id}-show-maneuver-tab"
                    checked={flags.a5e?.showManeuverTab ?? true}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.checked
                        )}
                />

                <label class="u-pointer" for="{$actor.id}-show-maneuver-tab">
                    {localize("A5E.settings.showManeuverTab")}
                </label>
            </div>
        </FormSection>

        <FormSection>
            <div class="checkbox-row">
                <input
                    class="checkbox"
                    type="checkbox"
                    name="flags.a5e.showPassiveScores"
                    id="{$actor.id}-include-show-passive-scores"
                    checked={flags.a5e?.showPassiveScores ?? true}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.checked
                        )}
                />

                <label
                    class="u-pointer"
                    for="{$actor.id}-include-show-passive-scores"
                >
                    {localize("A5E.settings.showPassiveScores")}
                </label>
            </div>
        </FormSection>

        <FormSection>
            <div class="checkbox-row">
                <input
                    class="checkbox"
                    type="checkbox"
                    name="flags.a5e.showSpellTab"
                    id="{$actor.id}-show-spell-tab"
                    checked={flags.a5e?.showSpellTab ?? true}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.checked
                        )}
                />

                <label class="u-pointer" for="{$actor.id}-show-spell-tab">
                    {localize("A5E.settings.showSpellTab")}
                </label>
            </div>
        </FormSection>

        {#if $actor.type === "character"}
            <FormSection>
                <div class="checkbox-row">
                    <input
                        class="checkbox"
                        type="checkbox"
                        name="flags.a5e.showXP"
                        id="{actor.id}-show-xp"
                        checked={flags.a5e?.showXP ?? true}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                target.checked
                            )}
                    />

                    <label class="u-pointer" for="{actor.id}-show-xp">
                        {localize("A5E.settings.showXP")}
                    </label>
                </div>
            </FormSection>
        {/if}
    </section>
</section>

<style lang="scss">
    .checkbox {
        margin: 0;
        cursor: pointer;
    }

    .checkbox-row {
        display: flex;
        align-items: center;
        font-size: 0.833rem;
        gap: 0.75rem;
    }

    .setting-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        &:not(:last-child) {
            margin-bottom: 0.25rem;
        }
    }

    .setting-header {
        padding: 0 0.5rem 0.25rem 0.125rem;
        border-bottom: 1px solid #ccc;
    }

    .setting-heading {
        font-size: 0.833rem;
    }
</style>
