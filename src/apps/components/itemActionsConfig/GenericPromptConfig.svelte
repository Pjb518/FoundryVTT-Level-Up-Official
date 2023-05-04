<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const actionId = getContext("actionId");

    export let prompt;
    export let promptId;
</script>

<section class="action-config__wrapper">
    <div class="a5e-field-group a5e-field-group--label">
        <label for="{actionId}-{promptId}-label">
            {localize("A5E.Label")}
        </label>

        <input
            id="{actionId}-{promptId}-label"
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
        <label for="{actionId}-{promptId}-roll-formula">
            {localize("A5E.RollFormula")}
        </label>

        <input
            id="{actionId}-{promptId}-roll-formula"
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

    <div class="a5e-field-group a5e-field-group--checkbox">
        <input
            id="{actionId}-{promptId}-default"
            class="checkbox"
            type="checkbox"
            checked={prompt.default ?? true}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.prompts.${promptId}.default`,
                    target.checked
                )}
        />

        <label for="{actionId}-{promptId}-default">
            {localize("A5E.PromptDefaultSelection")}
        </label>
    </div>
</section>

<style lang="scss">
    .checkbox {
        margin: 0;
    }
</style>
