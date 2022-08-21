<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import actionHasAttackRoll from "../../../utils/actionHasAttackRoll";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    export let action;
    export let actionId;
    export let item;
    export let roll;
    export let rollId;
</script>

<div>
    <label for={`${actionId}-${rollId}-roll-type`}>Roll Type</label>

    <select
        id={`${actionId}-${rollId}-roll-type`}
        class="u-w-fit"
        name={`${actionId}-${rollId}-roll-type`}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.type`,
                target.value
            )}
    >
        {#each Object.entries(CONFIG.A5E.rollTypes) as [key, name] (key)}
            <option
                value={key}
                selected={roll.type === key}
                disabled={key === "attack" && actionHasAttackRoll(action)}
            >
                {localize(name)}
            </option>
        {/each}
    </select>
</div>

<div>
    <label for={`${actionId}-${rollId}-proficient`}>
        Add Proficiency Bonus
    </label>

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

<div>
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
