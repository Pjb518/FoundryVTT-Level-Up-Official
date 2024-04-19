<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let level = 0;

    const actor = getContext("actor");

    function getMaxSpellSlots() {
        if ($actor.type !== "character") {
            return spellResources.slots[level.toString()]?.max;
        }

        if (sheetIsLocked) return spellResources.slots[level.toString()]?.max;
        return spellResources.slots[level.toString()]?.override;
    }

    function updateSpellSlotMax(value) {
        const key =
            $actor.type === "character"
                ? `system.spellResources.slots.${level}.override`
                : `system.spellResources.slots.${level}.max`;

        updateDocumentDataFromField($actor, key, value);
    }

    $: spellResources = $actor.system.spellResources;
    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;

    $: maxSpellSlots = getMaxSpellSlots(spellResources, sheetIsLocked);
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
                    Number(target.value),
                )}
        />
        /
        <input
            class="number-input"
            type="number"
            value={maxSpellSlots}
            placeholder="0"
            min="0"
            disabled={sheetIsLocked}
            on:change={({ target }) => updateSpellSlotMax(Number(target.value))}
        />
    </div>
{/if}

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .number-input {
        height: 1rem;
        width: 5ch;
        color: inherit;
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
        font-size: $font-size-xs;

        &:active,
        &:focus {
            box-shadow: none;
        }
    }

    .spell-slot-wrapper {
        display: flex;
        gap: 0.25rem;
        color: #f6f2eb;
    }
</style>
