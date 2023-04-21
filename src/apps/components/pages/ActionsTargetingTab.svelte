<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import GenericScalingConfigDialog from "../../dialogs/initializers/GenericScalingConfigDialog";

    import getOrdinalNumber from "../../../utils/getOrdinalNumber";
    import updateAssociatedValues from "../../handlers/updateAssociatedValues";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import AreaConfig from "../itemActionsConfig/AreaConfig.svelte";
    import FormSection from "../FormSection.svelte";
    import TargetRangeIncrement from "../itemActionsConfig/TargetRangeIncrement.svelte";
    import TargetScalingDialog from "../../dialogs/TargetScalingDialog.svelte";

    const item = getContext("item");
    const actionId = getContext("actionId");
    const A5E = CONFIG.A5E;

    function onClickTargetScalingButton() {
        const title = `${$item.name} Target Scaling Configuration`;
        const dialog = new GenericScalingConfigDialog(
            $item,
            actionId,
            title,
            TargetScalingDialog
        );
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
                `system.actions.${actionId}.target.quantity`
            );
        }
    }

    $: action = $item.actions[actionId];
</script>

<section class="action-config action-config__wrapper">
    <section class="action-config__section">
        <header class="action-config__section-header">
            <h2 class="action-config__section-heading">
                {localize("A5E.TabRanges")}
            </h2>

            <button class="add-button" on:click={addRangeIncrement}>
                {localize("A5E.ButtonAddRangeIncrement")}
            </button>
        </header>

        <ul class="section-list">
            {#each Object.entries(action.ranges ?? {}) as [id, range], index (id)}
                <li class="range-increment" data-range-id={id}>
                    <TargetRangeIncrement {index} {id} rangeObject={range} />
                </li>
            {:else}
                <li class="none">None</li>
            {/each}
        </ul>
    </section>

    <AreaConfig {action} {actionId} {item} />

    <section class="action-config__section">
        <header class="action-config__section-header">
            <h2 class="action-config__section-heading">Target</h2>
        </header>

        <FormSection>
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
                                Number(target.value || 0)
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
                        {localize("A5E.ScalingHintCantripTarget", {
                            formula: action.target?.scaling?.formula ?? 0,
                            targetType:
                                A5E.targetTypesPlural[action?.target?.type],
                        })}
                    </small>
                {:else if action.target?.scaling?.mode === "spellLevel"}
                    <small>
                        {#if !action.target?.scaling?.step || action.target?.scaling?.step === 1}
                            {localize("A5E.ScalingHintSpellLevelTarget", {
                                formula: action.target?.scaling?.formula ?? 0,
                                level: getOrdinalNumber($item.system.level),
                                targetType:
                                    A5E.targetTypesPlural[action?.target?.type],
                            })}
                        {:else}
                            {localize(
                                "A5E.ScalingHintSteppedSpellLevelTarget",
                                {
                                    formula:
                                        action.target?.scaling?.formula ?? 0,
                                    step: action.target?.scaling?.step,
                                    level: getOrdinalNumber($item.system.level),
                                    targetType:
                                        A5E.targetTypesPlural[
                                            action?.target?.type
                                        ],
                                }
                            )}
                        {/if}
                    </small>
                {:else if action.target?.scaling?.mode === "spellPoints"}
                    <small>
                        {#if !action.target?.scaling?.step || action.target?.scaling?.step === 1}
                            {localize("A5E.ScalingHintSpellPointTarget", {
                                formula: action.target?.scaling?.formula ?? 0,
                                targetType:
                                    A5E.targetTypesPlural[action?.target?.type],
                            })}
                        {:else}
                            {localize(
                                "A5E.ScalingHintSteppedSpellPointTarget",
                                {
                                    formula:
                                        action.target?.scaling?.formula ?? 0,
                                    step: action.target?.scaling?.step,
                                    targetType:
                                        A5E.targetTypesPlural[
                                            action?.target?.type
                                        ],
                                }
                            )}
                        {/if}
                    </small>
                {:else if ["actionUses", "itemUses"].includes(action.target?.scaling?.mode)}
                    <small>
                        {#if !action.target?.scaling?.step || action.target?.scaling?.step === 1}
                            {localize("A5E.ScalingHintUsesTarget", {
                                formula: action.target?.scaling?.formula ?? 0,
                                targetType:
                                    A5E.targetTypesPlural[action?.target?.type],
                            })}
                        {:else}
                            {localize("A5E.ScalingHintSteppedUsesTarget", {
                                formula: action.target?.scaling?.formula ?? 0,
                                step: action.target?.scaling?.step,
                                targetType:
                                    A5E.targetTypesPlural[action?.target?.type],
                            })}
                        {/if}
                    </small>
                {/if}
            </div>
        </FormSection>
    </section>
</section>

<style lang="scss">
    .range-increment {
        border-radius: 4px;
        font-size: 1rem;
    }

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
        font-size: 1rem;
        background: transparent;
        color: #999;
        border: 1px solid #7a7971;
        border-radius: 3px;
        cursor: pointer;

        transition: all 0.15s ease-in-out;

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
