<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
  import { TJSTinyMCE } from "@typhonjs-fvtt/svelte-standard/component";

  const item = getContext("item");

  function updateGmNotes(event) {
    const { content } = event.detail;

    $item.update({
      "system.gmNotes": content === "<p></p>" ? "" : content,
    });
  }
</script>

<div class="editor">
  <!-- svelte-ignore missing-declaration (TextEditor) -->
  <TJSTinyMCE
    content={$item.system.gmNotes || localize("A5E.NoGmNotes")}
    enrichedContent={TextEditor.enrichHTML($item.system.gmNotes, {
      async: false,
    })}
    on:editor:save={(event) => updateGmNotes(event)}
  />
</div>

<style lang="scss">
  .editor {
    height: 100%;

    // Nudges the edit icon down 1px. Removing this hides the top border for the button.
    --tjs-editor-edit-top: 1px;
  }
</style>
