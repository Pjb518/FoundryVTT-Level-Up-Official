<script lang="ts">
    import FieldWrapper from "./FieldWrapper.svelte";
    import Tag from "./Tag.svelte";

    type Props = {
        allowDeselect?: boolean;
        buttons?: any[];
        disabled?: string[];
        heading?: string;
        hint?: string;
        listClasses?: string;
        optionStyles?: string;
        options?: string[][];
        selected?: string;
        showWarning?: boolean;
        tooltipData?: Record<string, string>;
        warning?: string;

        onUpdateSelection?: (value: string) => void;
    };

    let {
        allowDeselect = true,
        buttons = [],
        disabled = [],
        heading = "",
        hint = "",
        listClasses = "",
        optionStyles = "",
        options = [],
        selected = "",
        showWarning = false,
        tooltipData = {},
        warning = "",
        onUpdateSelection = () => {},
    }: Props = $props();

    function updateSelection(value: string) {
        if (allowDeselect) {
            const updatedValue = value === selected ? "" : value;
            onUpdateSelection(updatedValue);
        } else {
            onUpdateSelection(value);
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
            <Tag
                active={selected === value ||
                    selected?.toString() === value?.toString()}
                {label}
                {optionStyles}
                {value}
                disabled={disabled.includes(value)}
                tooltipText={tooltipData?.[value] ?? ""}
                onTagToggle={(value) => updateSelection(value)}
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
        font-size: var(--a5e-xs-text);
        list-style: none;
    }
</style>
