<script lang="ts">
import { createEventDispatcher } from 'svelte';

import CheckboxGroup from './CheckboxGroup.svelte';
import FieldWrapper from './FieldWrapper.svelte';

export let disabled = false;
export let disabledOptions: string[] = [];
export let heading = '';
export let hint = '';
export let listClasses = '';
export let options: string[][] = [];
export let optionStyles = '';
export let orange: string[] = [];
export let red: string[] = [];
export let selected: string[] = [];
export let showCustomInput = true;
export let showToggleAllButton = true;
export let showWarning = false;
export let tooltipData: Record<string, string> = {};
export let warning = '';

function splitCustomSelections(value: string): string[] {
	return value
		.split(';')
		.map((option) => option.trim())
		.filter(Boolean);
}

function updateCoreSelections(detail: string[]) {
	selected = [...detail, ...selectedCustomOptions];
	dispatch('updateSelection', [...detail, ...selectedCustomOptions]);
}

function updateCustomSelections(detail: string) {
	selected = [...selectedCoreOptions, ...splitCustomSelections(detail)];
	dispatch('updateSelection', selected);
}

const optionKeys = options.map(([key]) => key);
const dispatch = createEventDispatcher();

$: selectedCoreOptions = selected.filter((option) => optionKeys.includes(option));
$: selectedCustomOptions = selected.filter((option) => !optionKeys.includes(option));
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
    on:updateSelection={(event) => updateCoreSelections(event.detail)}
/>

{#if showCustomInput}
    <FieldWrapper hint="A5E.HintSeparateBySemiColon">
        <input
            class="a5e-input"
            type="text"
            value={selectedCustomOptions.join("; ")}
            on:change={({ target }) => {
                // @ts-ignore
                updateCustomSelections(target.value);
            }}
        />
    </FieldWrapper>
{/if}
