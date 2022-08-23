<script>
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import RollTypeConfig from "./RollTypeConfig.svelte";

    export let action;
    export let actionId;
    export let item;
    export let roll;
    export let rollId;
</script>

<RollTypeConfig {action} {actionId} {item} {roll} {rollId} />

<div>
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
