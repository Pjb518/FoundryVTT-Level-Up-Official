<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const { healingTypes } = CONFIG.A5E;

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

<div class="row">
    <div class="field-group field-group--formula">
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

    <div class="field-group">
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
</div>

<div class="field-group field-group--checkbox">
    <input
        id={`${actionId}-${rollId}-default`}
        class="checkbox"
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

    <label for={`${actionId}-${rollId}-default`}
        >{localize("A5E.HealingDefaultSelection")}</label
    >
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
            margin-right: 4.5rem;
        }

        input[type="text"] {
            width: 100%;
        }
    }

    .row {
        display: flex;
        gap: 0.5rem;
        width: 100%;
    }
</style>
