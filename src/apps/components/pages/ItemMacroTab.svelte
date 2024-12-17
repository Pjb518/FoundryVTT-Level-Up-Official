<script>
    import { getContext } from "svelte";

    import Section from "../Section.svelte";

    import overrideTextAreaBehavior from "../../../utils/overrideTextAreaBehavior";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    let item = getContext("item");
    let actionId = getContext("actionId");

    function updateMacro(value) {
        const key = actionId ? `system.actions.${actionId}.macro` : "system.macro";
        updateDocumentDataFromField($item, key, value.trim());
    }

    $: macro = actionId ? $item.actions.get(actionId)?.macro : $item.system?.macro;
</script>

<article>
    <Section heading="Command">
        <textarea
            class="a5e-code-block__text-area"
            value={macro}
            autocapitalize="off"
            autocomplete="off"
            contenteditable="true"
            autocorrect="off"
            spellcheck={false}
            wrap="soft"
            on:change={({ target }) => updateMacro(target.value)}
            on:keydown={overrideTextAreaBehavior}
        />
    </Section>
</article>

<style lang="scss">
    .a5e-code-block__text-area {
        min-height: 25rem;
        padding: 0.5rem;
        font-family: var(--a5e-mono-font);
        font-size: var(--a5e-text-size-sm);
        color: var(--a5e-code-editor-text-color);
        border: 1px solid hsl(41, 18%, 54%);
        background: var(--a5e-code-editor-background-color);
        resize: none;

        &:focus {
            box-shadow: none;
        }
    }
</style>
