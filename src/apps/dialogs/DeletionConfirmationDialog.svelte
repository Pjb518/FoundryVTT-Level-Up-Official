<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import FormSection from "../components/FormSection.svelte";

    export let { dialog, itemDocument } = getContext("#external").application;

    function onSubmit() {
        dialog.submit({ confirmDeletion: true, hideDeleteConfirmation });
    }

    function onCancelDeletion() {
        dialog.submit({ confirmDeletion: false });
    }

    const appId = dialog.id;

    let hideDeleteConfirmation = game.settings.get(
        "a5e",
        "hideDeleteConfirmation"
    );
</script>

<form>
    <FormSection>
        <div class="u-align-center u-flex u-gap-md">
            <input
                class="u-pointer"
                type="checkbox"
                id={`${appId}-toggle-confirmation-dialog-setting`}
                bind:checked={hideDeleteConfirmation}
            />

            <label
                class="u-pointer"
                for={`${appId}-toggle-confirmation-dialog-setting`}
            >
                Don't show this dialog again
            </label>
        </div>

        <small>
            You can reenable this dialog at any time by turning off the 'Hide
            Deletion Confirmation Dialog' system setting.</small
        >
    </FormSection>

    <div class="button-container">
        <button on:click|preventDefault={() => onSubmit()}>
            <i class="fa-solid fa-trash" />
            {`Delete ${itemDocument.type.capitalize()}`}
        </button>

        <button on:click|preventDefault={() => onCancelDeletion()}>
            <i class="fa-solid fa-ban" />
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
