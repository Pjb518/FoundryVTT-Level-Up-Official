<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSTinyMCE } from "@typhonjs-fvtt/svelte-standard/component";

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

    $: content = content || newLabel;
    // if (updatePath.includes("secretDescription")) {
    //     $: content = content || localize("A5E.NoSecretDescription");
    // } else if (updatePath.includes("unidentifiedDescription")) {
    //     $: content = content || localize("A5E.NoUnidentifiedDescription");
    // } else {
    //     $: content = content || localize("A5E.NoDescription");
    // }
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
    .editor {
        height: 100%;

        // Nudges the edit icon down 1px. Removing this hides the top border for the button.
        --tjs-editor-edit-top: 1px;
    }
</style>
