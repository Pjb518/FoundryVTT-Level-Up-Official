<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Tag from "../Tag.svelte";

    export let consumers;
    export let spellData;

    const actor = getContext("actor");
    const item = getContext("item");

    const { A5E } = CONFIG;
    const spellLevels = Object.entries(A5E.spellLevels).slice(1);
    const consumeOptions = {
        spellSlot: "A5E.ConsumeSpellSlot",
        spellPoint: "A5E.ConsumeSpellPoints",
        noConsume: "A5E.ConsumeNothing",
    };
    let disabled = [];

    function calculatePoints() {
        spellData.points = A5E.spellLevelCost[spellData.level];
    }

    function updateConsumeOption(option) {
        spellData.consume = option;

        // Update disabled list
        if (option === "spellSlot") disableSpellSlot();
        else if (option === "spellPoint") disableSpellPoint();
        else disabled = [];
    }

    function disableSpellSlot() {
        const temp = new Set(spellLevels.map((i) => i[0]));
        disabled = [...temp.difference(new Set(availableSpellSlots))];
    }

    function disableSpellPoint() {
        const cap = Object.entries(A5E.spellLevelCost).reduce(
            (acc, [level, cost]) => {
                if (Number(cost) <= availablePoints) acc = Number(level);
                return acc;
            },
            0
        );

        disabled = spellLevels.map((i) => i[0]).slice(cap);
    }

    // =======================================================
    // Actor data
    let spellResources = $actor.system.spellResources;
    let availableSpellSlots = Object.entries(spellResources.slots).reduce(
        (acc, [level, slot]) => {
            if (slot.max > 0 && slot.current > 0) acc.push(level);
            return acc;
        },
        []
    );
    let availablePoints = spellResources.points.current;

    // =======================================================
    // Consumer data
    const consumer = Object.values(consumers.spell ?? {})[0][1];
    let mode = consumer.mode;

    spellData.level = consumer.spellLevel;
    spellData.points = consumer.points;
    spellData.consume =
        mode === "pointsOnly"
            ? "spellPoint"
            : availableSpellSlots.length > 0
            ? "spellSlot"
            : "spellPoint";

    if (spellData.consume === "spellSlot") disableSpellSlot();
    else disableSpellPoint();

    $: spellData.level, calculatePoints();
</script>

{#if ["variable", "spellsOnly"].includes(mode)}
    <FormSection>
        <section>
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.SpellLevel")}

                {#if spellData.consume === "spellPoint"}
                    ({spellData.points} Points)
                {/if}
            </h3>

            <!-- Select spell Level -->
            <ul
                class="
                    u-flex u-flex-wrap u-gap-sm u-list-style-none u-m-0 u-p-0 u-text-xs u-w-full
                "
            >
                {#each spellLevels as [value, label]}
                    <Tag
                        active={spellData.level === value ||
                            spellData.level.toString() === value}
                        {value}
                        {label}
                        disabled={disabled.includes(value)}
                        on:tagToggle={({ detail }) =>
                            (spellData.level = Number(detail))}
                    />
                {/each}
            </ul>

            <!-- Select Consume Option -->
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.ConsumeOptions")}
            </h3>
            <RadioGroup
                options={Object.entries(consumeOptions)}
                selected={spellData.consume}
                on:updateSelection={({ detail }) => updateConsumeOption(detail)}
            />
        </section>
    </FormSection>
{/if}

<style lang="scss">
    section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
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
