<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

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

    <div class="a5e-field-group a5e-field-group--formula">
        <label for={`${actionId}-${rollId}-roll-formula`}>
            {localize("A5E.RollFormula")}
        </label>

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
</section>
