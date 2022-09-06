<script>
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import RollTypeConfig from "./RollTypeConfig.svelte";

    export let action;
    export let actionId;
    export let item;
    export let roll;
    export let rollId;
</script>

<div class="attack-roll-config-wrapper">
    <div class="row">
        <RollTypeConfig {action} {actionId} {item} {roll} {rollId} />

        <div class="field-wrapper">
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

    <div>
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

    <div class="check-box-wrapper">
        <input
            id={`${actionId}-${rollId}-proficient`}
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
            Add Proficiency Bonus
        </label>
    </div>
</div>

<style lang="scss">
    .attack-roll-config-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        font-size: 0.833rem;
    }

    .check-box-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        input[type="checkbox"] {
            margin: 0;
        }
    }

    .field-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .row {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
</style>
