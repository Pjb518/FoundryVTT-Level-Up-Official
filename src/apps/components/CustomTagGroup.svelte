<script>
    import { createEventDispatcher } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import arraysAreEqual from "../../utils/arraysAreEqual";

    import CheckboxGroup from "./CheckboxGroup.svelte";
    import FormSection from "./FormSection.svelte";

    export let options = [];
    export let selected = [];
    export let disabled = false;
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
        optionKeys.includes(option)
    );

    $: selectedCustomOptions = selected.filter(
        (option) => !optionKeys.includes(option)
    );

    $: selectedCoreOptions, selectedCustomOptions, updateSelections();
</script>

{#if heading}
    <header class="u-align-center u-flex u-gap-lg">
        <h3 class="u-text-bold u-text-sm">{localize(heading)}</h3>

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a on:click={toggleAll} class="u-text-xs"> + Toggle All</a>
    </header>
{/if}

<CheckboxGroup
    {options}
    selected={selectedCoreOptions}
    {disabled}
    {red}
    on:updateSelection={(event) => (selectedCoreOptions = event.detail)}
/>

{#if showCustomInput}
    <FormSection
        hint="A5E.HintSeparateBySemiColon"
        --background="none"
        --padding="0"
    >
        <input
            class="a5e-input"
            type="text"
            value={selectedCustomOptions.join("; ")}
            on:change={({ target }) =>
                (selectedCustomOptions = splitCustomSelections(target.value))}
        />
    </FormSection>
{/if}
