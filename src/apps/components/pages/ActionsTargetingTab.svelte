<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import GenericConfigDialog from "../../dialogs/initializers/GenericConfigDialog";

    import getOrdinalNumber from "../../../utils/getOrdinalNumber";
    import updateAssociatedValues from "../../handlers/updateAssociatedValues";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import AreaConfig from "../itemActionsConfig/AreaConfig.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";
    import TargetRangeIncrement from "../itemActionsConfig/TargetRangeIncrement.svelte";
    import TargetScalingDialog from "../../dialogs/TargetScalingDialog.svelte";

    const item = getContext("item");
    const actionId = getContext("actionId");
    const { A5E } = CONFIG;

    function onClickTargetScalingButton() {
        let dialog = $item.dialogs.targetScaling[actionId];

        if (!dialog) {
            $item.dialogs.targetScaling[actionId] = new GenericConfigDialog(
                $item,
                `${$item.name} Target Scaling Configuration`,
                TargetScalingDialog,
                { actionId },
            );

            dialog = $item.dialogs.targetScaling[actionId];
        }

        dialog.render(true);
    }

    function addRangeIncrement() {
        const newRange = {
            range: "",
        };

        $item.update({
            [`system.actions.${actionId}.ranges`]: {
                ...action.ranges,
                [foundry.utils.randomID()]: newRange,
            },
        });
    }

    function selectTarget(event) {
        const selectedOption = event.target?.selectedOptions[0]?.value;
        if (selectedOption === "null") {
            $item.update({
                [`system.actions.${actionId}`]: {
                    "-=target": null,
                },
            });
        } else {
            updateAssociatedValues(
                $item,
                `system.actions.${actionId}.target.type`,
                selectedOption,
                `system.actions.${actionId}.target.quantity`,
            );
        }
    }

    $: action = $item.actions[actionId];
</script>

<section class="action-config action-config__wrapper">
    <Section
        heading="A5E.TabRanges"
        headerButtons={[
            {
                classes: "add-button",
                label: "A5E.ButtonAddRangeIncrement",
                handler: addRangeIncrement,
            },
        ]}
        --a5e-section-gap="0"
        --a5e-section-margin="0"
    >
        <ul class="a5e-item-list">
            {#each Object.entries(action.ranges ?? {}) as [id, range], index (id)}
                <li class="a5e-item a5e-item--action-config" data-range-id={id}>
                    <TargetRangeIncrement {index} {id} rangeObject={range} />
                </li>
            {:else}
                <li class="none">None</li>
            {/each}
        </ul>
    </Section>

    <AreaConfig {action} {actionId} {item} />

    <Section
        heading="Target"
        --a5e-section-gap="0.5rem"
        --a5e-section-margin="0"
    >
        <FieldWrapper>
            <div class="action-config__component">
                {#if ["creature", "object", "creatureObject"].includes(action.target?.type)}
                    <input
                        class="small-input"
                        type="number"
                        name="targetQuantity"
                        value={action.target?.quantity ?? 1}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                `system.actions.${actionId}.target.quantity`,
                                Number(target.value || 0),
                            )}
                        on:click={({ target }) => target.select()}
                    />
                {/if}

                <select class="u-w-fit" on:change={selectTarget}>
                    <!-- svelte-ignore missing-declaration (foundry) -->
                    <option
                        value={null}
                        selected={foundry.utils.isEmpty(action?.target)}
                    >
                        {localize("A5E.None")}
                    </option>

                    {#each Object.entries(A5E.targetTypes) as [key, name] (key)}
                        <option
                            value={key}
                            selected={action?.target?.type === key}
                        >
                            {localize(name)}
                        </option>
                    {/each}
                </select>

                {#if ["creature", "object", "creatureObject"].includes(action?.target?.type)}
                    <div class="a5e-field-group scaling-button-wrapper">
                        <button
                            class="scaling-button"
                            on:click|preventDefault={onClickTargetScalingButton}
                        >
                            <i
                                class="fa-solid fa-arrow-up-right-dots"
                                data-tooltip="A5E.ConfigureTargetScaling"
                                data-tooltip-direction="UP"
                            />
                        </button>
                    </div>
                {/if}

                {#if action.target?.scaling?.mode === "cantrip"}
                    <small>
                        {localize("A5E.scaling.summaries.cantrip.target", {
                            formula: action.target?.scaling.formula ?? 0,
                            targetType:
                                A5E.targetTypesPlural[action?.target?.type],
                        })}
                    </small>
                {:else if action.target?.scaling?.mode === "spellLevel"}
                    <small>
                        {#if !action.target?.scaling?.step || action.target?.scaling?.step === 1}
                            {localize(
                                "A5E.scaling.summaries.spellLevel.target",
                                {
                                    formula:
                                        action.target?.scaling.formula ?? 0,
                                    level: getOrdinalNumber($item.system.level),
                                    targetType:
                                        A5E.targetTypesPlural[
                                            action?.target?.type
                                        ],
                                },
                            )}
                        {:else}
                            {localize(
                                "A5E.scaling.summaries.steppedSpellLevel.target",
                                {
                                    formula:
                                        action.target?.scaling?.formula ?? 0,
                                    step: action.target?.scaling?.step,
                                    level: getOrdinalNumber($item.system.level),
                                    targetType:
                                        A5E.targetTypesPlural[
                                            action?.target?.type
                                        ],
                                },
                            )}
                        {/if}
                    </small>
                {:else if action.target?.scaling?.mode === "spellPoints"}
                    <small>
                        {#if !action.target?.scaling?.step || action.target?.scaling?.step === 1}
                            {localize(
                                "A5E.scaling.summaries.spellPoint.target",
                                {
                                    formula:
                                        action.target?.scaling.formula ?? 0,
                                    targetType:
                                        A5E.targetTypesPlural[
                                            action?.target?.type
                                        ],
                                },
                            )}
                        {:else}
                            {localize(
                                "A5E.scaling.summaries.steppedSpellPoint.target",
                                {
                                    formula:
                                        action.target?.scaling?.formula ?? 0,
                                    step: action.target?.scaling?.step,
                                    targetType:
                                        A5E.targetTypesPlural[
                                            action?.target?.type
                                        ],
                                },
                            )}
                        {/if}
                    </small>
                {:else if ["actionUses", "itemUses"].includes(action.target?.scaling?.mode)}
                    <small>
                        {#if !action.target?.scaling?.step || action.target?.scaling?.step === 1}
                            {localize("A5E.scaling.summaries.uses.target", {
                                formula: action.target?.scaling.formula ?? 0,
                                targetType:
                                    A5E.targetTypesPlural[action?.target?.type],
                            })}
                        {:else}
                            {localize(
                                "A5E.scaling.summaries.steppedUses.target",
                                {
                                    formula:
                                        action.target?.scaling.formula ?? 0,
                                    step: action.target?.scaling.step,
                                    targetType:
                                        A5E.targetTypesPlural[
                                            action?.target?.type
                                        ],
                                },
                            )}
                        {/if}
                    </small>
                {/if}
            </div>
        </FieldWrapper>
    </Section>
</section>

<style lang="scss">
    .section-list {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        gap: 0.25rem;
        list-style: none;
    }

    .scaling-button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1.625rem;
        width: 1.625rem;
        padding: 0;
        margin: 0;
        font-size: $font-size-md;
        background: transparent;
        color: #999;
        border: 1px solid #7a7971;
        border-radius: $border-radius-standard;
        cursor: pointer;

        transition: $standard-transition;

        i {
            margin: 0;
        }

        &:focus,
        &:hover {
            color: #555;
        }
    }

    .scaling-button-wrapper {
        justify-content: flex-end;
    }
</style>
