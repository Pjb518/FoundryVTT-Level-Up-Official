<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Tag from "../Tag.svelte";

    export let consumers;
    export let item;
    export let spellData;

    let consumer = Object.values(consumers.spell ?? {})[0][1];
    let mode = consumer.mode;

    const spellLevels = Object.entries(CONFIG.A5E.spellLevels).slice(1);
    const consumeOptions = {
        consumeSlot: "Consume Slot",
        consumePoint: "Consume Points",
        neither: "Don't Consume",
    };

    $: availablePoints = $item.actor.system.spellResources.points.current;

    let availableSlots = Object.entries(
        $item.actor.system.spellResources.slots
    ).reduce((acc, [level, slot]) => {
        if (slot.max > 0 && slot.current > 0) acc.push(level);

        return acc;
    }, []);

    spellData.consumeSelection =
        mode === "pointsOnly"
            ? "consumePoint"
            : availableSlots.length > 0
            ? "consumeSlot"
            : "consumePoint";
    spellData.selectedLevel = consumer.spellLevel;
    spellData.points =
        CONFIG.A5E.spellLevelCost[spellData.selectedLevel] ?? consumer.points;
    spellData.consumeSpellSlot = !availableSlots.length ? false : true;
    spellData.consumeSpellPoint =
        availablePoints > 0 && !consumeSpellSlot ? true : false;
</script>

{#if availableSlots.length > 0 || availablePoints > 0}
    {#if ["variable", "slotsOnly"].includes(mode)}
        <FormSection>
            <section>
                <h3 class="u-text-bold u-text-sm">
                    {localize("A5E.SpellLevel")}
                </h3>

                <RadioGroup
                    options={Object.entries(consumeOptions)}
                    selected={spellData.consumeSelection}
                    on:updateSelection={({ detail }) =>
                        (spellData.consumeSelection = detail)}
                />

                <ul
                    class=" u-flex u-flex-wrap u-gap-sm u-list-style-none u-m-0 u-p-0 u-text-xs u-w-full"
                >
                    {#each spellLevels as [value, label]}
                        <Tag
                            active={spellData.selectedLevel === value ||
                                spellData.selectedLevel?.toString() === value}
                            {value}
                            {label}
                            disabled={spellData.consumeSelection ===
                                "consumeSlot" &&
                                !availableSlots.includes(value)}
                            on:tagToggle={({ detail }) =>
                                (spellData.selectedLevel = Number(detail))}
                        />
                    {/each}
                </ul>

                {spellData.points}
                {#if spellData.consumeSelection === "consumePoint" && spellData.points > availablePoints}
                    <p class="hint" style="color: #8b6225;">
                        <i class="fa-solid fa-circle-exclamation" />
                        Insufficient spell points.
                    </p>
                {/if}
            </section>
        </FormSection>
    {/if}

    {#if mode === "pointsOnly"}
        <!--  -->
    {/if}
{/if}

<!-- {#if ["variable", "slotsOnly"].includes(mode)}
    <FormSection>
        <section>
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.SpellLevel")}
            </h3>

            <RadioGroup
                options={availableSlots}
                selected={spellData.selectedLevel}
                on:updateSelection={({ detail }) =>
                    (spellData.selectedLevel = Number(detail))}
            />

            <div class="u-flex u-gap-sm u-align-center">
                <input
                    class="checkbox"
                    id="{actionId}-consume-spell-slot"
                    type="checkbox"
                    bind:checked={spellData.consumeSpellSlot}
                />

                <label for="{actionId}-consume-spell-slot" class="u-text-sm">
                    Consume Resource
                </label>
            </div>
        </section>
    </FormSection>
{/if}

{#if ["pointsOnly"].includes(mode)}
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
                    bind:value={spellData.points}
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
                    bind:checked={spellData.consumeSpellPoint}
                />

                <label
                    for="{actionId}-consume-spell-point"
                    class="u-text-sm u-flex-nowrap"
                >
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
{/if} -->
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
