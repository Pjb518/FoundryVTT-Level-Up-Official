<script>
    import { getContext } from "svelte";

    export let dialog;

    function onSubmit() {
        dialog.submit({ confirmDeletion: true });
    }

    function onCancelDeletion() {
        dialog.submit({ confirmDeletion: false });
    }
</script>

<form>
    <p>
        Are you sure you want to delete this spellbook? This will also remove
        all of the spells it contains.
    </p>

    <div class="button-container">
        <button on:click|preventDefault={() => onSubmit()}> Delete </button>

        <button on:click|preventDefault={() => onCancelDeletion()}>
            Cancel
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
