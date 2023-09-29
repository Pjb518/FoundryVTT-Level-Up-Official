<script>
    import { getContext } from "svelte";

    export let { dialog } = getContext("#external").application;

    function onSubmit() {
        dialog.submit({ confirmReset: true });
    }

    function onCancelReset() {
        dialog.submit({ confirmReset: false });
    }
</script>

<form>
    <p>
        Are you sure you want to reset the system's condition icons to their
        defaults? This cannot be undone.
    </p>

    <div class="button-container">
        <button on:click|preventDefault={() => onSubmit()}>
            Reset Icons
        </button>

        <button on:click|preventDefault={() => onCancelReset()}>
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
