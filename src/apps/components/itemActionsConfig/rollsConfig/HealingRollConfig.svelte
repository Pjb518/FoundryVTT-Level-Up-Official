<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const { healingTypes } = CONFIG.A5E;

    export let actionId;
    export let item;
    export let roll;
    export let rollId;
</script>

<div>
    <label for={`${actionId}-${rollId}-healing-formula`}>
        Healing Formula
    </label>

    <input
        id={`${actionId}-${rollId}-healing-formula`}
        name={`${actionId}-${rollId}-healing-formula`}
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
    <label for={`${actionId}-${rollId}-healing-type`}>Healing Type</label>

    <select
        id={`${actionId}-${rollId}-healing-type`}
        class="u-w-fit"
        name={`${actionId}-${rollId}-healing-type`}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.healingType`,
                target.value
            )}
    >
        {#each Object.entries(healingTypes) as [key, name] (key)}
            <option value={key} selected={roll.healingTypes === key}>
                {localize(name)}
            </option>
        {/each}
    </select>
</div>

<div>
    <label for={`${actionId}-${rollId}-default`}
        >{localize("A5E.HealingDefaultSelection")}</label
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
