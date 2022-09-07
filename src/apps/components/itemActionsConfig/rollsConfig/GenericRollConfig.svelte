<script>
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    export let actionId;
    export let item;
    export let roll;
    export let rollId;
</script>

<div class="field-group field-group--label">
    <label for={`${actionId}-${rollId}-label`}>Label</label>

    <input
        id={`${actionId}-${rollId}-label`}
        name={`${actionId}-${rollId}-label`}
        type="text"
        value={roll.label ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.label`,
                target.value
            )}
    />
</div>

<div class="field-group field-group--formula">
    <label for={`${actionId}-${rollId}-roll-formula`}> Roll Formula </label>

    <input
        id={`${actionId}-${rollId}-roll-formula`}
        name={`${actionId}-${rollId}-roll-formula`}
        type="text"
        value={roll.formula ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.formula`,
                target.value
            )}
    />
</div>
