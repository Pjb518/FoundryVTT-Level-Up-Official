<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import CheckboxGroup from "./CheckboxGroup.svelte";
    import FieldWrapper from "./FieldWrapper.svelte";

    export let disabled = false;
    export let disabledOptions: string[] = [];
    export let heading = "";
    export let hint = "";
    export let listClasses = "";
    export let options: string[][] = [];
    export let optionStyles = "";
    export let orange: string[] = [];
    export let red: string[] = [];
    export let selected: string[] = [];
    export let showCustomInput = true;
    export let showToggleAllButton = true;
    export let showWarning = false;
    export let tooltipData: Record<string, string> = {};
    export let warning = "";

    function splitCustomSelections(value: string): string[] {
        return value
            .split(";")
            .map((option) => option.trim())
            .filter(Boolean);
    }

    function updateSelections() {
        selected = [...selectedCoreOptions, ...selectedCustomOptions];
        dispatch("updateSelection", selected);
    }

    const optionKeys = options.map(([key]) => key);
    const dispatch = createEventDispatcher();

    $: selectedCoreOptions = selected.filter((option) =>
        optionKeys.includes(option),
    );

    $: selectedCustomOptions = selected.filter(
        (option) => !optionKeys.includes(option),
    );

    $: selectedCoreOptions, selectedCustomOptions, updateSelections();
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
    on:updateSelection={(event) => (selectedCoreOptions = event.detail)}
/>

{#if showCustomInput}
    <FieldWrapper hint="A5E.HintSeparateBySemiColon">
        <input
            class="a5e-input"
            type="text"
            value={selectedCustomOptions.join("; ")}
            on:change={({ target }) => {
                // @ts-ignore
                selectedCustomOptions = splitCustomSelections(target.value);
            }}
        />
    </FieldWrapper>
{/if}
