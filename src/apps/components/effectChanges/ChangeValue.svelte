<script>
    import { createEventDispatcher, getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import RadioGroup from "../RadioGroup.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";
    import CustomTagGroup from "../CustomTagGroup.svelte";

    export let key;
    export let mode;
    export let value;

    const sheet = getContext("sheet");
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

    const MODES = CONFIG.A5E.ACTIVE_EFFECT_MODES;
    const optionsList = sheet.optionsList;
    $: componentType = optionsList[key]?.type ?? "DEFAULT";
</script>

<!-- Adding Components Based on Type AND MODE -->
{#if mode === MODES.CONDITIONAL}
    <div class="conditional-container u-pt-sm">
        If original value is
        <select>
            <option value="==">equal to</option>
            <option value="!==">not equal</option>
            <option value=">">greater than</option>
            <option value=">=">greater than or equal to</option>
            <option value="<">less than</option>
            <option value="<=">less than or equal to</option>
        </select>
        <input class="conditional-input" type="text" />
        then change to <input class="conditional-input" type="text" />
        else change to <input class="conditional-input" type="text" />
    </div>

    <!-- <span class="u-flex">
        If original value is
        <select>
            <option value="">{">="}</option>
            <option value="">{"<="}</option>
        </select>
        than
        <input class="u-w-20" type="number" />
        then change to <input class="a5e-input--slim u-w-20" type="number" />
        else change to <input class="a5e-input--slim u-w-20" type="number" />
    </span> -->
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
