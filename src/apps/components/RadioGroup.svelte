<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import FieldWrapper from "./FieldWrapper.svelte";
    import Tag from "./Tag.svelte";

    export let allowDeselect = true;
    export let buttons: any[] = [];
    export let disabled: string[] = [];
    export let heading = "";
    export let hint = "";
    export let listClasses = "";
    export let optionStyles = "";
    export let options: string[][] = [];
    export let selected = "";
    export let showWarning = false;
    export let tooltipData: Record<string, string> = {};
    export let warning = "";

    const dispatch = createEventDispatcher();

    function updateSelection(value: string) {
        if (allowDeselect) {
            dispatch("updateSelection", value === selected ? "" : value);
        } else {
            dispatch("updateSelection", value);
        }
    }
</script>

<FieldWrapper
    {buttons}
    {heading}
    {hint}
    {showWarning}
    {warning}
    --a5e-field-wrapper-header-item-justification="flex-start"
    --a5e-field-wrapper-header-gap="0.5rem"
>
    <ul class="radio-group {listClasses}">
        {#each options as [value, label]}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <Tag
                active={selected === value ||
                    selected?.toString() === value?.toString()}
                {label}
                {optionStyles}
                {value}
                disabled={disabled.includes(value)}
                tooltipText={tooltipData?.[value] ?? ""}
                on:tagToggle={({ detail }) => updateSelection(detail)}
            />
        {/each}
    </ul>
</FieldWrapper>

<style lang="scss">
    .radio-group {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
        width: var(--radio-group-width, 100%);
        margin: 0;
        padding: 0;
        font-size: 0.694rem;
        list-style: none;
    }
</style>
