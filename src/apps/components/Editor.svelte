<script>
    import { localize } from "#runtime/util/i18n";
    import { TJSTinyMCE, TinyMCEHelper } from "#standard/component/fvtt/editor";

    export let document;
    export let content;
    export let updatePath;

    const descriptionTypes = {
        secretDescription: "A5E.NoSecretDescription",
        unidentifiedDescription: "A5E.NoUnidentifiedDescription",
        description: "A5E.NoDescription",
    };

    function updateEditorContent(event) {
        const { content } = event.detail;

        $document.update({
            [updatePath]: content === "" ? "" : content,
        });
    }

    async function getEnrichedContent() {
        return await TextEditor.enrichHTML($document[updatePath]);
    }

    let newLabel;

    Object.entries(descriptionTypes).forEach(([type, label]) => {
        if (updatePath.includes(type)) {
            newLabel = localize(label);
        }
    });

    const editorOptions = TinyMCEHelper.configStandard();
    editorOptions.toolbar =
        "styles | fontfamily | table | bullist | numlist | image | superscript | subscript | hr | save | link | removeformat | code ";

    const options = {
        editable: game.user.isGM || $document.isOwner || false,
        mceConfig: editorOptions,
    };

    $: (content = content || newLabel) || localize("A5E.NoDescription");
    $: enrichedContent = Promise.resolve(getEnrichedContent())
        .then((content) => content)
        .catch(() => "Error Enriching Content");
</script>

<div class="editor">
    <TJSTinyMCE
        {content}
        {enrichedContent}
        {options}
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
