<script>
    import { createEventDispatcher, getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import RadioGroup from "../RadioGroup.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";
    import CustomTagGroup from "../CustomTagGroup.svelte";

    export let key;
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

    const optionsList = sheet.optionsList;
    $: componentType = optionsList[key]?.type ?? "DEFAULT";
</script>

<!-- Adding Components Based on type -->
{#if componentType === "RADIO"}
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
    .change-section {
        display: flex;
        flex-direction: column;
        gap: 0.275rem;
    }
</style>
