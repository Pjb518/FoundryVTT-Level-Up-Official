<script lang="ts">
    import type { RollProps } from "./data.ts";

    import { getContext } from "svelte";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import { GenericConfigDialog } from "#view/dialogs/initializers/GenericConfigDialog.svelte.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RollScalingDialog from "#view/dialogs/action/RollScalingDialog.svelte";
    import Section from "#view/snippets/Section.svelte";
    import type { GenericRollData } from "../../../../dataModels/item/actions/ActionRollsDataModel.ts";

    type Props = Omit<RollProps, "roll"> & {
        roll: GenericRollData;
    };

    function configureScaling() {
        let dialog = item.dialogs.rollScaling[rollId];

        if (!dialog) {
            item.dialogs.rollScaling[rollId] = new GenericConfigDialog(
                item,
                `${item.name} Damage Scaling Configuration`,
                RollScalingDialog,
                {
                    actionId,
                    propertyKey: `actions.${actionId}.rolls.${rollId}.scaling`,
                    scalingType: "roll",
                },
                { width: 432 },
            );

            dialog = item.dialogs.rollScaling[rollId];
        }

        dialog.render(true);
    }

    let { deleteRoll, duplicateRoll, roll, rollId }: RollProps = $props();

    let item: any = getContext("item");
    let actionId: string = getContext("actionId");

    const { dieModifiers } = CONFIG.A5E;
</script>

<FieldWrapper
    heading="A5E.Label"
    buttons={[
        {
            classes:
                "icon fa-solid fa-clone a5e-field-wrapper__header-button--scale",
            handler: () => duplicateRoll(actionId, roll),
        },
        {
            classes:
                "icon fas fa-trash a5e-field-wrapper__header-button--scale",
            handler: () => deleteRoll(actionId, rollId),
        },
    ]}
    --a5e-field-wrapper-button-wrapper-gap="0.75rem"
>
    <input
        class="a5e-input a5e-input--slim"
        type="text"
        value={roll.label ?? ""}
        onchange={({ currentTarget }) =>
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.rolls.${rollId}.label`,
                currentTarget.value,
            )}
    />
</FieldWrapper>

<Section
    --a5e-section-body-direction="row"
    --a5e-section-body-wrap="nowrap"
    --a5e-section-body-padding="0"
>
    <FieldWrapper heading="A5E.damage.headings.die.number">
        <input
            class="a5e-input a5e-input--slim a5e-input--small"
            type="number"
            value={roll.die.number || 0}
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    item,
                    `system.actions.${actionId}.rolls.${rollId}.die.number`,
                    Number.parseInt(currentTarget.value, 10),
                )}
        />
    </FieldWrapper>

    <FieldWrapper heading="A5E.damage.headings.die.denom">
        <input
            class="a5e-input a5e-input--slim a5e-input--small"
            type="number"
            value={roll.die.denom || 0}
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    item,
                    `system.actions.${actionId}.rolls.${rollId}.die.denom`,
                    Number.parseInt(currentTarget.value, 10),
                )}
        />
    </FieldWrapper>
</Section>

{#if roll.die.number && roll.die.denom}
    <FieldWrapper heading="Modifier Options">
        <CheckboxGroup
            options={Object.entries(dieModifiers)}
            selected={[...((roll.die.modifiers as Set<string>) ?? [])]}
            onUpdateSelection={(values) =>
                updateDocumentDataFromField(
                    item,
                    `system.actions.${actionId}.rolls.${rollId}.die.modifiers`,
                    values,
                )}
        />
    </FieldWrapper>
{/if}

<FieldWrapper heading="A5E.rollLabels.rollFormula" --a5e-field-wrapper-grow="1">
    <div class="a5e-action-config__flex-container">
        <input
            class="a5e-input a5e-input--slim"
            type="text"
            value={roll.formula ?? ""}
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    item,
                    `system.actions.${actionId}.rolls.${rollId}.formula`,
                    currentTarget.value,
                )}
        />

        <button
            type="button"
            class="a5e-button a5e-button--scaling"
            data-tooltip="A5E.scaling.headings.configureRoll"
            data-tooltip-direction="UP"
            aria-label="A5E.scaling.headings.configureRoll"
            onclick={configureScaling}
        >
            <i class="icon fa-solid fa-arrow-up-right-dots"></i>
        </button>
    </div>
</FieldWrapper>

<Checkbox
    label="A5E.RollDefaultSelection"
    checked={roll.default ?? true}
    onUpdateSelection={(value) => {
        updateDocumentDataFromField(
            item,
            `system.actions.${actionId}.rolls.${rollId}.default`,
            value,
        );
    }}
/>
