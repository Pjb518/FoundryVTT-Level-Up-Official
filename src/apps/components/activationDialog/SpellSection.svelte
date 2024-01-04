<script>
    import { localize } from "#runtime/svelte/helper";
    import { getContext } from "svelte";

    import getActionScalingModes from "../../../utils/getActionScalingModes";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    export let consumers;
    export let spellData;

    const actionId = getContext("actionId");
    const actor = getContext("actor");
    const item = getContext("item");

    const { A5E } = CONFIG;
    const action = $item.actions[actionId];
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
            0,
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
        [],
    );

    // =======================================================
    // Consumer data
    const consumer = Object.values(consumers.spell ?? {})?.[0]?.[1] ?? {};
    let mode = consumer.mode ?? "variable";

    spellData.level = consumer.spellLevel ?? $item.system?.level ?? 1;
    spellData.points =
        consumer.points ?? A5E.spellLevelCost[$item.system?.level] ?? 1;
    spellData.basePoints = consumer.points ?? 1;
    spellData.baseLevel = consumer.spellLevel ?? $item.system.level ?? 1;

    if (foundry.utils.isEmpty(consumer)) {
        spellData.consume = "noConsume";

        // Set up mode based on scaling type if consumer is empty
        const scalingTypes = getActionScalingModes(action);
        if (scalingTypes.size) {
            if (scalingTypes.has("spellPoints")) mode = "pointsOnly";
            else if (scalingTypes.has("spellSlots")) mode = "spellsOnly";

            // Set base points and level to 0 since no consumer data is available
            spellData.basePoints = 0;
        }
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
    <FieldWrapper
        heading={spellData.consume === "spellPoint"
            ? `${localize("A5E.SpellLevel")} ($${spellData.points} Points)`
            : localize("A5E.SpellLevel")}
    >
        <!-- Select spell Level -->
        <RadioGroup
            selected={spellData.level}
            options={spellLevels}
            allowDeselect={false}
            {disabled}
            on:updateSelection={({ detail }) =>
                updateLevelAndPoints(Number(detail))}
        />
    </FieldWrapper>

    <!-- svelte-ignore missing-declaration -->
    {#if !foundry.utils.isEmpty(consumer)}
        <FieldWrapper heading="A5E.ConsumeOptions">
            <RadioGroup
                options={Object.entries(consumeOptions)}
                selected={spellData.consume}
                on:updateSelection={({ detail }) => updateConsumeOption(detail)}
            />
        </FieldWrapper>
    {/if}
{/if}

{#if mode === "pointsOnly"}
    <FieldWrapper heading="A5E.SpellPoints" --direction="column">
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
    </FieldWrapper>

    <FieldWrapper>
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
    </FieldWrapper>
{/if}

<style lang="scss">
    .number-input {
        background: transparent;
        border: 1px solid #bbb;
        height: 1.125rem;
        width: 7ch;
        font-size: $font-size-xs;
        text-align: center;

        &:hover {
            border: 1px solid #bbb;
        }
    }
</style>
