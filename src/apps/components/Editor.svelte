<script>
    import { localize } from "#runtime/svelte/helper";
    import { TJSTinyMCE } from "#standard/component";

    export let document;
    export let content;
    export let updatePath;
    export let async = false;

    const descriptionTypes = {
        secretDescription: "A5E.NoSecretDescription",
        unidentifiedDescription: "A5E.NoUnidentifiedDescription",
        description: "A5E.NoDescription",
    };

    function updateEditorContent(event) {
        const { content } = event.detail;

        $document.update({
            [updatePath]: content === "<p></p>" ? "" : content,
        });
    }

    let newLabel;

    Object.entries(descriptionTypes).forEach(([type, label]) => {
        if (updatePath.includes(type)) {
            newLabel = localize(label);
        }
    });

    $: (content = content || newLabel) || localize("A5E.NoDescription");
    $: enrichedContent = TextEditor.enrichHTML($document[updatePath], {
        async,
    });
</script>

<div class="editor">
    <TJSTinyMCE
        {content}
        {enrichedContent}
        on:editor:save={updateEditorContent}
    />
</div>

<style lang="scss">
    :global(.tjs-editor .tox.tox-tinymce .tox-edit-area) {
        padding: 0.25rem 0rem;
    }

    :global(.tjs-editor:not(.editor-active) .editor-content) {
        --tjs-editor-content-padding: 0rem 0.25rem;
    }

    .editor {
        height: 100%;

        // Nudges the edit icon down 1px. Removing this hides the top border for the button.
        --tjs-editor-edit-top: 1px;
    }
</style>
