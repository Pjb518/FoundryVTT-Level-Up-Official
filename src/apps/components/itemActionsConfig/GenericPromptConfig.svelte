<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const actionId = getContext("actionId");

    export let prompt;
    export let promptId;
</script>

<section class="action-config__wrapper">
    <div class="a5e-field-group a5e-field-group--label">
        <label for={`${actionId}-${promptId}-label`}>
            {localize("A5E.Label")}
        </label>

        <input
            id={`${actionId}-${promptId}-label`}
            name={`${actionId}-${promptId}-label`}
            type="text"
            value={prompt.label ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.prompts.${promptId}.label`,
                    target.value
                )}
        />
    </div>

    <div class="a5e-field-group a5e-field-group--formula">
        <label for={`${actionId}-${promptId}-roll-formula`}>
            {localize("A5E.RollFormula")}
        </label>

        <input
            id={`${actionId}-${promptId}-roll-formula`}
            name={`${actionId}-${promptId}-roll-formula`}
            type="text"
            value={prompt.formula ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.prompts.${promptId}.formula`,
                    target.value
                )}
        />
    </div>

    <div class="a5e-field-group a5e-field-group--formula">
        <label for={`${actionId}-${promptId}-dc`}>
            {localize("A5E.DC")}
        </label>

        <input
            id={`${actionId}-${promptId}-dc`}
            name={`${actionId}-${promptId}-dc`}
            type="text"
            value={prompt.dc ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.prompts.${promptId}.dc`,
                    target.value
                )}
        />
    </div>

    <div class="a5e-field-group ">
        <label for={`${actionId}-${promptId}-save-effect`}>
            {localize("A5E.ItemEffectOnCheck")}
        </label>

        <input
            id={`${actionId}-${promptId}-save-effect`}
            name={`${actionId}-${promptId}-save-effect`}
            type="text"
            value={prompt.onSave ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.prompts.${promptId}.onSave`,
                    target.value
                )}
        />
    </div>
</section>
