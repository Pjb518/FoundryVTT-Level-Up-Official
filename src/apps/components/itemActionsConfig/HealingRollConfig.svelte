<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import HealingScalingDialog from "../../dialogs/HealingScalingDialog.svelte";
    import Section from "../Section.svelte";

    import getOrdinalNumber from "../../../utils/getOrdinalNumber";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";
    import GenericConfigDialog from "../../dialogs/initializers/GenericConfigDialog";

    function getScalingSummary(roll) {
        const mode = roll.scaling?.mode;
        const formula = roll.scaling?.formula ?? 0;

        const healingType = (
            healingTypes[roll.healingType] ?? healingTypes["healing"]
        ).toLocaleLowerCase();

        // TODO: Provide some means of getting a base spell level for non-spell items.
        const level = getOrdinalNumber($item.system.level ?? 1);
        const step = roll.scaling?.step;

        if (mode === "cantrip") {
            return localize("A5E.scaling.summaries.cantrip.healing", {
                formula,
                healingType,
            });
        }

        if (mode === "spellLevel") {
            if (!step || step === 1) {
                return localize("A5E.scaling.summaries.spellLevel.healing", {
                    formula,
                    level,
                    healingType,
                });
            } else {
                return localize(
                    "A5E.scaling.summaries.steppedSpellLevel.healing",
                    { formula, step, level, healingType },
                );
            }
        }

        if (mode === "spellPoints") {
            if (!roll.scaling?.step || roll.scaling?.step === 1) {
                return localize("A5E.scaling.summaries.spellPoint.healing", {
                    formula,
                    healingType,
                });
            } else {
                return localize(
                    "A5E.scaling.summaries.steppedSpellPoint.healing",
                    { formula, step, healingType },
                );
            }
        }

        if (["actionUses", "itemUses"].includes(mode)) {
            if (!roll.scaling?.step || roll.scaling?.step === 1) {
                return localize("A5E.scaling.summaries.uses.healing", {
                    formula,
                    healingType,
                });
            } else {
                return localize("A5E.scaling.summaries.steppedUses.healing", {
                    formula,
                    step,
                    healingType,
                });
            }
        }

        return null;
    }

    function onClickScalingButton() {
        let dialog = $item.dialogs.rollScaling[rollId];

        if (!dialog) {
            $item.dialogs.rollScaling[rollId] = new GenericConfigDialog(
                $item,
                `${$item.name} Healing Scaling Configuration`,
                HealingScalingDialog,
                { actionId, rollId },
                { width: 432 },
            );

            dialog = $item.dialogs.rollScaling[rollId];
        }

        dialog.render(true);
    }

    const item = getContext("item");
    const actionId = getContext("actionId");

    const { A5E } = CONFIG;
    const { healingTypes } = A5E;

    export let deleteRoll;
    export let duplicateRoll;
    export let roll;
    export let rollId;

    $: scalingSummary = getScalingSummary(roll);
</script>

<FieldWrapper
    heading="A5E.Label"
    buttons={[
        {
            classes:
                "fa-solid fa-clone a5e-field-wrapper__header-button--scale",
            handler: () => duplicateRoll(actionId, roll),
        },
        {
            classes: "fas fa-trash a5e-field-wrapper__header-button--scale",
            handler: () => deleteRoll(actionId, rollId),
        },
    ]}
    --a5e-header-button-color="#bebdb5"
    --a5e-header-button-color-hover="#555"
    --a5e-field-wrapper-button-wrapper-gap="0.75rem"
>
    <input
        type="text"
        value={roll.label ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.label`,
                target.value,
            )}
    />
</FieldWrapper>

<Section --a5e-section-body-direction="row" --a5e-section-body-wrap="nowrap">
    <FieldWrapper heading="A5E.HealingFormula" --a5e-field-wrapper-grow="1">
        <div class="u-flex u-gap-sm u-w-full">
            <input
                type="text"
                value={roll.formula ?? ""}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.rolls.${rollId}.formula`,
                        target.value,
                    )}
            />

            <button
                class="scaling-button"
                on:click|preventDefault={onClickScalingButton}
            >
                <i
                    class="fa-solid fa-arrow-up-right-dots"
                    data-tooltip="A5E.ConfigureDamageScaling"
                    data-tooltip-direction="UP"
                />
            </button>
        </div>
    </FieldWrapper>

    <FieldWrapper heading="A5E.HealingType">
        <select
            id="{actionId}-{rollId}-healing-type"
            class="u-w-fit"
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.healingType`,
                    target.value,
                )}
        >
            {#each Object.entries(healingTypes) as [key, name] (key)}
                <option value={key} selected={roll.healingType === key}>
                    {localize(name)}
                </option>
            {/each}
        </select>
    </FieldWrapper>
</Section>

<Checkbox
    label="A5E.HealingDefaultSelection"
    checked={roll.default ?? true}
    on:updateSelection={({ detail }) => {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.rolls.${rollId}.default`,
            detail,
        );
    }}
/>

<style lang="scss">
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
</style>
