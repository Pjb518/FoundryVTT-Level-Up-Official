<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import preparePrompts from "../handlers/preparePrompts";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import FormSection from "../components/FormSection.svelte";

    export let { actionId, actorDocument, dialog, itemDocument, options } =
        getContext("#external").application;

    function getDefaultPromptSelections() {
        return Object.entries($item.actions[actionId].prompts).reduce(
            (acc, [key, prompt]) => {
                if (prompt.default) acc.push(key);
                return acc;
            },
            []
        );
    }

    const actor = new TJSDocument(actorDocument);
    const item = new TJSDocument(itemDocument);

    $: action = $item.actions[actionId];

    $: prompts = preparePrompts(action.prompts);

    let selectedPrompts = getDefaultPromptSelections();
</script>

<form>
    <FormSection heading="A5E.PromptsHeading" hint="A5E.PromptsHint">
        <CheckboxGroup
            options={prompts}
            selected={selectedPrompts}
            on:updateSelection={(event) => (selectedPrompts = event.detail)}
        />
    </FormSection>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
    }
</style>
