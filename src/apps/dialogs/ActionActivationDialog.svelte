<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    export let { actionId, actorDocument, dialog, itemDocument, options } =
        getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const item = new TJSDocument(itemDocument);

    $: action = $item.actions[actionId];
</script>

<form>
    <p>{action.name}</p>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
    }
</style>
