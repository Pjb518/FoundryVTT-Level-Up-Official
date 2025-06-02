<script lang="ts">
    import CheckboxGroup from "./CheckboxGroup.svelte";
    import FieldWrapper from "./FieldWrapper.svelte";

    type Props = {
        disabled?: boolean;
        disabledOptions?: string[];
        heading?: string;
        hint?: string;
        listClasses?: string;
        options?: string[][];
        optionStyles?: string;
        orange?: string[];
        red?: string[];
        selected?: string[];
        showCustomInput?: boolean;
        showToggleAllButton?: boolean;
        showWarning?: boolean;
        tooltipData?: Record<string, string>;
        warning?: string;
        onUpdateSelection: (value: string[]) => void;
    };

    function splitCustomSelections(value: string): string[] {
        return value
            .split(";")
            .map((option) => option.trim())
            .filter(Boolean);
    }

    function updateCoreSelections(detail: string[]) {
        selected = [...detail, ...selectedCustomOptions];
        onUpdateSelection([...detail, ...selectedCustomOptions]);
    }

    function updateCustomSelections(detail: string) {
        selected = [...selectedCoreOptions, ...splitCustomSelections(detail)];
        onUpdateSelection(selected);
    }

    let {
        disabled = false,
        disabledOptions = [],
        heading = "",
        hint = "",
        listClasses = "",
        options = [],
        optionStyles = "",
        orange = [],
        red = [],
        selected = [],
        showCustomInput = true,
        showToggleAllButton = true,
        showWarning = false,
        tooltipData = {},
        warning = "",
        onUpdateSelection = () => {},
    }: Props = $props();

    let optionKeys = options.map(([key]) => key);

    let selectedCoreOptions = $derived(
        selected.filter((option) => optionKeys.includes(option)),
    );

    let selectedCustomOptions = $derived(
        selected.filter((option) => !optionKeys.includes(option)),
    );
</script>

<CheckboxGroup
    {heading}
    {hint}
    {listClasses}
    {options}
    {optionStyles}
    {orange}
    {red}
    selected={selectedCoreOptions}
    {disabled}
    {disabledOptions}
    {showToggleAllButton}
    {showWarning}
    {tooltipData}
    {warning}
    onUpdateSelection={(values) => updateCoreSelections(values)}
/>

{#if showCustomInput}
    <FieldWrapper hint="A5E.HintSeparateBySemiColon">
        <input
            class="a5e-input"
            type="text"
            value={selectedCustomOptions.join("; ")}
            onchange={({ currentTarget }) => {
                updateCustomSelections(currentTarget.value);
            }}
        />
    </FieldWrapper>
{/if}
