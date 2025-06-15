<script lang="ts">
    import type { ConsumerHandlerReturnType } from "../../../apps/dataPreparationHelpers/itemActivationConsumers/prepareConsumers.ts";

    import { localize } from "#utils/localization/localize.ts";
    import { getContext } from "svelte";

    import { ResourceConsumptionManager } from "#managers/ResourceConsumptionManager.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    type Props = {
        consumers: ConsumerHandlerReturnType;
        spellData: ResourceConsumptionManager.SpellConsumerData;
    };

    function updateSpellResourceData(level: number) {
        spellData.charges = level;
        spellData.level = level;
        spellData.points = A5E.spellLevelCost[spellData.level];
    }

    function updateConsumeOption(option: any) {
        spellData.consume = option;

        // Update disabled list
        if (option === "artifactCharge") disableArtifactChargeOptions();
        else if (option === "spellSlot") disableSpellSlotOptions();
        else if (option === "spellPoint") disableSpellPointOptions();
        else disableBaseSlotOptions();

        spellData.level = getBaseSpellLevel();
    }

    function disableArtifactChargeOptions() {
        const baseLevel =
            consumer.spellLevel ??
            (item.isType("spell") ? item.system?.level : 1) ??
            1;
        disabled = spellLevels.reduce((acc: string[], [level]) => {
            const l = Number(level);
            if (baseLevel > l) acc.push(level);
            if (l > availableCharges) acc.push(level);
            return acc;
        }, []);
    }

    function disableBaseSlotOptions() {
        const baseLevel =
            consumer.spellLevel ??
            (item.isType("spell") ? item.system?.level : 1) ??
            1;
        disabled = spellLevels.slice(0, baseLevel - 1).map((i) => i[0]);
    }

    function disableSpellSlotOptions() {
        const temp = new Set(spellLevels.map((i) => i[0]));
        const baseLevel =
            consumer.spellLevel ??
            (item.isType("spell") ? item.system?.level : 1) ??
            1;
        disabled = [
            ...temp.difference(new Set(availableSpellSlots)),
            ...spellLevels.slice(0, baseLevel - 1).map((i) => i[0]),
        ];
    }

    function disableSpellPointOptions() {
        const baseLevel =
            consumer.spellLevel ??
            (item.isType("spell") ? item.system?.level : 1) ??
            1;
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

    function getConsumeHeading(type: string) {
        if (spellData.consume === "artifactCharge") {
            return `${localize("A5E.spells.level")} (${spellData.charges} charges)`;
        }

        if (spellData.consume === "spellPoint") {
            return `${localize("A5E.spells.level")} (${spellData.points} points)`;
        }

        return localize("A5E.spells.level");
    }

    function getBaseSpellLevel(): number {
        const defaultLevel =
            consumer.spellLevel ??
            (item.isType("spell") ? item.system?.level : 1) ??
            1;
        const smallestAvailable = Math.min(...availableSpellSlots.map(Number));

        const selection =
            spellData.consume === "spellSlot"
                ? Math.max(defaultLevel, smallestAvailable)
                : defaultLevel;

        return selection;
    }

    let { consumers, spellData = $bindable() }: Props = $props();

    const actionId: string = getContext("actionId");
    const actor: Actor = getContext("actor");
    const item: Item = getContext("item");

    const { A5E } = CONFIG;
    const { isEmpty } = foundry.utils;

    const consumeOptions: Record<string, any> = {
        artifactCharge: "A5E.spells.spellcasting.artifactCharges",
        spellSlot: "A5E.consumers.spellSlot",
        spellPoint: "A5E.spells.spellcasting.points",
        // inventions: "A5E.spells.spellcasting.inventions",
        noConsume: "A5E.consumers.nothing",
    };

    let disabled: string[] = [];

    const parts = ResourceConsumptionManager.prepareSpellData(
        actor,
        item,
        consumers,
        actionId,
    );

    let {
        availableCharges,
        availablePoints,
        availableSpellSlots,
        consumer,
        mode,
        spellLevels,
        spellResources,
    } = parts;

    spellData = parts.spellData;

    if (spellData.consume === "artifactCharge") disableArtifactChargeOptions();
    else if (spellData.consume === "spellPoint") disableSpellPointOptions();
    else if (spellData.consume === "spellSlot") disableSpellSlotOptions();
    else disableBaseSlotOptions();
</script>

{#if ["variable", "slotsOnly"].includes(mode)}
    <!-- Select spell Level -->
    <RadioGroup
        heading={getConsumeHeading(spellData.consume)}
        selected={`${spellData.level}`}
        options={spellLevels}
        allowDeselect={false}
        {disabled}
        onUpdateSelection={(detail) => updateSpellResourceData(Number(detail))}
    />

    {#if !isEmpty(consumer)}
        <RadioGroup
            heading="A5E.consumers.options"
            options={Object.entries(consumeOptions)}
            selected={spellData.consume}
            onUpdateSelection={(detail) => updateConsumeOption(detail)}
        />
    {/if}
{/if}

<!-- Artifact Charges -->
{#if mode === "chargesOnly"}
    <FieldWrapper
        heading="A5E.spells.spellcasting.artifactCharges"
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-header-width="100%"
        --a5e-field-wrapper-item-alignment="center"
    >
        <input
            class="a5e-input a5e-input--small a5e-input--slim"
            type="number"
            bind:value={spellData.charges}
        />

        /

        <input
            class="a5e-input a5e-input--small a5e-input--slim"
            type="number"
            value={spellResources.artifactCharges.current ??
                spellResources.artifactCharges.max}
            disabled
        />
    </FieldWrapper>

    <FieldWrapper>
        {#if !isEmpty(consumer)}
            <Checkbox
                label="A5E.consumers.spellPoints"
                checked={spellData.consume === "artifactCharge" ? true : false}
                onUpdateSelection={(detail) => {
                    spellData.consume = detail ? "artifactCharge" : "noConsume";
                }}
            />
        {/if}
    </FieldWrapper>
{/if}

<!-- Spell Points -->
{#if mode === "pointsOnly"}
    <FieldWrapper
        heading="A5E.spells.spellcasting.points"
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-header-width="100%"
        --a5e-field-wrapper-item-alignment="center"
    >
        <input
            class="a5e-input a5e-input--small a5e-input--slim"
            type="number"
            bind:value={spellData.points}
        />

        /

        <input
            class="a5e-input a5e-input--small a5e-input--slim"
            type="number"
            value={spellResources.points.current ?? spellResources.points.max}
            disabled
        />
    </FieldWrapper>

    <FieldWrapper>
        {#if !isEmpty(consumer)}
            <Checkbox
                label="A5E.consumers.spellPoints"
                checked={spellData.consume === "spellPoint" ? true : false}
                onUpdateSelection={(detail) => {
                    spellData.consume = detail ? "spellPoint" : "noConsume";
                }}
            />
        {/if}
    </FieldWrapper>
{/if}

<style lang="scss">
</style>
