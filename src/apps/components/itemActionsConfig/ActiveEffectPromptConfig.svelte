<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import FormSection from "../FormSection.svelte";

    export let prompt;
    export let promptId;

    const item = getContext("item");
    const actionId = getContext("actionId");

    $: prompt = prompt;
    $: effects = $item.effects
        .filter((e) => e.flags?.a5e?.transferType === "onUse")
        .map((e) => [e._id, e.name]);
</script>

<FormSection
    heading="A5E.Label"
    --background="none"
    --direction="column"
    --grow="1"
    --padding="0"
    --margin="0 4.5rem 0 0"
>
    <input
        type="text"
        value={prompt.label ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.prompts.${promptId}.label`,
                target.value
            )}
    />
</FormSection>

<FormSection
    heading="A5E.Effect"
    --background="none"
    --direction="column"
    --padding="0"
>
    <select
        class="u-w-fit"
        value={prompt.effectId ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.prompts.${promptId}.effectId`,
                target.value
            )}
    >
        {#each effects as [effectId, effectName]}
            <option value={effectId} selected={prompt?.effectId === effectId}>
                {effectName}
            </option>
        {/each}
    </select>
</FormSection>
