<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import FieldWrapper from "../../snippets/FieldWrapper.svelte";
    import Section from "../../snippets/Section.svelte";

    import { determineIfPropertyModifiedByEffect } from "#utils/determineIfPropertyModifiedByEffect .ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    function getBonusSectionHeader(bonusType: string) {
        return localize(
            CONFIG.A5E.bonusLabels[bonusType]?.sectionHeader ?? bonusType,
        );
    }

    function getAddButtonLabelForBonus(bonusType: string) {
        return localize(
            CONFIG.A5E.bonusLabels[bonusType]?.addButton ?? bonusType,
        );
    }

    function getDefaultBonusName(bonusType: string) {
        return localize(
            CONFIG.A5E.bonusLabels[bonusType]?.defaultName ?? bonusType,
        );
    }

    let actor: any = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");
    let actorStore = $derived(actor.reactive.system);

    const bonusCategories = Object.keys(CONFIG.A5E.bonusTypes);

    let rightClickConfigure =
        game.settings?.get("a5e", "itemRightClickConfigure") ?? true;

    let disableManeuverDC = $derived(
        determineIfPropertyModifiedByEffect(actorStore, "bonuses.maneuverDC"),
    );

    let disableSpellDC = $derived(
        determineIfPropertyModifiedByEffect(actorStore, "bonuses.spellDC"),
    );
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
                    value={actorStore.bonuses.maneuverDC}
                    disabled={disableManeuverDC}
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            actor,
                            currentTarget.name,
                            currentTarget.value,
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
                    value={actorStore.bonuses.spellDC}
                    disabled={disableSpellDC}
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            actor,
                            currentTarget.name,
                            currentTarget.value,
                        )}
                />
            </FieldWrapper>
        </div>
    </Section>

    {#each bonusCategories as bonusType}
        <Section
            headerClasses={Object.values(actorStore.bonuses[bonusType] ?? {})
                .length
                ? "a5e-section-header--flat-bottom"
                : ""}
            heading={getBonusSectionHeader(bonusType)}
            headerButtons={[
                {
                    label: getAddButtonLabelForBonus(bonusType),
                    handler: () => actor.addBonus(bonusType),
                },
            ]}
            --a5e-section-gap="0"
        >
            <ul class="a5e-item-list">
                {#each Object.entries(actorStore.bonuses[bonusType] ?? {}) as [id, bonus] (id)}
                    <li
                        class="a5e-item a5e-item--bonus"
                        onauxclick={() => {
                            if (
                                rightClickConfigure &&
                                !determineIfPropertyModifiedByEffect(
                                    actor,
                                    `system.bonuses.${bonusType}.${id}`,
                                )
                            )
                                actor.configureBonus(id, bonusType);
                        }}
                    >
                        <img class="a5e-item__img" src={bonus.img} alt="" />

                        <h3 class="a5e-item__name">
                            {bonus.label || getDefaultBonusName(bonusType)}
                        </h3>

                        {#if !determineIfPropertyModifiedByEffect(actorStore, `bonuses.${bonusType}.${id}`)}
                            <ul class="bonus-buttons">
                                <li>
                                    <button
                                        class="action-button icon fas fa-cog"
                                        data-tooltip="A5E.ButtonToolTipConfigure"
                                        data-tooltip-direction="UP"
                                        aria-label="Configure"
                                        onclick={(e) => {
                                            e.stopPropagation();
                                            actor.configureBonus(id, bonusType);
                                        }}
                                    ></button>
                                </li>

                                <!-- {#if !grants.includes(`${bonusType}.${id}`)} -->
                                <li>
                                    <button
                                        class="action-button icon fa-solid fa-clone"
                                        data-tooltip="A5E.ButtonToolTipDuplicate"
                                        data-tooltip-direction="UP"
                                        aria-label="Clone"
                                        onclick={(e) => {
                                            e.stopPropagation();
                                            actor.duplicateBonus(id, bonusType);
                                        }}
                                    ></button>
                                </li>

                                <li>
                                    <button
                                        class="action-button delete-button icon fas fa-trash"
                                        data-tooltip="A5E.ButtonToolTipDelete"
                                        data-tooltip-direction="UP"
                                        aria-label="Delete"
                                        onclick={(e) => {
                                            e.stopPropagation();
                                            $actor.deleteBonus(id, bonusType);
                                        }}
                                    ></button>
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
        color: var(--a5e-color-error);
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
