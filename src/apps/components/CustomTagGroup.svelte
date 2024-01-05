<script>
    import { createEventDispatcher } from "svelte";

    import CheckboxGroup from "./CheckboxGroup.svelte";
    import FieldWrapper from "./FieldWrapper.svelte";

    export let options = [];
    export let selected = [];
    export let disabledOptions = [];
    export let disabled = false;
    export let orange = [];
    export let red = [];
    export let showCustomInput = true;
    export let heading = "";

    function splitCustomSelections(value) {
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
    {options}
    selected={selectedCoreOptions}
    {disabled}
    {disabledOptions}
    {red}
    {orange}
    showToggleAllButton={true}
    on:updateSelection={(event) => (selectedCoreOptions = event.detail)}
/>

{#if showCustomInput}
    <FieldWrapper hint="A5E.HintSeparateBySemiColon">
        <input
            class="a5e-input"
            type="text"
            value={selectedCustomOptions.join("; ")}
            on:change={({ target }) =>
                (selectedCustomOptions = splitCustomSelections(target.value))}
        />
    </FieldWrapper>
{/if}
