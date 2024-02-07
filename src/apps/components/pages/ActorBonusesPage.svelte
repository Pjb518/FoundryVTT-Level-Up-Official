<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

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
        return localize(
            CONFIG.A5E.bonusLabels[bonusType]?.sectionHeader ?? bonusType,
        );
    }

    function getAddButtonLabelForBonus(bonusType) {
        return localize(
            CONFIG.A5E.bonusLabels[bonusType]?.addButton ?? bonusType,
        );
    }

    function getDefaultBonusName(bonusType) {
        return localize(
            CONFIG.A5E.bonusLabels[bonusType]?.defaultName ?? bonusType,
        );
    }

    const actor = getContext("actor");

    const bonusCategories = Object.keys(CONFIG.A5E.bonusTypes);

    let rightClickConfigure =
        game.settings.get("a5e", "itemRightClickConfigure") ?? true;

    $: disableManeuverDC = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.maneuverDC",
    );

    $: disableSpellDC = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.spellDC",
    );

    // $: grants = [...$actor.grants.values()].map(
    //     (g) => `${g.type}.${g.bonusId}`,
    // );
</script>

<section class="a5e-page-wrapper a5e-page-wrapper--item-list">
    <Section
        heading="Global Bonuses"
        hint="All of the fields in this section accept any values valid in roll formulae."
        --a5e-section-body-gap="0.5rem"
    >
        <div class="global-bonus-container">
            <FieldWrapper
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
            </FieldWrapper>

            <FieldWrapper
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
            </FieldWrapper>
        </div>
    </Section>

    {#each bonusCategories as bonusType}
        <Section
            headerClasses={Object.values($actor.system.bonuses[bonusType] ?? {})
                .length
                ? "a5e-section-header--flat-bottom"
                : ""}
            heading={getBonusSectionHeader(bonusType)}
            headerButtons={[
                {
                    label: getAddButtonLabelForBonus(bonusType),
                    handler: () => $actor.addBonus(bonusType),
                },
            ]}
            --a5e-section-gap="0"
        >
            <ul class="a5e-item-list">
                {#each Object.entries($actor.system.bonuses[bonusType] ?? {}) as [id, bonus] (id)}
                    <li
                        class="a5e-item a5e-item--bonus"
                        on:auxclick={() => {
                            if (
                                rightClickConfigure &&
                                !determineIfPropertyModifiedByEffect(
                                    $actor,
                                    `system.bonuses.${bonusType}.${id}`,
                                )
                            )
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

                                <!-- {#if !grants.includes(`${bonusType}.${id}`)} -->
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
                                <!-- {/if} -->
                            </ul>
                        {/if}
                    </li>
                {/each}
            </ul>
        </Section>
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

        transition: var(--a5e-transition-standard);

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

    // .divider {
    //     border: 0;
    //     border-bottom: 0.5px solid #ccc;
    //     margin: 0;
    // }

    .global-bonus-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
    }
</style>
