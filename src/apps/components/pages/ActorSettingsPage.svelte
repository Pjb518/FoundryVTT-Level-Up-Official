<script>
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

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
            <h3 class="setting-heading">Global Bonuses</h3>
        </header>

        <small class="hint">
            All of the fields in this section accept any values valid in roll
            formulae.
        </small>

        <div class="global-bonus-container">
            <FormSection heading="Melee Weapon Attack">
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.meleeWeaponAttack"
                    value={$actor.system.bonuses.meleeWeaponAttack}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </FormSection>

            <FormSection heading="Ranged Weapon Attack">
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.rangedWeaponAttack"
                    value={$actor.system.bonuses.rangedWeaponAttack}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </FormSection>

            <FormSection heading="Melee Spell Attack">
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.meleeSpellAttack"
                    value={$actor.system.bonuses.meleeSpellAttack}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </FormSection>

            <FormSection heading="Ranged Spell Attack">
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.rangedSpellAttack"
                    value={$actor.system.bonuses.rangedSpellAttack}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </FormSection>
        </div>

        <hr class="divider" />

        <div class="global-bonus-container">
            <FormSection heading="A5E.ManeuverDCBonus">
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.maneuverDC"
                    value={$actor.system.bonuses.maneuverDC}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </FormSection>

            <FormSection heading="A5E.SpellDCBonus">
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.spellDC"
                    value={$actor.system.bonuses.spellDC}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </FormSection>
        </div>

        <hr class="divider" />

        <div class="global-bonus-container">
            <FormSection heading="A5E.AbilityCheckBonusGlobal">
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.abilities.check"
                    value={$actor.system.bonuses.abilities.check}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </FormSection>

            <FormSection heading="A5E.SavingThrowBonusGlobal">
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.abilities.save"
                    value={$actor.system.bonuses.abilities.save}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </FormSection>

            <FormSection heading="A5E.SkillCheckBonusGlobal">
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.abilities.skill"
                    value={$actor.system.bonuses.abilities.skill}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </FormSection>
        </div>
    </section>

    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Inventory Settings</h3>
        </header>

        <FormSection>
            <Checkbox
                label="A5E.settings.trackInventoryWeight"
                checked={$actor.flags?.a5e?.trackInventoryWeight ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.trackInventoryWeight",
                        detail
                    );
                }}
            />
        </FormSection>

        {#if $actor.flags?.a5e?.trackInventoryWeight ?? true}
            <FormSection>
                <Checkbox
                    label="A5E.settings.doubleCarryingCapacity"
                    checked={flags.a5e?.doubleCarryCapacity ?? false}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            "flags.a5e.doubleCarryCapacity",
                            detail
                        );
                    }}
                />
            </FormSection>

            <FormSection
                hint="A5E.settings.hints.trackCurrencyWeight"
                --gap="0.25rem"
            >
                <Checkbox
                    label="A5E.settings.trackCurrencyWeight"
                    checked={flags.a5e?.trackCurrencyWeight ??
                        globalCurrencyWeightTrackingSelection}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            "flags.a5e.trackCurrencyWeight",
                            detail
                        );
                    }}
                />
            </FormSection>
        {/if}
    </section>

    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Roll Modifiers</h3>
        </header>

        {#if $actor.type === "character"}
            <FormSection hint="A5E.settings.hints.halflingLuck" --gap="0.25rem">
                <Checkbox
                    label="A5E.settings.halflingLuck"
                    checked={flags.a5e?.halflingLuck ?? false}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            "flags.a5e.halflingLuck",
                            detail
                        );
                    }}
                />
            </FormSection>

            <FormSection
                hint="A5E.settings.hints.jackOfAllTrades"
                --gap="0.25rem"
            >
                <Checkbox
                    label="A5E.settings.jackOfAllTrades"
                    checked={flags.a5e?.jackOfAllTrades ?? false}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            "flags.a5e.jackOfAllTrades",
                            detail
                        );
                    }}
                />
            </FormSection>
        {/if}
    </section>

    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Sheet Customization</h3>
        </header>

        <FormSection>
            <Checkbox
                label="A5E.HideGenericResources"
                checked={flags.a5e?.hideGenericResources ??
                    $actor.type === "npc"}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.hideGenericResources",
                        detail
                    );
                }}
            />
        </FormSection>

        <FormSection>
            <Checkbox
                label="A5E.settings.includeAbilityModifiersForSkills"
                checked={flags.a5e?.includeAbilityModifiersForSkills ??
                    $actor.type === "npc"}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.includeAbilityModifiersForSkills",
                        detail
                    );
                }}
            />
        </FormSection>

        <FormSection>
            <Checkbox
                label="A5E.settings.showFavoritesSection"
                checked={flags.a5e?.showFavoritesSection ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.showFavoritesSection",
                        detail
                    );
                }}
            />
        </FormSection>

        <FormSection>
            <Checkbox
                label="A5E.settings.showManeuverTab"
                checked={flags.a5e?.showManeuverTab ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.showManeuverTab",
                        detail
                    );
                }}
            />
        </FormSection>

        <FormSection>
            <Checkbox
                label="A5E.settings.showPassiveScores"
                checked={flags.a5e?.showPassiveScores ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.showPassiveScores",
                        detail
                    );
                }}
            />
        </FormSection>

        <FormSection>
            <Checkbox
                label="A5E.settings.showSpellTab"
                checked={flags.a5e?.showSpellTab ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.showSpellTab",
                        detail
                    );
                }}
            />
        </FormSection>

        {#if $actor.type === "character"}
            <FormSection>
                <Checkbox
                    label="A5E.settings.showXP"
                    checked={flags.a5e?.showXP ?? true}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            "flags.a5e.showXP",
                            detail
                        );
                    }}
                />
            </FormSection>
        {/if}
    </section>

    {#if $actor.type === "npc" && game.settings.get("a5e", "randomizeNPCHitPoints")}
        <section class="setting-group">
            <header class="setting-header">
                <h3 class="setting-heading">Token Options</h3>
            </header>

            <FormSection --gap="0.25rem">
                <Checkbox
                    label="Disable Randomized HP Rolls"
                    checked={flags.a5e?.disableRandomizedHP ?? false}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            "flags.a5e.disableRandomizedHP",
                            detail
                        );
                    }}
                />
            </FormSection>
        </section>
    {/if}
</section>

<style lang="scss">
    .a5e-input[type="text"] {
        height: 1.75rem;
    }

    .divider {
        border: 0;
        border-bottom: 0.5px solid #ccc;
        margin: 0.375rem 0;
    }

    .global-bonus-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.25rem;
    }

    .hint {
        margin-block: 0.25rem;
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
