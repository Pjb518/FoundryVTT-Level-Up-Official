<script lang="ts">
    import FieldWrapper from "./FieldWrapper.svelte";
    import Tag from "./Tag.svelte";

    import arraysAreEqual from "../../utils/arraysAreEqual.ts";

    type Props = {
        disabled?: boolean;
        disabledOptions?: string[];
        heading?: string;
        hint?: string;
        icon?: string;
        iconList?: string[];
        listClasses?: string;
        options: string[][];
        optionStyles?: string;
        orange?: string[];
        red?: string[];
        selected: string[];
        showToggleAllButton?: boolean;
        showWarning?: boolean;
        tooltipData?: Record<string, string>;
        warning?: string;
        onUpdateSelection?: (value: string[]) => void;
    };

    let {
        disabled = false,
        disabledOptions = [],
        heading = "",
        hint = "",
        icon = "",
        iconList = [],
        listClasses = "",
        options = [],
        optionStyles = "",
        orange = [],
        red = [],
        selected = [],
        showToggleAllButton = false,
        showWarning = false,
        tooltipData = {},
        warning = "",
        onUpdateSelection = () => {},
    }: Props = $props();

    function getButtons() {
        if (!showToggleAllButton) return [];

        return [
            {
                classes: "u-text-xs",
                label: "+ Toggle All",
                handler: toggleAll,
            },
        ];
    }

    function updateSelection(value: string) {
        const newSelections: Set<string> = new Set(selected);

        if (newSelections.has(value)) newSelections.delete(value);
        else newSelections.add(value);

        onUpdateSelection([...newSelections]);
    }

    function toggleAll() {
        const optionKeys = options.map(([key]) => key);
        const selectedKeys = selected;

        if (arraysAreEqual(optionKeys, selectedKeys)) selected = [];
        else selected = optionKeys;

        onUpdateSelection(selected);
    }

    let buttons = getButtons();
</script>

<FieldWrapper
    {buttons}
    {heading}
    {hint}
    {showWarning}
    {warning}
    --a5e-field-wrapper-header-item-justification="flex-start"
    --a5e-field-wrapper--gap="0.5rem"
>
    <ul class="a5e-check-box-group__list {listClasses}">
        {#each options as [value, label]}
            <Tag
                active={selected.includes(value)}
                {label}
                {optionStyles}
                {value}
                red={red?.includes(value)}
                orange={orange?.includes(value)}
                disabled={disabledOptions.includes(value) ||
                    (disabled && !selected.includes(value))}
                {icon}
                showIcon={iconList?.includes(value)}
                tooltipText={tooltipData?.[value] ?? ""}
                onTagToggle={(value) => {
                    updateSelection(value);
                }}
            />
        {/each}
    </ul>
</FieldWrapper>

<style lang="scss">
    .a5e-check-box-group__list {
        list-style: none;

        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;

        margin: 0;
        padding: 0;

        font-size: var(--a5e-xs-text);
        width: 100%;
    }
</style>
