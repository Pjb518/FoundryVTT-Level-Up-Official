<script lang="ts">
    import FieldWrapper from "./FieldWrapper.svelte";
    import RadioGroup from "./RadioGroup.svelte";
    import Section from "./Section.svelte";

    export let cls: any;
    export let classLevel: number;
    export let clsReturnData: Record<string, any>;

    function getHpRollFormula(): string {
        const dieSize = cls.hitDice.size;
        return `1d${dieSize}`;
    }

    function updateHpValue(value: number | string) {
        if (typeof value === "string") clsReturnData.hpFormula = value;
        else clsReturnData.hpValue = value;

        clsReturnData.leveledHpType = leveledHpType;
    }

    function updateLeveledHpType(value: string) {
        leveledHpType = value;

        if (leveledHpType === "average") {
            updateHpValue(cls.averageHP);
        } else if (leveledHpType === "roll") {
            updateHpValue(getHpRollFormula());
        } else if (leveledHpType === "custom") {
            updateHpValue(customHp);
        }
    }

    // @ts-ignore
    const { classHPTypes } = CONFIG.A5E;

    // TODO: Get default from world settings
    let leveledHpType = "average";
    let rollFormula = getHpRollFormula();
    let customHp = cls.system?.hp?.levels?.[classLevel] ?? 0;

    if (leveledHpType === "average") {
        updateHpValue(cls.averageHP);
    } else if (leveledHpType === "roll") {
        updateHpValue(getHpRollFormula());
    }
</script>

<Section heading="Hit Points Configuration" --a5e-section-body-gap="0.75rem">
    <RadioGroup
        options={Object.entries(classHPTypes)}
        selected={leveledHpType}
        allowDeselect={false}
        on:updateSelection={({ detail }) => {
            updateLeveledHpType(detail);
        }}
    />

    {#if leveledHpType === "average"}
        <div class="roll-formula-preview">
            Average: {cls.averageHP}
        </div>
    {:else if leveledHpType === "roll"}
        <FieldWrapper>
            <input
                class="a5e-input a5e-input--small a5e-input--slim"
                type="text"
                value={rollFormula ?? ""}
                on:change={({ target }) => {
                    // @ts-ignore
                    rollFormula = target?.value;
                    updateHpValue(rollFormula);
                }}
            />
        </FieldWrapper>
    {:else if leveledHpType === "custom"}
        <FieldWrapper>
            <input
                class="a5e-input a5e-input--small a5e-input--slim"
                type="number"
                min="0"
                value={customHp ?? 0}
                on:change={({ target }) => {
                    // @ts-ignore
                    updateHpValue(Number(target?.value));
                }}
            />
        </FieldWrapper>
    {/if}
</Section>

<style lang="scss">
    .roll-formula-preview {
        padding: 0.5rem;
        font-size: var(--a5e-text-size-sm);
        border: 1px solid #7a7971;
        border-radius: 4px;
    }
</style>
