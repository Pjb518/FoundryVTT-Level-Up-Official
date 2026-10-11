<script lang="ts">
  import Checkbox from "../snippets/Checkbox.svelte";
  import FieldWrapper from "../snippets/FieldWrapper.svelte";
  import type { DeletionConfirmationDialog } from "./initializers/DeletionConfirmationDialog.svelte.ts";

  type Props = {
    dialog: DeletionConfirmationDialog;
    itemDocument: Item;
    hideDeleteSection: boolean;
    type?: string;
  };

  let { dialog, itemDocument, hideDeleteSection, type }: Props = $props();

  function onSubmit() {
    dialog.submit({ confirmDeletion: true, hideDeleteConfirmation });
  }

  function onCancelDeletion() {
    dialog.submit({ confirmDeletion: false });
  }

  let hideDeleteConfirmation = $state(
    game.settings.get("a5e", "hideDeleteConfirmation") as boolean,
  ) as boolean;
</script>

<form>
  {#if !hideDeleteSection}
    <FieldWrapper
      hint="You can reenable this dialog at any time by turning off the 'Hide Deletion Confirmation Dialog' system setting."
    >
      <Checkbox
        label="Don't show this dialog again"
        checked={hideDeleteConfirmation}
        onUpdateSelection={(checked) => (hideDeleteConfirmation = checked)}
      />
    </FieldWrapper>
  {/if}

  <div class="button-container">
    <button
      type="button"
      class="a5e-button"
      onclick={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <i class="icon fa-solid fa-trash"></i>
      {#if type}
        Delete {type.capitalize()}
      {:else}
        {`Delete ${itemDocument.type.capitalize()}`}
      {/if}
    </button>

    <button
      type="button"
      class="a5e-button"
      onclick={(e) => {
        e.preventDefault();
        onCancelDeletion();
      }}
    >
      <i class="icon fa-solid fa-ban"> </i>
      Cancel Deletion
    </button>
  </div>
</form>

<style lang="scss">
  form {
    display: flex;
    flex-direction: column;
    gap: var(--a5e-spacing-sm);
    padding: var(--a5e-spacing-md);
  }

  .button-container {
    display: flex;
    gap: var(--a5e-spacing-sm);
  }
</style>
