<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSTinyMCE } from "@typhonjs-fvtt/svelte-standard/component";

    const actor = getContext("actor");

    function updateDescription(event) {
        const { content } = event.detail;

        $actor.update({
            "system.details.notes": content === "<p></p>" ? "" : content,
        });
    }

    $: content = $actor.system.details.notes || localize("A5E.NoDescription");
    $: enrichedContent = TextEditor.enrichHTML(content, { async: false });
</script>

<div class="editor">
    <!-- svelte-ignore missing-declaration -->
    <TJSTinyMCE
        {content}
        {enrichedContent}
        on:editor:save={(event) => updateDescription(event)}
    />
</div>

<style lang="scss">
    .editor {
        height: 100%;

        // Nudges the edit icon down 1px. Removing this hides the top border for the button.
        --tjs-editor-edit-top: 1px;
    }
</style>
