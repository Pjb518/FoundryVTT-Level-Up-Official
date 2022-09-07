<script>
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import RollTypeConfig from "./RollTypeConfig.svelte";

    export let action;
    export let actionId;
    export let item;
    export let roll;
    export let rollId;
</script>

<!-- <RollTypeConfig {action} {actionId} {item} {roll} {rollId} /> -->

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

<div class="row">
    <div class="field-group field-group--formula">
        <label for={`${actionId}-${rollId}-attack-bonus`}>Attack Bonus</label>

        <input
            id={`${actionId}-${rollId}-attack-bonus`}
            name={`${actionId}-${rollId}-attack-bonus`}
            type="text"
            value={roll.bonus ?? 0}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.bonus`,
                    target.value
                )}
        />
    </div>

    <div class="field-group">
        <label for={`${actionId}-${rollId}-crit-threshold`}>
            Critical Hit Threshold
        </label>

        <input
            id={`${actionId}-${rollId}-crit-threshold`}
            name={`${actionId}-${rollId}-crit-threshold`}
            type="number"
            value={roll.critThreshold ?? 20}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.critThreshold`,
                    Number(target.value)
                )}
        />
    </div>
</div>

<div class="field-group field-group--checkbox">
    <input
        id={`${actionId}-${rollId}-proficient`}
        class="checkbox"
        name={`${actionId}-${rollId}-proficient`}
        type="checkbox"
        checked={roll.proficient ?? true}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.proficient`,
                target.checked
            )}
    />

    <label for={`${actionId}-${rollId}-proficient`}>
        Add Proficiency Bonus to Attack Roll
    </label>
</div>

<style lang="scss">
    .checkbox {
        margin: 0;
    }

    .field-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        &--checkbox {
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
        }

        &--formula {
            flex-grow: 1;
        }

        &--label {
            margin-right: 5rem;
        }
    }

    .row {
        display: flex;
        gap: 0.5rem;
        width: 100%;
    }
</style>
