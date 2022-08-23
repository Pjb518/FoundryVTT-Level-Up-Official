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
