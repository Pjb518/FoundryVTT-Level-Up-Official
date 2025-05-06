<script lang="ts">
    import type { DeletionConfirmationDialog } from "./initializers/DeletionConfirmationDialog.svelte.ts";

    import Checkbox from "../snippets/Checkbox.svelte";
    import FieldWrapper from "../snippets/FieldWrapper.svelte";

    type Props = {
        dialog: DeletionConfirmationDialog;
        itemDocument: Item;
        hideDeleteSection: boolean;
    };

    let { dialog, itemDocument, hideDeleteSection }: Props = $props();

    function onSubmit() {
        dialog.submit({ confirmDeletion: true, hideDeleteConfirmation });
    }

    function onCancelDeletion() {
        dialog.submit({ confirmDeletion: false });
    }

    let hideDeleteConfirmation = $state(
        game.settings.get("a5e", "hideDeleteConfirmation") as boolean,
    );
</script>

<form>
    {#if !hideDeleteSection}
        <FieldWrapper
            hint="You can reenable this dialog at any time by turning off the 'Hide Deletion Confirmation Dialog' system setting."
        >
            <Checkbox
                label="Don't show this dialog again"
                checked={hideDeleteConfirmation}
                updateSelection={(checked) =>
                    (hideDeleteConfirmation = checked)}
            />
        </FieldWrapper>
    {/if}

    <div class="button-container">
        <button
            class="a5e-button"
            onclick={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            <i class="icon fa-solid fa-trash"></i>
            {`Delete ${itemDocument.type.capitalize()}`}
        </button>

        <button
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
        gap: 0.5rem;
        padding: 0.75rem;
    }

    .button-container {
        display: flex;
        gap: 0.5rem;
    }
</style>
