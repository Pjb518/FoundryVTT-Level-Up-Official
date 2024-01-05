<script>
    import { createEventDispatcher } from "svelte";

    import arraysAreEqual from "../../utils/arraysAreEqual";

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

    function toggleAll() {
        if (arraysAreEqual(optionKeys, selectedCoreOptions)) {
            selectedCoreOptions = [];
        } else {
            selectedCoreOptions = optionKeys;
        }

        updateSelections(selectedCustomOptions);
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

<FieldWrapper
    {heading}
    buttons={[
        { classes: "u-text-xs", label: "+ Toggle All", handler: toggleAll },
    ]}
    --a5e-field-wrapper-header-item-justification="flex-start"
    --a5e-field-wrapper-header-gap="0.5rem"
>
    <CheckboxGroup
        {options}
        selected={selectedCoreOptions}
        {disabled}
        {disabledOptions}
        {red}
        {orange}
        on:updateSelection={(event) => (selectedCoreOptions = event.detail)}
    />
</FieldWrapper>

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
