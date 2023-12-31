<script>
    import { getContext } from "svelte";

    import FormSection from "../FormSection.svelte";

    import determineIfPropertyModifiedByEffect from "../../../utils/determineIfPropertyModifiedByEffect ";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    // function getDamageBonusSummary(damageBonus) {
    //     const { damageBonusSummariesByContext, damageTypes } = CONFIG.A5E;
    //     const damageType = damageTypes[damageBonus.damageType];

    //     // TODO: Granular-ize this in the future
    //     return localize(damageBonusSummariesByContext["all"], {
    //         formula: damageBonus.formula,
    //         damageType: damageType
    //             ? `${damageType.toLowerCase()} damage`
    //             : "damage",
    //     });
    // }

    // function getHealingBonusSummary(healingBonus) {
    //     const { healingBonusSummariesByContext, healingTypes } = CONFIG.A5E;
    //     const healingType = healingTypes[healingBonus.healingType];

    //     // TODO: Granular-ize this in the future
    //     return localize(
    //         healingBonusSummariesByContext[healingBonus.healingType],
    //         {
    //             formula: healingBonus.formula,
    //             healingType: healingType
    //                 ? `${healingType.toLowerCase()} healing`
    //                 : "healing",
    //         },
    //     );
    // }

    function getBonusSectionHeader(bonusType) {
        switch (bonusType) {
            case "abilities":
                return "Ability Bonuses";
            case "damage":
                return "Damage Bonuses";
            case "healing":
                return "Healing Bonuses";
            case "skills":
                return "Skill Bonuses";
        }
    }

    function getAddButtonLabelForBonus(bonusType) {
        switch (bonusType) {
            case "abilities":
                return "+ Add Ability Bonus";
            case "damage":
                return "+ Add Damage Bonus";
            case "healing":
                return "+ Add Healing Bonus";
            case "skills":
                return "+ Add Skill Bonus";
        }
    }

    function getDefaultBonusName(bonusType) {
        switch (bonusType) {
            case "abilities":
                return "New Ability Bonus";
            case "damage":
                return "New Damage Bonus";
            case "healing":
                return "New Healing Bonus";
            case "skills":
                return "New Skill Bonus";
        }
    }

    const actor = getContext("actor");

    const bonusCategories = ["abilities", "damage", "healing", "skills"];

    let rightClickConfigure =
        game.settings.get("a5e", "itemRightClickConfigure") ?? false;

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
        <header class="a5e-section-header">
            <h3 class="a5e-section-header__heading">Global Bonuses</h3>
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

    {#each bonusCategories as bonusType}
        <section>
            <header class="a5e-section-header a5e-section-header--bonus-list">
                <h3 class="a5e-section-header__heading">
                    {getBonusSectionHeader(bonusType)}
                </h3>

                <button
                    class="a5e-section-header__button"
                    on:click={() => $actor.addBonus(bonusType)}
                >
                    {getAddButtonLabelForBonus(bonusType)}
                </button>
            </header>

            <ul class="a5e-item-list a5e-item-list--bonuses">
                {#each Object.entries($actor.system.bonuses[bonusType] ?? {}) as [id, bonus] (id)}
                    <li
                        class="a5e-item a5e-item--bonus"
                        on:auxclick={() => {
                            if (rightClickConfigure)
                                $actor.configureBonus(id, bonusType);
                        }}
                    >
                        <img class="a5e-item__img" src={bonus.img} alt="" />

                        <h3 class="a5e-item__name">
                            {bonus.label || getDefaultBonusName(bonusType)}
                        </h3>

                        {#if !determineIfPropertyModifiedByEffect($actor, `system.bonuses.${bonusType}.${id}`)}
                            <ul class="bonus-buttons">
                                <li>
                                    <button
                                        class="action-button fas fa-cog"
                                        data-tooltip="A5E.ButtonToolTipConfigure"
                                        data-tooltip-direction="UP"
                                        on:click|stopPropagation={() =>
                                            $actor.configureBonus(
                                                id,
                                                bonusType,
                                            )}
                                    />
                                </li>

                                <li>
                                    <button
                                        class="action-button fa-solid fa-clone"
                                        data-tooltip="A5E.ButtonToolTipDuplicate"
                                        data-tooltip-direction="UP"
                                        on:click|stopPropagation={() =>
                                            $actor.duplicateBonus(
                                                id,
                                                bonusType,
                                            )}
                                    />
                                </li>

                                <li>
                                    <button
                                        class="action-button delete-button fas fa-trash"
                                        data-tooltip="A5E.ButtonToolTipDelete"
                                        data-tooltip-direction="UP"
                                        on:click|stopPropagation={() =>
                                            $actor.deleteBonus(id, bonusType)}
                                    />
                                </li>
                            </ul>
                        {/if}
                    </li>
                {/each}
            </ul>
        </section>
    {/each}
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
