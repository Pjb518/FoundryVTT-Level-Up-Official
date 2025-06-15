<script lang="ts">
    import type { RollProps } from "./data.ts";

    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";
    import { getOrdinalNumber } from "#utils/getOrdinalNumber.ts";
    import { prepareScalingSummary } from "#utils/view/helpers/prepareScalingSummary.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import { GenericConfigDialog } from "#view/dialogs/initializers/GenericConfigDialog.svelte.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    import RollScalingDialog from "#view/dialogs/action/RollScalingDialog.svelte";

    function configureScaling() {
        let dialog = item.dialogs.rollScaling[rollId];

        if (!dialog) {
            item.dialogs.rollScaling[rollId] = new GenericConfigDialog(
                item,
                `${item.name} Damage Scaling Configuration`,
                RollScalingDialog,
                { actionId, rollId },
                { width: 432 },
            );

            dialog = item.dialogs.rollScaling[rollId];
        }

        dialog.render(true);
    }

    let { deleteRoll, duplicateRoll, roll, rollId }: RollProps = $props();

    let item: any = getContext("item");
    let actionId: string = getContext("actionId");

    const { damageTypes } = CONFIG.A5E;

    let scalingSummary = $derived(
        prepareScalingSummary("damage", roll?.scaling, {
            damageType: damageTypes[roll.damageType],
            level: getOrdinalNumber(item.system.level ?? 1),
        }),
    );
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
    <FieldWrapper
        heading="A5E.damage.headings.formula"
        hint={scalingSummary}
        --a5e-field-wrapper-grow="1"
    >
        <div class="a5e-action-config__flex-container">
            <input
                class="a5e-input a5e-input--slim"
                id="{actionId}-{rollId}-damage-formula"
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
                class="a5e-button a5e-button--scaling"
                data-tooltip="A5E.scaling.headings.configureDamage"
                data-tooltip-direction="UP"
                aria-label="Configure Scaling"
                onclick={configureScaling}
            >
                <i class="icon fa-solid fa-arrow-up-right-dots"></i>
            </button>
        </div>
    </FieldWrapper>

    <FieldWrapper heading="A5E.damage.headings.type">
        <select
            id="{actionId}-{rollId}-damage-type"
            class="a5e-input a5e-input--slim a5e-input--fit"
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    item,
                    `system.actions.${actionId}.rolls.${rollId}.damageType`,
                    currentTarget.value,
                )}
        >
            <option value={null} selected={roll.damageType === "null"}>
                {localize("A5E.None")}
            </option>

            {#each Object.entries(damageTypes) as [key, name] (key)}
                <option value={key} selected={roll.damageType === key}>
                    {localize(name as string)}
                </option>
            {/each}
        </select>
    </FieldWrapper>
</Section>

<Checkbox
    label="A5E.damage.labels.doubleOnCrit"
    checked={roll.canCrit ?? true}
    onUpdateSelection={(value) => {
        updateDocumentDataFromField(
            item,
            `system.actions.${actionId}.rolls.${rollId}.canCrit`,
            value,
        );
    }}
/>

{#if roll.canCrit ?? true}
    <FieldWrapper
        heading="A5E.damage.headings.bonusOnCrit"
        hint="When you score a critical hit, this damage is added after doubling
    the attack's damage."
    >
        <input
            id="{actionId}-{rollId}-crit-bonus"
            class="a5e-input a5e-input--slim"
            type="text"
            value={roll.critBonus ?? ""}
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    item,
                    `system.actions.${actionId}.rolls.${rollId}.critBonus`,
                    currentTarget.value,
                )}
        />
    </FieldWrapper>
{/if}

<Checkbox
    label="A5E.damage.labels.defaultSelection"
    checked={roll.default ?? true}
    onUpdateSelection={(value) => {
        updateDocumentDataFromField(
            item,
            `system.actions.${actionId}.rolls.${rollId}.default`,
            value,
        );
    }}
/>
