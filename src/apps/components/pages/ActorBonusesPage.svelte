<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import FormSection from "../FormSection.svelte";

    import determineIfPropertyModifiedByEffect from "../../../utils/determineIfPropertyModifiedByEffect ";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    function getDamageBonusSummary(damageBonus) {
        const { damageBonusSummariesByContext, damageTypes } = CONFIG.A5E;
        const damageType = damageTypes[damageBonus.damageType];

        // TODO: Granular-ize this in the future
        return localize(damageBonusSummariesByContext["all"], {
            formula: damageBonus.formula,
            damageType: damageType
                ? `${damageType.toLowerCase()} damage`
                : "damage",
        });
    }

    function getHealingBonusSummary(healingBonus) {
        const { healingBonusSummariesByContext, healingTypes } = CONFIG.A5E;
        const healingType = healingTypes[healingBonus.healingType];

        // TODO: Granular-ize this in the future
        return localize(
            healingBonusSummariesByContext[healingBonus.healingType],
            {
                formula: healingBonus.formula,
                healingType: healingType
                    ? `${healingType.toLowerCase()} healing`
                    : "healing",
            },
        );
    }

    const actor = getContext("actor");

    $: disableMeleeWeaponAttack = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.meleeWeaponAttack",
    );

    $: disableRangedWeaponAttack = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.rangedWeaponAttack",
    );

    $: disableMeleeSpellAttack = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.meleeSpellAttack",
    );

    $: disableRangedSpellAttack = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.rangedSpellAttack",
    );

    $: disableManeuverDC = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.maneuverDC",
    );

    $: disableSpellDC = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.spellDC",
    );
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
                            target.value,
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
                            target.value,
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
                            target.value,
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
                            target.value,
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
                            target.value,
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
                            target.value,
                        )}
                />
            </FormSection>
        </div>
    </section>

    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Ability Bonuses</h3>

            <button
                class="setting-header-button"
                on:click={() => $actor.addBonus("abilities")}
            >
                + Add Ability Bonus
            </button>
        </header>

        <ul class="bonus-list">
            {#each Object.entries($actor.system.bonuses.abilities ?? {}) as [id, abilityBonus] (id)}
                <li class="bonus">
                    <header class="bonus__header">
                        <h3 class="bonus__heading">
                            {abilityBonus.label || "New Ability Bonus"}
                        </h3>

                        <ul class="bonus-buttons">
                            <li>
                                <button
                                    class="action-button fas fa-cog"
                                    data-tooltip="A5E.ButtonToolTipConfigure"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        $actor.configureBonus(id, "abilities")}
                                />
                            </li>

                            <li>
                                <button
                                    class="action-button fa-solid fa-clone"
                                    data-tooltip="A5E.ButtonToolTipDuplicate"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        $actor.duplicateBonus(id, "abilities")}
                                />
                            </li>

                            <li>
                                <button
                                    class="action-button delete-button fas fa-trash"
                                    data-tooltip="A5E.ButtonToolTipDelete"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        $actor.deleteBonus(id, "abilities")}
                                />
                            </li>
                        </ul>
                    </header>

                    <!-- {#if abilityBonus.formula}
                        <p class="bonus__summary">
                            {getDamageBonusSummary(abilityBonus)}
                        </p>
                    {/if} -->
                </li>
            {/each}
        </ul>
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
            <h3 class="setting-heading">Skill Bonuses</h3>

            <button
                class="setting-header-button"
                on:click={() => $actor.addBonus("skills")}
            >
                + Add Skill Bonus
            </button>
        </header>

        <ul class="bonus-list">
            {#each Object.entries($actor.system.bonuses.skills ?? {}) as [id, skillBonus] (id)}
                <li class="bonus">
                    <header class="bonus__header">
                        <h3 class="bonus__heading">
                            {skillBonus.label || "New Skill Bonus"}
                        </h3>

                        <ul class="bonus-buttons">
                            <li>
                                <button
                                    class="action-button fas fa-cog"
                                    data-tooltip="A5E.ButtonToolTipConfigure"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        $actor.configureBonus(id, "skills")}
                                />
                            </li>

                            <li>
                                <button
                                    class="action-button fa-solid fa-clone"
                                    data-tooltip="A5E.ButtonToolTipDuplicate"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        $actor.duplicateBonus(id, "skills")}
                                />
                            </li>

                            <li>
                                <button
                                    class="action-button delete-button fas fa-trash"
                                    data-tooltip="A5E.ButtonToolTipDelete"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        $actor.deleteBonus(id, "skills")}
                                />
                            </li>
                        </ul>
                    </header>

                    <!-- {#if skillBonus.formula}
                        <p class="bonus__summary">
                            {getDamageBonusSummary(skillBonus)}
                        </p>
                    {/if} -->
                </li>
            {/each}
        </ul>
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

    .setting-heading {
        font-size: $font-size-sm;
        white-space: nowrap;
    }
</style>
