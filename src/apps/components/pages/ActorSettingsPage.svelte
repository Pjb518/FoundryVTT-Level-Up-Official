<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";

    import determineIfPropertyModifiedByEffect from "../../../utils/determineIfPropertyModifiedByEffect ";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    function getDamageBonusSummary(damageBonus) {
        const { damageBonusSummariesByContext, damageTypes } = CONFIG.A5E;
        const damageType = damageTypes[damageBonus.damageType];

        return localize(damageBonusSummariesByContext[damageBonus.context], {
            formula: damageBonus.formula,
            damageType: damageType
                ? `${damageType.toLowerCase()} damage`
                : "damage",
        });
    }

    function getHealingBonusSummary(healingBonus) {
        const { healingBonusSummariesByContext, healingTypes } = CONFIG.A5E;
        const healingType = healingTypes[healingBonus.healingType];

        return localize(healingBonusSummariesByContext[healingBonus.context], {
            formula: healingBonus.formula,
            healingType: healingType
                ? `${healingType.toLowerCase()} healing`
                : "healing",
        });
    }

    const actor = getContext("actor");

    const globalCurrencyWeightTrackingSelection = game.settings.get(
        "a5e",
        "currencyWeight"
    );

    $: disableMeleeWeaponAttack = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.meleeWeaponAttack"
    );

    $: disableRangedWeaponAttack = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.rangedWeaponAttack"
    );

    $: disableMeleeSpellAttack = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.meleeSpellAttack"
    );

    $: disableRangedSpellAttack = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.rangedSpellAttack"
    );

    $: disableManeuverDC = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.maneuverDC"
    );

    $: disableSpellDC = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.spellDC"
    );

    $: disableAbilityCheckBonusGlobal = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.abilities.check"
    );

    $: disableSavingThrowBonusGlobal = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.abilities.save"
    );

    $: disableSkillCheckBonusGlobal = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.abilities.skill"
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
            <FormSection
                heading="Melee Weapon Attack"
                showWarning={disableMeleeWeaponAttack}
                warning="A5E.validations.warnings.modifiedByEffect"
            >
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.meleeWeaponAttack"
                    value={$actor.system.bonuses.meleeWeaponAttack}
                    disabled={disableMeleeWeaponAttack}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </FormSection>

            <FormSection
                heading="Ranged Weapon Attack"
                showWarning={disableRangedWeaponAttack}
                warning="A5E.validations.warnings.modifiedByEffect"
            >
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.rangedWeaponAttack"
                    value={$actor.system.bonuses.rangedWeaponAttack}
                    disabled={disableRangedWeaponAttack}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </FormSection>

            <FormSection
                heading="Melee Spell Attack"
                showWarning={disableMeleeSpellAttack}
                warning="A5E.validations.warnings.modifiedByEffect"
            >
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.meleeSpellAttack"
                    value={$actor.system.bonuses.meleeSpellAttack}
                    disabled={disableMeleeSpellAttack}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </FormSection>

            <FormSection
                heading="Ranged Spell Attack"
                showWarning={disableRangedSpellAttack}
                warning="A5E.validations.warnings.modifiedByEffect"
            >
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.rangedSpellAttack"
                    value={$actor.system.bonuses.rangedSpellAttack}
                    disabled={disableRangedSpellAttack}
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
            <FormSection
                heading="A5E.ManeuverDCBonus"
                showWarning={disableManeuverDC}
                warning="A5E.validations.warnings.modifiedByEffect"
            >
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.maneuverDC"
                    value={$actor.system.bonuses.maneuverDC}
                    disabled={disableManeuverDC}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </FormSection>

            <FormSection
                heading="A5E.SpellDCBonus"
                showWarning={disableSpellDC}
                warning="A5E.validations.warnings.modifiedByEffect"
            >
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.spellDC"
                    value={$actor.system.bonuses.spellDC}
                    disabled={disableSpellDC}
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
            <FormSection
                heading="A5E.AbilityCheckBonusGlobal"
                showWarning={disableAbilityCheckBonusGlobal}
                warning="A5E.validations.warnings.modifiedByEffect"
            >
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.abilities.check"
                    value={$actor.system.bonuses.abilities.check}
                    disabled={disableAbilityCheckBonusGlobal}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </FormSection>

            <FormSection
                heading="A5E.SavingThrowBonusGlobal"
                showWarning={disableSavingThrowBonusGlobal}
                warning="A5E.validations.warnings.modifiedByEffect"
            >
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.abilities.save"
                    value={$actor.system.bonuses.abilities.save}
                    disabled={disableSavingThrowBonusGlobal}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </FormSection>

            <FormSection
                heading="A5E.SkillCheckBonusGlobal"
                showWarning={disableSkillCheckBonusGlobal}
                warning="A5E.validations.warnings.modifiedByEffect"
            >
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.abilities.skill"
                    value={$actor.system.bonuses.abilities.skill}
                    disabled={disableSkillCheckBonusGlobal}
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
            <h3 class="setting-heading">Damage Bonuses</h3>

            <button
                class="setting-header-button"
                on:click={() => $actor.addBonus("damage")}
            >
                + Add Damage Bonus
            </button>
        </header>

        <ul class="bonus-list">
            {#each Object.entries($actor.system.bonuses.damage ?? {}) as [id, damageBonus] (id)}
                <li class="bonus">
                    <header class="bonus__header">
                        <h3 class="bonus__heading">
                            {damageBonus.label || "New Damage Bonus"}
                        </h3>

                        <ul class="bonus-buttons">
                            <li>
                                <button
                                    class="action-button fas fa-cog"
                                    data-tooltip="A5E.ButtonToolTipConfigure"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        $actor.configureBonus(id, "damage")}
                                />
                            </li>

                            <li>
                                <button
                                    class="action-button fa-solid fa-clone"
                                    data-tooltip="A5E.ButtonToolTipDuplicate"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        $actor.duplicateBonus(id, "damage")}
                                />
                            </li>

                            <li>
                                <button
                                    class="action-button delete-button fas fa-trash"
                                    data-tooltip="A5E.ButtonToolTipDelete"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        $actor.deleteBonus(id, "damage")}
                                />
                            </li>
                        </ul>
                    </header>

                    {#if damageBonus.formula}
                        <p class="bonus__summary">
                            {getDamageBonusSummary(damageBonus)}
                        </p>
                    {/if}
                </li>
            {/each}
        </ul>
    </section>

    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Healing Bonuses</h3>

            <button
                class="setting-header-button"
                on:click={() => $actor.addBonus("healing")}
            >
                + Add Healing Bonus
            </button>
        </header>

        <ul class="bonus-list">
            {#each Object.entries($actor.system.bonuses.healing ?? {}) as [id, healingBonus] (id)}
                <li class="bonus">
                    <header class="bonus__header">
                        <h3 class="bonus__heading">
                            {healingBonus.label || "New Healing Bonus"}
                        </h3>

                        <ul class="bonus-buttons">
                            <li>
                                <button
                                    class="action-button fas fa-cog"
                                    data-tooltip="A5E.ButtonToolTipConfigure"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        $actor.configureBonus(id, "healing")}
                                />
                            </li>

                            <li>
                                <button
                                    class="action-button fa-solid fa-clone"
                                    data-tooltip="A5E.ButtonToolTipDuplicate"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        $actor.duplicateBonus(id, "healing")}
                                />
                            </li>

                            <li>
                                <button
                                    class="action-button delete-button fas fa-trash"
                                    data-tooltip="A5E.ButtonToolTipDelete"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        $actor.deleteBonus(id, "healing")}
                                />
                            </li>
                        </ul>
                    </header>

                    {#if healingBonus.formula}
                        <p class="bonus__summary">
                            {getHealingBonusSummary(healingBonus)}
                        </p>
                    {/if}
                </li>
            {/each}
        </ul>
    </section>

    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Inventory Settings</h3>
        </header>

        <FormSection>
            <Checkbox
                label="A5E.settings.trackInventoryWeight"
                checked={flags?.a5e?.trackInventoryWeight ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.trackInventoryWeight",
                        detail
                    );
                }}
            />
        </FormSection>

        {#if flags?.a5e?.trackInventoryWeight ?? true}
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
                checked={flags.a5e?.includeAbilityModifiersForSkills ?? true}
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

    <!-- svelte-ignore missing-declaration -->
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

    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Triggers</h3>
        </header>

        <button
            class="a5e-button trigger-button"
            on:click={() => {
                $actor.applyPermanentEffects();
                document.activeElement.blur();
            }}
        >
            Re-Calculate Permanent Effects
        </button>
    </section>
</section>

<style lang="scss">
    .a5e-input[type="text"] {
        height: 1.75rem;
    }

    .action-button {
        padding: 0.25rem;
        color: #999;
        border: 0;
        background: none;

        // 17.5 pixels: the width of the largest icon we have
        min-width: 1.09375rem;

        transition: $standard-transition;

        &:hover {
            color: #555;
            transform: scale(1.2);
        }

        &:hover,
        &:focus {
            box-shadow: none;
        }
    }

    .delete-button:hover {
        color: $color-secondary;
    }

    .bonus-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .bonus {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.05);
        border-radius: $border-radius-standard;

        &__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        &__heading {
            font-size: $font-size-sm;
        }

        &__summary {
            font-size: $font-size-xs;
        }
    }

    .bonus-buttons {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin: 0;
        padding: 0;
        list-style: none;
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.5rem 0.25rem 0.125rem;
        border-bottom: 1px solid #ccc;
    }

    .setting-header-button {
        width: fit-content;
        padding: 0;
        margin: 0;
        background: transparent;
        line-height: 1;
        font-size: $font-size-sm;
        color: #7e7960;

        transition: $standard-transition;

        &:focus,
        &:hover {
            box-shadow: none;
            color: rgb(25, 24, 19);
        }
    }

    .trigger-button {
        margin: 0.25rem;
        width: fit-content;
        padding-inline: 0.75rem;
        background: transparent;
        border: 1px solid #4f4f4f;
        transition: $standard-transition;

        &:focus,
        &:hover {
            box-shadow: none;
            background: $color-primary;
            color: $color-light-text;
        }
    }

    .setting-heading {
        font-size: $font-size-sm;
        white-space: nowrap;
    }
</style>
