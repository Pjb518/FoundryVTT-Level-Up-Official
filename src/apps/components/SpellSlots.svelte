<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    export let level = 0;

    $: spellResources = $actor.system.spellResources;
    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

{#if level && level !== "0"}
    <div class="spell-slot-wrapper">
        <input
            class="number-input"
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
            class="number-input"
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
    </div>
{/if}

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .number-input {
        height: 1.125rem;
        width: 5ch;
        background: transparent;
        border: 1px solid #bbb;
        text-align: center;
        font-size: $font-size-xs;

        &:hover {
            border: 1px solid #bbb;
        }
    }

    .spell-slot-wrapper {
        display: flex;
        gap: 0.25rem;
    }
</style>
