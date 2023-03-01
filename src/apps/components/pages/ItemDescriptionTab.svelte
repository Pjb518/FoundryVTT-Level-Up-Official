<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSTinyMCE } from "@typhonjs-fvtt/svelte-standard/component";

    const item = getContext("item");

    function updateDescription(event) {
        const { content } = event.detail;

        $item.update({
            "system.description": content === "<p></p>" ? "" : content,
        });
    }
</script>

<div class="editor">
    <!-- svelte-ignore missing-declaration (TextEditor) -->
    <TJSTinyMCE
        content={$item.system.description || localize("A5E.NoDescription")}
        enrichedContent={TextEditor.enrichHTML($item.system.description, {
            async: false,
        })}
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
