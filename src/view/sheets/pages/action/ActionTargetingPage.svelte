<script lang="ts">
    import type { Action } from "#types/action.js";
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { GenericConfigDialog } from "#view/dialogs/initializers/GenericConfigDialog.svelte.ts";

    import { getOrdinalNumber } from "#utils/getOrdinalNumber.ts";
    import { prepareScalingSummary } from "#utils/view/helpers/prepareScalingSummary.ts";
    import { updateAssociatedValues } from "#utils/view/updateAssociatedValues.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import AreaConfig from "../../components/action/AreaConfig.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";
    import TargetRangeIncrement from "../../components/action/TargetRangeIncrement.svelte";
    import TargetScalingDialog from "#view/dialogs/action/TargetScalingDialog.svelte";

    function addRangeIncrement() {
        const newRange = {
            range: "",
        };

        item.update({
            [`system.actions.${actionId}.ranges`]: {
                ...action.ranges,
                [foundry.utils.randomID()]: newRange,
            },
        });
    }

    function configureScaling() {
        let dialog = item.dialogs.targetScaling[actionId];
        if (dialog) {
            dialog.render(true);
            return;
        }

        item.dialogs.targetScaling[actionId] = new GenericConfigDialog(
            item,
            `${item.name} Target Scaling Configuration`,
            TargetScalingDialog,
            { actionId },
        );
    }

    function selectTarget(event) {
        const selectedOption = event.target?.selectedOptions[0]?.value;
        if (selectedOption === "null") {
            item.update({
                [`system.actions.${actionId}`]: {
                    "-=target": null,
                },
            });
        } else {
            updateAssociatedValues(
                item,
                `system.actions.${actionId}.target.type`,
                selectedOption,
                `system.actions.${actionId}.target.quantity`,
            );
        }
    }

    let actor: any = getContext("actor");
    let item: any = getContext("item");
    let actionId: string = getContext("actionId");
    let action: Action = $derived(item.reactive.actions.get(actionId));

    const { A5E } = CONFIG;
    const { isEmpty } = foundry.utils;

    let scalingSummary = $derived(
        prepareScalingSummary("target", action.target?.scaling, {
            targetType: A5E.targetTypes[action.target?.type ?? ""],
            level: item.reactive.system.level ?? 1,
        }),
    );
</script>

<section class="a5e-page-wrapper">
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
    >
        <ul class="a5e-item-list">
            {#each Object.keys(action.ranges ?? {}) as id, index (id)}
                <li class="a5e-item a5e-item--action-config" data-range-id={id}>
                    <TargetRangeIncrement {index} {id} />
                </li>
            {/each}
        </ul>
    </Section>

    <AreaConfig />

    <Section heading="Target" --a5e-section-gap="0.5rem">
        <FieldWrapper
            --a5e-field-wrapper-direction="row"
            --a5e-field-wrapper-gap="0.5rem"
        >
            {#if ["creature", "object", "creatureObject"].includes(action.target?.type)}
                <input
                    class="a5e-input a5e-input--slim a5e-input--small"
                    type="number"
                    value={action.target?.quantity ?? 1}
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            item,
                            `system.actions.${actionId}.target.quantity`,
                            Number(currentTarget.value || 0),
                        )}
                />
            {/if}

            <select
                class="a5e-input a5e-input--slim a5e-input--fit"
                onchange={selectTarget}
            >
                <option value={null} selected={isEmpty(action?.target)}>
                    {localize("A5E.None")}
                </option>

                {#each Object.entries(A5E.targetTypes) as [key, name] (key)}
                    <option value={key} selected={action?.target?.type === key}>
                        {localize(name as string)}
                    </option>
                {/each}
            </select>

            <button
                class="a5e-button a5e-button--scaling"
                data-tooltip="A5E.scaling.headings.configureTarget"
                data-tooltip-direction="UP"
                aria-label="A5E.scaling.headings.configureTarget"
                onclick={configureScaling}
            >
                <i class="fa-solid fa-arrow-up-right-dots"></i>
            </button>
        </FieldWrapper>

        <small>
            {scalingSummary}
        </small>
    </Section>
</section>
