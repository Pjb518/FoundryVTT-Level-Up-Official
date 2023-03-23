<script>
    import { createEventDispatcher, getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    export let actionId;
    export let consumers;
    export let item;

    function updateSelection() {
        const data = {
            consumeSpellSlot,
            consumeSpellPoint,
            points,
            selectedLevel,
        };

        dispatch("updateSelection", data);
    }

    let consumer = Object.values(consumers.spell ?? {})[0][1];
    let mode = consumer.mode;
    let selectedLevel = consumer.spellLevel;
    let points = consumer.points ?? 0;

    $: consumeSpellSlot = !availableSlots.length ? false : true;
    $: consumeSpellPoint = availablePoints > 0 ? true : false;
    $: availablePoints = $item.actor.system.spellResources.points.current;
    let availableSlots = Object.entries(
        $item.actor.system.spellResources.slots
    ).reduce((acc, [level, slot]) => {
        if (slot.max > 0 && slot.current > 0)
            acc.push([level, CONFIG.A5E.spellLevels[level]]);

        return acc;
    }, []);

    $: consumeSpellPoint,
        consumeSpellSlot,
        selectedLevel,
        points,
        updateSelection();

    const dispatch = createEventDispatcher();
</script>

{#if ["variable", "slotsOnly"].includes(mode) && availableSlots.length > 0}
    <FormSection>
        <section>
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.SpellLevel")}
            </h3>

            <RadioGroup
                options={availableSlots}
                selected={selectedLevel}
                on:updateSelection={({ detail }) =>
                    (selectedLevel = Number(detail))}
            />

            <div class="u-flex u-gap-sm u-align-center">
                <input
                    class="checkbox"
                    id="{actionId}-consume-spell-slot"
                    type="checkbox"
                    bind:checked={consumeSpellSlot}
                />

                <label for="{actionId}-consume-spell-slot" class="u-text-sm">
                    Consume Resource
                </label>
            </div>
        </section>
    </FormSection>
{/if}

{#if ["variable", "pointsOnly"].includes(mode) && availablePoints > 0}
    <FormSection>
        <section>
            <h3 class="u-text-sm u-text-bold">
                {localize("A5E.SpellPoints")}
            </h3>

            <div class="u-flex u-gap-md">
                <input
                    class="number-input"
                    type="number"
                    min={0}
                    bind:value={points}
                />

                /

                <input
                    class="number-input"
                    type="number"
                    value={availablePoints}
                    disabled
                />
            </div>

            <div class="u-flex u-gap-sm u-align-center">
                <input
                    class="checkbox"
                    id="{actionId}-consume-spell-point"
                    type="checkbox"
                    bind:checked={consumeSpellPoint}
                />

                <label for="{actionId}-consume-spell-point" class="u-text-sm">
                    Consume Resource
                </label>
            </div>

            {#if consumer.points > availablePoints}
                <p class="hint" style="color: #8b6225;">
                    <i class="fa-solid fa-circle-exclamation" />
                    Insufficient spell points.
                </p>
            {/if}
        </section>
    </FormSection>
{/if}

<style lang="scss">
    section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .checkbox {
        margin: 0;
        width: 1rem;
        height: 1rem;
    }

    .number-input {
        background: transparent;
        border: 1px solid #bbb;
        height: 1.125rem;
        width: 7ch;
        font-size: 0.694rem;
        text-align: center;

        &:hover {
            border: 1px solid #bbb;
        }
    }
</style>
