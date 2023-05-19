<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import { empty } from "svelte/internal";

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
        if (option === "spellSlot") disableSpellSlotOptions();
        else if (option === "spellPoint") disableSpellPointOptions();
        else if (option === "noConsume") disableBaseSlotOptions();
        else disabled = [];

        spellData.level = consumer.spellLevel;
    }

    function disableBaseSlotOptions() {
        const baseLevel = consumer.spellLevel ?? $item.system?.level ?? 1;
        disabled = spellLevels.slice(0, baseLevel - 1).map((i) => i[0]);
    }

    function disableSpellSlotOptions() {
        const temp = new Set(spellLevels.map((i) => i[0]));
        const baseLevel = consumer.spellLevel ?? $item.system?.level ?? 1;
        disabled = [
            ...temp.difference(new Set(availableSpellSlots)),
            ...spellLevels.slice(0, baseLevel - 1).map((i) => i[0]),
        ];
    }

    function disableSpellPointOptions() {
        const baseLevel = consumer.spellLevel ?? $item.system?.level ?? 1;
        const cap = Object.entries(A5E.spellLevelCost).reduce(
            (acc, [level, cost]) => {
                if (Number(cost) <= availablePoints) acc = Number(level);
                return acc;
            },
            0
        );

        disabled = [
            ...spellLevels.slice(0, baseLevel - 1).map((i) => i[0]),
            ...spellLevels.map((i) => i[0]).slice(cap),
        ];
    }

    // =======================================================
    // Actor data
    let spellResources = $actor.system.spellResources;
    let availablePoints = spellResources.points.current;

    let availableSpellSlots = Object.entries(spellResources.slots).reduce(
        (acc, [level, slot]) => {
            if (slot.max > 0 && slot.current > 0) acc.push(level);
            return acc;
        },
        []
    );

    // =======================================================
    // Consumer data
    const consumer = Object.values(consumers.spell ?? {})?.[0]?.[1] ?? {};
    let mode = consumer.mode ?? "variable";

    spellData.level = consumer.spellLevel ?? $item.system?.level ?? 1;
    spellData.points =
        consumer.points ?? A5E.spellLevelCost[$item.system?.level ?? 1] ?? 1;
    spellData.basePoints = consumer.points ?? 1;
    spellData.baseLevel = consumer.spellLevel ?? 1;

    if (foundry.utils.isEmpty(consumer)) {
        spellData.consume = "noConsume";
    } else {
        spellData.consume =
            mode === "pointsOnly"
                ? "spellPoint"
                : availableSpellSlots.length > 0
                ? "spellSlot"
                : "spellPoint";
    }

    if (spellData.consume === "spellSlot") disableSpellSlotOptions();
    else if (spellData.consume === "noConsume") disableBaseSlotOptions();
    else disableSpellPointOptions();
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

            <!-- svelte-ignore missing-declaration -->
            {#if !foundry.utils.isEmpty(consumer)}
                <!-- Select Consume Option -->
                <h3 class="u-text-bold u-text-sm">
                    {localize("A5E.ConsumeOptions")}
                </h3>

                <RadioGroup
                    options={Object.entries(consumeOptions)}
                    selected={spellData.consume}
                    on:updateSelection={({ detail }) =>
                        updateConsumeOption(detail)}
                />
            {/if}
        </section>
    </FormSection>
{/if}

{#if mode === "pointsOnly"}
    <FormSection heading="A5E.SpellPoints" --direction="column">
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

        <!-- svelte-ignore missing-declaration -->
        {#if !foundry.utils.isEmpty(consumer)}
            <Checkbox
                label="A5E.ConsumeSpellPoints"
                checked={spellData.consume === "spellPoint" ? true : false}
                on:updateSelection={({ detail }) => {
                    spellData.consume = detail ? "spellPoints" : "noConsume";
                }}
            />
        {/if}
    </FormSection>
{/if}

<style lang="scss">
    section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
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
