<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let { actionId, item } = getContext("external").application;
</script>

<form>
    <input
        class="a5e-input a5e-input--character-name"
        type="text"
        name="name"
        value={$item.system.actions[actionId]?.name}
        placeholder="Action Name"
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.name`,
                target.value
            )}
    />
</form>
