<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";

    import AbilityBonusConfigDialog from "#view/components/bonuses/AbilityBonusConfigDialog.svelte";
    import AttackBonusConfigDialog from "#view/components/bonuses/AttackBonusConfigDialog.svelte";
    import DamageBonusConfigDialog from "#view/components/bonuses/DamageBonusConfigDialog.svelte";
    import HealingBonusConfigDialog from "#view/components/bonuses/HealingBonusConfigDialog.svelte";
    import InitiativeBonusConfigDialog from "#view/components/bonuses/InitiativeBonusConfigDialog.svelte";
    import SkillBonusConfigDialog from "#view/components/bonuses/SkillBonusConfigDialog.svelte";

    import CustomTagGroup from "#view/snippets/CustomTagGroup.svelte";
    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    type Props = {
        key: string;
        mode: string;
        optionsList: Record<string, any>;
        value: any;
        onchange: (value: string) => void;
    };

    // Convert value to array if possible
    function convertToArray(value: JSON) {
        try {
            const values = JSON.parse((value ?? "").trim());
            if (Array.isArray(values)) return values;
            return [values];
        } catch {
            return [];
        }
    }

    function convertToObject(value: JSON) {
        try {
            const obj = JSON.parse((value ?? "").trim());
            if (typeof obj !== "object") throw new Error();
            obj.comparisonOperator = obj.comparisonOperator ?? "==";
            obj.comparisonValue = obj.comparisonValue ?? "";
            obj.positiveValue = obj.positiveValue ?? "";
            obj.negativeValue = obj.negativeValue ?? "";
            return obj;
        } catch {
            return {
                comparisonOperator: "==",
                comparisonValue: "",
                positiveValue: "",
                negativeValue: "",
            };
        }
    }

    function updateObjectValue(obj: Record<string, any>) {
        const returnValue = JSON.stringify(obj);
        onchange(returnValue);
    }

    let { key, mode, optionsList, value, onchange }: Props = $props();

    let conditionalObj = $state(convertToObject(value as JSON));

    const MODES = CONFIG.A5E.ACTIVE_EFFECT_MODES;
    let componentType = $state(optionsList[key]?.type ?? "DEFAULT");
</script>

<!-- Adding Components Based on Type AND MODE -->
{#if mode === MODES.CONDITIONAL}
    <div class="a5e-conditional-container">
        If original value is

        <select
            class="a5e-input a5e-input--slim a5e-input--fit"
            bind:value={conditionalObj.comparisonOperator}
            onchange={() => updateObjectValue(conditionalObj)}
        >
            <option value="==">equal to</option>
            <option value="!==">not equal</option>
            <option value=">">greater than</option>
            <option value=">=">greater than or equal to</option>
            <option value="<">less than</option>
            <option value="<=">less than or equal to</option>
        </select>

        <input
            class="a5e-input a5e-input--slim a5e-conditional-input"
            type="text"
            bind:value={conditionalObj.comparisonValue}
            onchange={() => updateObjectValue(conditionalObj)}
        />

        then change to

        <input
            class="a5e-input a5e-input--slim a5e-conditional-input"
            type="text"
            bind:value={conditionalObj.positiveValue}
            onchange={() => updateObjectValue(conditionalObj)}
        />

        else change to

        <input
            class="a5e-input a5e-input--slim a5e-conditional-input"
            type="text"
            bind:value={conditionalObj.negativeValue}
            onchange={() => updateObjectValue(conditionalObj)}
        />
    </div>
{:else if componentType === "RADIO"}
    <RadioGroup
        heading="A5E.effects.options"
        allowDeselect={false}
        options={optionsList[key]?.options ?? [[null, null]]}
        selected={value}
        onUpdateSelection={(value) => onchange(value)}
    />
{:else if componentType === "CHECKBOX"}
    <CheckboxGroup
        heading="A5E.effects.options"
        options={optionsList[key]?.options ?? [[null, null]]}
        selected={convertToArray(value)}
        onUpdateSelection={(value) => onchange(JSON.stringify(value))}
    />
{:else if componentType === "TAG_GROUP"}
    <CustomTagGroup
        heading="A5E.effects.options"
        options={optionsList[key]?.options ?? [[null, null]]}
        selected={convertToArray(value)}
        onUpdateSelection={(value) => {
            onchange(JSON.stringify(value));
        }}
    />
{:else if componentType === "ABILITY_BONUS"}
    <AbilityBonusConfigDialog
        jsonValue={value}
        --padding="0"
        --background="none"
        onchange={(value) => onchange(value)}
    />
{:else if componentType === "ATTACK_BONUS"}
    <AttackBonusConfigDialog
        jsonValue={value}
        --padding="0"
        --background="none"
        onchange={(value) => onchange(value)}
    />
{:else if componentType === "DAMAGE_BONUS"}
    <DamageBonusConfigDialog
        jsonValue={value}
        --padding="0"
        --background="none"
        onchange={(value) => onchange(value)}
    />
{:else if componentType === "HEALING_BONUS"}
    <HealingBonusConfigDialog
        jsonValue={value}
        --padding="0"
        --background="none"
        onchange={(value) => onchange(value)}
    />
{:else if componentType === "INITIATIVE_BONUS"}
    <InitiativeBonusConfigDialog
        jsonValue={value}
        --padding="0"
        --background="none"
        onchange={(value) => onchange(value)}
    />
{:else if componentType === "SKILL_BONUS"}
    <SkillBonusConfigDialog
        jsonValue={value}
        --padding="0"
        --background="none"
        onchange={(value) => onchange(value)}
    />
{:else if componentType === "NONE"}
    <!--  -->
{:else}
    <div class="a5e-effect-change-section u-w-full">
        <h3 class="a5e-effect-change-section__heading">
            {localize("A5E.effects.value")}
        </h3>

        <input
            class="a5e-input a5e-input--slim"
            type="text"
            {value}
            onchange={({ currentTarget }) => onchange(currentTarget.value)}
        />
    </div>
{/if}

<style lang="scss">
    .a5e-conditional {
        &-container {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.5rem;
        }

        &-input {
            width: 8rem;
            height: 27px;
            font-size: var(--a5e-sm-text);
        }
    }

    .a5e-effect-change-section {
        display: flex;
        flex-direction: column;
        gap: 0.275rem;

        &__heading {
            margin: 0;
            font-size: var(--a5e-sm-text);
            font-weight: bold;
        }
    }
</style>
