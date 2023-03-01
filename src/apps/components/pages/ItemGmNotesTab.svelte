<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSTinyMCE } from "@typhonjs-fvtt/svelte-standard/component";

    const item = getContext("item");

    function updateSecretDescription(event) {
        const { content } = event.detail;

        $item.update({
            "system.secretDescription": content === "<p></p>" ? "" : content,
        });
    }
</script>

<div class="editor">
    <!-- svelte-ignore missing-declaration (TextEditor) -->
    <TJSTinyMCE
        content={$item.system.secretDescription ||
            localize("A5E.NoSecretDescription")}
        enrichedContent={TextEditor.enrichHTML($item.system.secretDescription, {
            async: false,
        })}
        on:editor:save={(event) => updateSecretDescription(event)}
    />
</div>

<style lang="scss">
    .editor {
        height: 100%;

        // Nudges the edit icon down 1px. Removing this hides the top border for the button.
        --tjs-editor-edit-top: 1px;
    }
</style>
