<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSTinyMCE } from "@typhonjs-fvtt/svelte-standard/component";

    export let document;
    export let content;
    export let updatePath;
    export let async = false;

    function updateEditorContent(event) {
        console.log(event);
        const { content } = event.detail;

        $document.update({
            [updatePath]: content === "<p></p>" ? "" : content,
        });
    }

    $: content = content;
    $: enrichedContent = TextEditor.enrichHTML(content, { async });
</script>

<div class="editor">
    <TJSTinyMCE
        {content}
        {enrichedContent}
        on:editor:save={updateEditorContent}
    />
</div>

<style lang="scss">
    .editor {
        height: 100%;

        // Nudges the edit icon down 1px. Removing this hides the top border for the button.
        --tjs-editor-edit-top: 1px;
    }
</style>
