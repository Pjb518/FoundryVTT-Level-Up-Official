<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import FieldWrapper from "../FieldWrapper.svelte";

    function deletePrompt() {
        $item.update({
            [`system.actions.${actionId}.prompts`]: {
                [`-=${promptId}`]: null,
            },
        });
    }

    function duplicatePrompt() {
        const newPrompt = foundry.utils.duplicate(prompt);

        $item.update({
            [`system.actions.${actionId}.prompts`]: {
                [foundry.utils.randomID()]: newPrompt,
            },
        });
    }

    export let prompt;
    export let promptId;

    const item = getContext("item");
    const actionId = getContext("actionId");

    $: prompt = prompt;
    $: effects = $item.effects
        .filter((e) => e.flags?.a5e?.transferType === "onUse")
        .map((e) => [e._id, e.name]);
</script>

<FieldWrapper
    heading="A5E.Label"
    buttons={[
        {
            classes:
                "fa-solid fa-clone a5e-field-wrapper__header-button--scale",
            handler: duplicatePrompt,
        },
        {
            classes: "fas fa-trash a5e-field-wrapper__header-button--scale",
            handler: deletePrompt,
        },
    ]}
    --a5e-header-button-color="#bebdb5"
    --a5e-header-button-color-hover="#555"
    --a5e-field-wrapper-button-wrapper-gap="0.75rem"
>
    <input
        type="text"
        value={prompt.label ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.prompts.${promptId}.label`,
                target.value,
            )}
    />
</FieldWrapper>

<FieldWrapper heading="A5E.Effect">
    <select
        class="u-w-fit"
        style="min-width: 9rem;"
        value={prompt.effectId ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.prompts.${promptId}.effectId`,
                target.value,
            )}
    >
        {#each effects as [effectId, effectName]}
            <option value={effectId} selected={prompt?.effectId === effectId}>
                {effectName}
            </option>
        {/each}
    </select>
</FieldWrapper>
