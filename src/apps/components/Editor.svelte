<script>
    import { localize } from "#utils/localization/localize.ts";
    import { TJSProseMirror } from "#standard/component/fvtt/editor";

    export let document;
    export let content;
    export let updatePath;

    function updateEditorContent(event) {
        const { content } = event.detail;

        $document.update({
            [updatePath]: content === "" ? "" : content,
        });
    }

    const enrichOptions = {
        secrets: $document.isOwner,
        relativeTo: $document,
        rollData:
            $document.documentName === "Actor"
                ? $document.getRollData()
                : ($document.actor?.getRollData($document) ?? undefined),
    };

    // const options = {
    //     editable: game.user.isGM || $document.isOwner || false,
    //     enrichOptions,
    //     mceConfig: editorOptions,
    // };

    const descriptionTypes = {
        secretDescription: "A5E.NoSecretDescription",
        unidentifiedDescription: "A5E.NoUnidentifiedDescription",
        description: "A5E.NoDescription",
    };

    let newLabel;

    Object.entries(descriptionTypes).forEach(([type, label]) => {
        if (updatePath.includes(type)) {
            newLabel = localize(label);
        }
    });

    const options = {
        enrichOptions,
        editable: game.user.isGM || $document.isOwner || false,
        styles: {
            "--tjs-editor-toolbar-background":
                "var(--a5e-editor-toolbar-background)",
        },
    };

    content = content || newLabel || localize("A5E.NoDescription");
    let enrichedContent;
</script>

<div class="a5e-editor">
    <TJSProseMirror
        {options}
        bind:content
        bind:enrichedContent
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

    :global(.a5e-editor .tjs-editor .editor-menu button) {
        --color-control-bg: var(--a5e-editor-toolbar-button-background);
    }

    :global(.a5e-editor .editor-enriched) {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        overflow-y: scroll;
    }

    .a5e-editor {
        position: relative;
        overflow-y: hidden;
        height: 100%;
    }
</style>
