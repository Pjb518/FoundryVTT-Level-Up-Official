<script>
    import { createEventDispatcher, getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import AbilityBonusConfigDialog from "../../dialogs/AbilityBonusConfigDialog.svelte";
    import DamageBonusConfigDialog from "../../dialogs/DamageBonusConfigDialog.svelte";
    import HealingBonusConfigDialog from "../../dialogs/HealingBonusConfigDialog.svelte";
    import SkillBonusConfigDialog from "../../dialogs/SkillBonusConfigDialog.svelte";

    import CustomTagGroup from "../CustomTagGroup.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    export let key;
    export let mode;
    export let optionsList;
    export let value;

    const dispatch = createEventDispatcher();

    // Convert value to array if possible
    function convertToArray(value) {
        try {
            const values = JSON.parse((value ?? "").trim());
            if (Array.isArray(values)) return values;
            return [values];
        } catch {
            return [];
        }
    }

    function convertToObject(value) {
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

    function updateObjectValue(obj) {
        const returnValue = JSON.stringify(obj);
        dispatch("change", returnValue);
    }

    let conditionalObj = convertToObject(value);

    const MODES = CONFIG.A5E.ACTIVE_EFFECT_MODES;
    $: componentType = optionsList[key]?.type ?? "DEFAULT";
</script>

<!-- Adding Components Based on Type AND MODE -->
{#if mode === MODES.CONDITIONAL}
    <div class="conditional-container u-pt-sm">
        If original value is
        <select
            bind:value={conditionalObj.comparisonOperator}
            on:change={() => updateObjectValue(conditionalObj)}
        >
            <option value="==">equal to</option>
            <option value="!==">not equal</option>
            <option value=">">greater than</option>
            <option value=">=">greater than or equal to</option>
            <option value="<">less than</option>
            <option value="<=">less than or equal to</option>
        </select>

        <input
            class="conditional-input"
            type="text"
            bind:value={conditionalObj.comparisonValue}
            on:change={() => updateObjectValue(conditionalObj)}
        />

        then change to

        <input
            class="conditional-input"
            type="text"
            bind:value={conditionalObj.positiveValue}
            on:change={() => updateObjectValue(conditionalObj)}
        />

        else change to

        <input
            class="conditional-input"
            type="text"
            bind:value={conditionalObj.negativeValue}
            on:change={() => updateObjectValue(conditionalObj)}
        />
    </div>
{:else if componentType === "RADIO"}
    <div class="change-section">
        <h3 class="u-text-sm u-text-bold">
            {localize("A5E.effects.options")}
        </h3>

        <RadioGroup
            allowDeselect={false}
            options={optionsList[key]?.options ?? [[null, null]]}
            selected={value}
            on:updateSelection={({ detail }) => dispatch("change", detail)}
        />
    </div>
{:else if componentType === "CHECKBOX"}
    <div class="change-section">
        <h3 class="u-text-sm u-text-bold">
            {localize("A5E.effects.options")}
        </h3>

        <CheckboxGroup
            options={optionsList[key]?.options ?? [[null, null]]}
            selected={convertToArray(value)}
            on:updateSelection={({ detail }) =>
                dispatch("change", JSON.stringify(detail))}
        />
    </div>
{:else if componentType === "TAG_GROUP"}
    <div class="change-section">
        <CustomTagGroup
            heading="A5E.effects.options"
            options={optionsList[key]?.options ?? [[null, null]]}
            selected={convertToArray(value)}
            on:updateSelection={({ detail }) => {
                dispatch("change", JSON.stringify(detail));
            }}
        />
    </div>
{:else if componentType === "ABILITY_BONUS"}
    <AbilityBonusConfigDialog
        jsonValue={value}
        --padding="0"
        --background="none"
        on:change={({ detail }) => dispatch("change", detail)}
    />
{:else if componentType === "DAMAGE_BONUS"}
    <DamageBonusConfigDialog
        jsonValue={value}
        --padding="0"
        --background="none"
        on:change={({ detail }) => dispatch("change", detail)}
    />
{:else if componentType === "HEALING_BONUS"}
    <HealingBonusConfigDialog
        jsonValue={value}
        --padding="0"
        --background="none"
        on:change={({ detail }) => dispatch("change", detail)}
    />
{:else if componentType === "SKILL_BONUS"}
    <SkillBonusConfigDialog
        jsonValue={value}
        --padding="0"
        --background="none"
        on:change={({ detail }) => dispatch("change", detail)}
    />
{:else if componentType === "NONE"}
    <!--  -->
{:else}
    <div class="row">
        <div class="change-section u-w-full">
            <h3 class="u-text-sm u-text-bold">
                {localize("A5E.effects.value")}
            </h3>
        </div>

        <input
            type="text"
            {value}
            on:change={({ target }) => dispatch("change", target.value)}
        />
    </div>
{/if}

<style lang="scss">
    .conditional {
        &-container {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.5rem;
        }

        &-input {
            width: 8rem;
            height: 27px;
            font-size: $font-size-sm;
        }
    }

    .change-section {
        display: flex;
        flex-direction: column;
        gap: 0.275rem;
    }
</style>
