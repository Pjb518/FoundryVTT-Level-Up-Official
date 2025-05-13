<script lang="ts">
    import type { Action } from "#types/action.js";
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { getOrdinalNumber } from "#utils/getOrdinalNumber.ts";
    import { updateAssociatedValues } from "#utils/view/updateAssociatedValues.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

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

<Section heading="A5E.ActivationConfiguration" --a5e-section-body-gap="0.75rem"
></Section>
