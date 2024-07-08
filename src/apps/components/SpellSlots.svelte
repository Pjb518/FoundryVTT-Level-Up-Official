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

    function updateSpellSlots(level, slot) {
        let newCurrentSlots = slot;

        if (slot <= spellResources.slots[level.toString()].current) {
            newCurrentSlots = slot - 1;
        }

        $actor.update({
            [`system.spellResources.slots.${level}.current`]: newCurrentSlots,
        });
    }

    $: spellResources = $actor.system.spellResources;
    $: sheetIsLocked = !$actor.isOwner ? true : $actor.flags?.a5e?.sheetIsLocked ?? true;

    $: maxSpellSlots = getMaxSpellSlots(spellResources, sheetIsLocked);
</script>

{#if level && level !== "0"}
    <div class="spell-slot-wrapper" class:spell-slot-wrapper--locked={sheetIsLocked}>
        {#if sheetIsLocked}
            {#each Array.from({ length: maxSpellSlots }, (_, i) => i + 1) as slot}
                {@const slotExpended =
                    slot > spellResources.slots[level.toString()].current}

                <button
                    class="a5e-spell-slot"
                    class:a5e-spell-slot--expended={slotExpended}
                    class:disable-pointer-events={!$actor.isOwner}
                    on:click={() => updateSpellSlots(level, slot)}
                >
                    <i class="a5e-spell-slot__icon fa-solid fa-star" />
                </button>
            {/each}
        {:else}
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
                on:change={({ target }) => updateSpellSlotMax(Number(target.value))}
            />
        {/if}
    </div>
{/if}

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .a5e-spell-slot {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 0.75rem;
        width: 0.75rem;
        margin: 0;
        padding: 0;
        font-size: var(--a5e-text-size-xs);
        line-height: unset;
        color: white;
        background: #842c2b;
        border-radius: 50%;
        box-shadow:
            0 0 0 1px #e9d7a1,
            0 0 0 2px #956d58,
            0 3px 5px rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(3px);

        &--expended {
            background: rgba(20, 20, 20, 0.6);
            color: rgba(255, 255, 255, 0.25);
        }

        &__icon {
            font-size: 0.375rem;
            line-height: 1;
            margin: 0;
            padding: 0;
        }

        &:focus,
        &:hover {
            box-shadow:
                0 0 0 1px #e9d7a1,
                0 0 0 2px #956d58,
                0 3px 5px rgba(0, 0, 0, 0.4);
        }
    }

    .number-input {
        height: 1rem;
        width: 5ch;
        color: inherit;
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
        font-size: var(--a5e-text-size-xs);

        &:active,
        &:focus {
            box-shadow: none;
        }
    }

    .spell-slot-wrapper {
        display: flex;
        gap: 0.25rem;
        color: var(--a5e-color-text-light);

        &--locked {
            gap: 0.5rem;
        }
    }
</style>
