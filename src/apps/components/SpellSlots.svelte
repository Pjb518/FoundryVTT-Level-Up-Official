<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    export let level = 0;

    $: spellResources = $actor.system.spellResources;
    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

{#if level && level !== "0"}
    <input
        class="a5e-footer-group__input"
        class:disable-pointer-events={!$actor.isOwner}
        type="number"
        name="system.spellResources.slots.{level}.current"
        value={spellResources.slots[level.toString()].current}
        placeholder="0"
        min="0"
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $actor,
                target.name,
                Number(target.value)
            )}
    />
    /
    <input
        class="a5e-footer-group__input"
        type="number"
        name="system.spellResources.slots.{level}.max"
        value={spellResources.slots[level.toString()].max}
        placeholder="0"
        min="0"
        disabled={sheetIsLocked}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $actor,
                target.name,
                Number(target.value)
            )}
    />
{/if}

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }
</style>
