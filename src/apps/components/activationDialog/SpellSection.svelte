<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Tag from "../Tag.svelte";

    export let consumers;
    export let spellData;

    const actionId = getContext("actionId");
    const actor = getContext("actor");
    const item = getContext("item");

    const { A5E } = CONFIG;
    const spellLevels = Object.entries(A5E.spellLevels).slice(1);
    const consumeOptions = {
        spellSlot: "A5E.ConsumeSpellSlot",
        spellPoint: "A5E.SpellPoints",
        noConsume: "A5E.ConsumeNothing",
    };
    let disabled = [];

    function updateLevelAndPoints(level) {
        spellData.level = level;
        spellData.points = A5E.spellLevelCost[spellData.level];
    }

    function updateConsumeOption(option) {
        spellData.consume = option;

        // Update disabled list
        if (option === "spellSlot") disableSpellSlot();
        else if (option === "spellPoint") disableSpellPoint();
        else disabled = [];

        spellData.level = consumer.spellLevel;
    }

    function disableSpellSlot() {
        const temp = new Set(spellLevels.map((i) => i[0]));
        disabled = [
            ...temp.difference(new Set(availableSpellSlots)),
            ...spellLevels.slice(0, consumer.spellLevel - 1).map((i) => i[0]),
        ];
    }

    function disableSpellPoint() {
        const cap = Object.entries(A5E.spellLevelCost).reduce(
            (acc, [level, cost]) => {
                if (Number(cost) <= availablePoints) acc = Number(level);
                return acc;
            },
            0
        );

        disabled = [
            ...spellLevels.slice(0, consumer.spellLevel - 1).map((i) => i[0]),
            ...spellLevels.map((i) => i[0]).slice(cap),
        ];
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

    // $: spellData.level, calculatePoints();
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
            <RadioGroup
                selected={spellData.level}
                options={spellLevels}
                allowDeselect={false}
                {disabled}
                on:updateSelection={({ detail }) =>
                    updateLevelAndPoints(Number(detail))}
            />

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

{#if mode === "pointsOnly"}
    <FormSection>
        <section>
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.SpellPoints")}
            </h3>

            <div class="u-flex u-gap-md u-align-center">
                <div class="u-flex u-w-10">
                    <input
                        class="number-input"
                        type="number"
                        bind:value={spellData.points}
                    />
                </div>

                /

                <div class="u-flex u-w-10">
                    <input
                        class="number-input"
                        type="number"
                        value={spellResources.points.max}
                        disabled
                    />
                </div>
            </div>

            <div class="u-flex u-gap-sm u-align-center">
                <input
                    class="checkbox"
                    id="{actionId}-consume-spell-points"
                    type="checkbox"
                    checked={spellData.consume === "spellPoint" ? true : false}
                    on:change={({ target }) => {
                        spellData.consume = target.checked
                            ? "spellPoints"
                            : "noConsume";
                    }}
                />

                <label class="u-text-sm" for="{actionId}-consume-spell-points">
                    {localize("A5E.ConsumeSpellPoints")}
                </label>
            </div>
        </section>
    </FormSection>
{/if}

<style lang="scss">
    section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
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
