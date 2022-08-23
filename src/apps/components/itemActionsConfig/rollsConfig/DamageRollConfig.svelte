<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
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
    <label for={`${actionId}-${rollId}-damage-formula`}> Damage Formula </label>

    <input
        id={`${actionId}-${rollId}-damage-formula`}
        name={`${actionId}-${rollId}-damage-formula`}
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

<div>
    <label for={`${actionId}-${rollId}-damage-type`}>Damage Type</label>

    <select
        id={`${actionId}-${rollId}-damage-type`}
        class="u-w-fit"
        name={`${actionId}-${rollId}-damage-type`}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.damageType`,
                target.value
            )}
    >
        <option value={null} selected={roll.damageType === "null"}>
            {localize("A5E.None")}
        </option>

        {#each Object.entries(CONFIG.A5E.damageTypes) as [key, name] (key)}
            <option value={key} selected={roll.damageType === key}>
                {localize(name)}
            </option>
        {/each}
    </select>
</div>

{#if roll.canCrit ?? true}
    <div>
        <label for={`${actionId}-${rollId}-crit-bonus`}
            >Critical Hit Bonus</label
        >

        <input
            id={`${actionId}-${rollId}-crit-bonus`}
            name={`${actionId}-${rollId}-crit-bonus`}
            type="text"
            value={roll.critBonus ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.critBonus`,
                    target.value
                )}
        />
    </div>
{/if}

<div>
    <label for={`${actionId}-${rollId}-can-crit`}
        >Double Damage on Critical Hit</label
    >

    <input
        id={`${actionId}-${rollId}-can-crit`}
        name={`${actionId}-${rollId}-can-crit`}
        type="checkbox"
        checked={roll.canCrit ?? true}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.canCrit`,
                target.checked
            )}
    />
</div>

<div>
    <label for={`${actionId}-${rollId}-default`}
        >{localize("A5E.DamageDefaultSelection")}</label
    >

    <input
        id={`${actionId}-${rollId}-default`}
        name={`${actionId}-${rollId}-default`}
        type="checkbox"
        checked={roll.default ?? true}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.default`,
                target.checked
            )}
    />
</div>
