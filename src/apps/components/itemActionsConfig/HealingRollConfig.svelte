<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import A5E from "../../../modules/config";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const actionId = getContext("actionId");

    export let roll;
    export let rollId;
</script>

<section class="action-config__wrapper">
    <div class="a5e-field-group a5e-field-group--label">
        <label for={`${actionId}-${rollId}-label`}>
            {localize("A5E.Label")}
        </label>

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
        <div class="a5e-field-group a5e-field-group--formula">
            <label for={`${actionId}-${rollId}-healing-formula`}>
                {localize("A5E.HealingFormula")}
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

        <div class="a5e-field-group">
            <label for={`${actionId}-${rollId}-healing-type`}>
                {localize("A5E.HealingType")}
            </label>

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
                {#each Object.entries(A5E.healingTypes) as [key, name] (key)}
                    <option value={key} selected={roll.healingTypes === key}>
                        {localize(name)}
                    </option>
                {/each}
            </select>
        </div>
    </div>

    <div class="a5e-field-group a5e-field-group--checkbox">
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

        <label for={`${actionId}-${rollId}-default`}>
            {localize("A5E.HealingDefaultSelection")}
        </label>
    </div>
</section>

<style lang="scss">
    .checkbox {
        margin: 0;
    }

    .row {
        display: flex;
        gap: 0.5rem;
        width: 100%;
    }
</style>
