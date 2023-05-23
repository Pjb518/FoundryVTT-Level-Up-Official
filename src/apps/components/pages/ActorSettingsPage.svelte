<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    function addDamageBonus() {
        const damageBonuses = { ...$actor.system.bonuses.damage };

        const newDamageBonus = {
            context: "all",
            damageType: null,
            formula: "",
            label: "New Damage Bonus",
        };

        $actor.update({
            "system.bonuses.damage": {
                ...damageBonuses,
                [foundry.utils.randomID()]: newDamageBonus,
            },
        });
    }

    function configureDamageBonus(id) {
        console.log(`Confiuring ${id}`);
    }

    function deleteDamageBonus(id) {
        $actor.update({
            "system.bonuses.damage": {
                [`-=${id}`]: null,
            },
        });
    }

    function getDamageBonusSummary(damageBonus) {
        return localize("A5E.DamageBonusSummary", {
            formula: damageBonus.formula,
            damageType: damageBonus.damageType,
            context:
                CONFIG.A5E.damageBonusContexts[damageBonus.context] ??
                damageBonus.context,
        });
    }

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
            <h3 class="setting-heading">Damage Bonuses</h3>

            <button class="setting-header-button" on:click={addDamageBonus}>
                + Add Damage Bonus
            </button>
        </header>

        <ul class="damage-bonus-list">
            {#each Object.entries($actor.system.bonuses.damage) as [id, damageBonus] (id)}
                <li class="damage-bonus">
                    <header class="damage-bonus__header">
                        <h3 class="damage-bonus__heading">
                            {damageBonus.label}
                        </h3>

                        <ul class="damage-bonus-buttons">
                            <li>
                                <button
                                    class="action-button fas fa-cog"
                                    data-tooltip="A5E.ButtonToolTipConfigure"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        configureDamageBonus(id)}
                                />
                            </li>

                            <!-- <li>
                                <button
                                    class="action-button fa-solid fa-clone"
                                    data-tooltip="A5E.ButtonToolTipDuplicate"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        duplicateDamageBonus(id)}
                                />
                            </li> -->

                            <li>
                                <button
                                    class="action-button delete-button fas fa-trash"
                                    data-tooltip="A5E.ButtonToolTipDelete"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        deleteDamageBonus(id)}
                                />
                            </li>
                        </ul>
                    </header>

                    {#if damageBonus.formula}
                        <p>{getDamageBonusSummary(damageBonus)}</p>
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

    .damage-bonus-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .damage-bonus {
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 3px;

        &__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        &__heading {
            font-size: 0.833rem;
        }
    }

    .damage-bonus-buttons {
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
        font-size: 0.833rem;
        color: #7e7960;

        transition: all 0.15s ease-in-out;

        &:focus,
        &:hover {
            box-shadow: none;
            color: rgb(25, 24, 19);
        }
    }

    .setting-heading {
        font-size: 0.833rem;
        white-space: nowrap;
    }
</style>
