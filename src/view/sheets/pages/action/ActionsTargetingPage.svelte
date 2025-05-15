<script lang="ts">
    import type { Action } from "#types/action.js";
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { GenericConfigDialog } from "#view/dialogs/initializers/GenericConfigDialog.svelte.ts";

    import { getOrdinalNumber } from "#utils/getOrdinalNumber.ts";
    import { updateAssociatedValues } from "#utils/view/updateAssociatedValues.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import AreaConfig from "../../components/action/AreaConfig.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";
    import TargetRangeIncrement from "../../components/action/TargetRangeIncrement.svelte";
    import TargetScalingDialog from "#view/dialogs/TargetScalingDialog.svelte";

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
        if (!dialog) {
            dialog.render(true);
            return;
        }

        item.dialogs.targetScaling[actionId] = new GenericConfigDialog(
            item,
            `${$item.name} Target Scaling Configuration`,
            TargetScalingDialog,
            { actionId },
        );
    }

    let actor: any = getContext("actor");
    let item: any = getContext("item");
    let actionId: string = getContext("actionId");
    let action: Action = $derived(item.reactive.actions.get(actionId));

    const { A5E } = CONFIG;
    const { isEmpty } = foundry.utils;
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
        <FieldWrapper></FieldWrapper>
    </Section>
</section>
