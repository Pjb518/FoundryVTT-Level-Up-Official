<script lang="ts">
    import type { BaseActorA5e } from "../../../documents/actor/base";
    import type { ConsumerHandlerReturnType } from "../../dataPreparationHelpers/itemActivationConsumers/prepareConsumers";
    import type { ItemA5e } from "../../../documents/item/item";
    import type SpellItemA5e from "../../../documents/item/spell";
    import type { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import { localize } from "#runtime/util/i18n";
    import { getContext } from "svelte";

    import { ResourceConsumptionManager } from "../../../managers/ResourceConsumptionManager";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    export let consumers: ConsumerHandlerReturnType;
    export let spellData: ResourceConsumptionManager.SpellConsumerData;

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
            consumer.spellLevel ?? ($item.isType("spell") ? $item.system?.level : 1) ?? 1;
        disabled = spellLevels.reduce((acc: string[], [level]) => {
            const l = Number(level);
            if (baseLevel > l) acc.push(level);
            if (l > availableCharges) acc.push(level);
            return acc;
        }, []);
    }

    function disableBaseSlotOptions() {
        const baseLevel =
            consumer.spellLevel ?? ($item.isType("spell") ? $item.system?.level : 1) ?? 1;
        disabled = spellLevels.slice(0, baseLevel - 1).map((i) => i[0]);
    }

    function disableSpellSlotOptions() {
        const temp = new Set(spellLevels.map((i) => i[0]));
        const baseLevel =
            consumer.spellLevel ?? ($item.isType("spell") ? $item.system?.level : 1) ?? 1;
        disabled = [
            ...temp.difference(new Set(availableSpellSlots)),
            ...spellLevels.slice(0, baseLevel - 1).map((i) => i[0]),
        ];
    }

    function disableSpellPointOptions() {
        const baseLevel =
            consumer.spellLevel ?? ($item.isType("spell") ? $item.system?.level : 1) ?? 1;
        const cap = Object.entries(A5E.spellLevelCost).reduce((acc, [level, cost]) => {
            if (Number(cost) <= availablePoints) acc = Number(level);
            return acc;
        }, 0);

        disabled = [
            ...spellLevels.slice(0, baseLevel - 1).map((i) => i[0]),
            ...spellLevels.map((i) => i[0]).slice(cap),
        ];
    }

    function getConsumeHeading(type: string) {
        if (spellData.consume === "artifactCharge") {
            return `${localize("A5E.SpellLevel")} (${spellData.charges} charges)`;
        }

        if (spellData.consume === "spellPoint") {
            return `${localize("A5E.SpellLevel")} (${spellData.points} points)`;
        }

        return localize("A5E.SpellLevel");
    }

    function getBaseSpellLevel(): number {
        const defaultLevel =
            consumer.spellLevel ?? ($item.isType("spell") ? $item.system?.level : 1) ?? 1;
        const smallestAvailable = Math.min(...availableSpellSlots.map(Number));

        const selection =
            spellData.consume === "spellSlot"
                ? Math.max(defaultLevel, smallestAvailable)
                : defaultLevel;

        return selection;
    }

    const actionId: string = getContext("actionId");
    const actor: TJSDocument<BaseActorA5e> = getContext("actor");
    const item: TJSDocument<ItemA5e> = getContext("item");

    const { A5E } = CONFIG;
    const { isEmpty } = foundry.utils;

    const consumeOptions: Record<string, any> = {
        artifactCharge: "A5E.ArtifactCharges",
        spellSlot: "A5E.ConsumeSpellSlot",
        spellPoint: "A5E.SpellPoints",
        // inventions: "A5E.SpellInventions",
        noConsume: "A5E.ConsumeNothing",
    };

    let disabled: string[] = [];

    const parts = ResourceConsumptionManager.prepareSpellData(
        $actor,
        $item as SpellItemA5e,
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
        on:updateSelection={({ detail }) => updateSpellResourceData(Number(detail))}
    />

    {#if !isEmpty(consumer)}
        <RadioGroup
            heading="A5E.ConsumeOptions"
            options={Object.entries(consumeOptions)}
            selected={spellData.consume}
            on:updateSelection={({ detail }) => updateConsumeOption(detail)}
        />
    {/if}
{/if}

<!-- Artifact Charges -->
{#if mode === "chargesOnly"}
    <FieldWrapper heading="A5E.ArtifactCharges">
        <div class="u-flex u-gap-md u-align-center">
            <div class="u-flex u-w-10">
                <input
                    class="number-input"
                    type="number"
                    bind:value={spellData.charges}
                />
            </div>

            /

            <div class="u-flex u-w-10">
                <input
                    class="number-input"
                    type="number"
                    value={spellResources.artifactCharges.current ??
                        // @ts-expect-error
                        spellResources.artifactCharges.max}
                    disabled
                />
            </div>
        </div>
    </FieldWrapper>

    <FieldWrapper>
        {#if !isEmpty(consumer)}
            <Checkbox
                label="A5E.ConsumeSpellPoints"
                checked={spellData.consume === "artifactCharge" ? true : false}
                on:updateSelection={({ detail }) => {
                    spellData.consume = detail ? "artifactCharge" : "noConsume";
                }}
            />
        {/if}
    </FieldWrapper>
{/if}

<!-- Spell Points -->
{#if mode === "pointsOnly"}
    <FieldWrapper heading="A5E.SpellPoints">
        <div class="u-flex u-gap-md u-align-center">
            <div class="u-flex u-w-10">
                <input class="number-input" type="number" bind:value={spellData.points} />
            </div>

            /

            <div class="u-flex u-w-10">
                <input
                    class="number-input"
                    type="number"
                    value={spellResources.points.current ?? spellResources.points.max}
                    disabled
                />
            </div>
        </div>
    </FieldWrapper>

    <FieldWrapper>
        {#if !isEmpty(consumer)}
            <Checkbox
                label="A5E.ConsumeSpellPoints"
                checked={spellData.consume === "spellPoint" ? true : false}
                on:updateSelection={({ detail }) => {
                    spellData.consume = detail ? "spellPoint" : "noConsume";
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
        font-size: var(--a5e-text-size-xs);
        text-align: center;

        &:hover {
            border: 1px solid #bbb;
        }
    }
</style>
