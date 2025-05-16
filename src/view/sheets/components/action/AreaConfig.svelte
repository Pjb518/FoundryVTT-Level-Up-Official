<script lang="ts">
    import type { Action } from "#types/action.js";
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import TemplatePreparationManager from "../../../../managers/TemplatePreparationManager.js";
    import { GenericConfigDialog } from "#view/dialogs/initializers/GenericConfigDialog.svelte.ts";

    import { getOrdinalNumber } from "#utils/getOrdinalNumber.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";
    import TemplateScalingDialog from "#view/dialogs/TemplateScalingDialog.svelte";

    function removeArea() {
        item.update({
            [`system.actions.${actionId}`]: {
                "-=area": null,
            },
        });
    }

    let actionId: string = getContext("actionId");
    let item: any = getContext("item");
    let action = $derived(item.reactive.actions.get(actionId));

    const { A5E } = CONFIG;
    const getShapeProperties = TemplatePreparationManager.getShapeProperties;
    const { isEmpty } = foundry.utils;

    let properties = $derived([...getShapeProperties(action.area?.shape)]);
</script>

<Section></Section>
