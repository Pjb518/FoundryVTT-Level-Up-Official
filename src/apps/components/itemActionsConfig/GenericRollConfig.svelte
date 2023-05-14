<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import FormSection from "../FormSection.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const actionId = getContext("actionId");

    export let roll;
    export let rollId;
</script>

<FormSection
    heading="A5E.Label"
    --background="transparent"
    --direction="column"
    --padding="0"
    --margin="0 4.5rem 0 0"
>
    <input
        id="{actionId}-{rollId}-label"
        type="text"
        value={roll.label ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.label`,
                target.value
            )}
    />
</FormSection>

<FormSection
    heading="A5E.RollFormula"
    --background="transparent"
    --label-width="100%"
    --padding="0"
>
    <input
        id="{actionId}-{rollId}-roll-formula"
        type="text"
        value={roll.formula ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.formula`,
                target.value
            )}
    />
</FormSection>

<div class="a5e-field-group a5e-field-group--checkbox">
    <input
        id="{actionId}-{rollId}-default"
        class="checkbox"
        type="checkbox"
        checked={roll.default ?? true}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.default`,
                target.checked
            )}
    />

    <label for="{actionId}-{rollId}-default">
        {localize("A5E.GenericDefaultSelection")}
    </label>
</div>

<style lang="scss">
    .checkbox {
        margin: 0;
    }
</style>
