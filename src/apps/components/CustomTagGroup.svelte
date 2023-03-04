<script>
    import { createEventDispatcher } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import arraysAreEqual from "../../utils/arraysAreEqual";

    import CheckboxGroup from "./CheckboxGroup.svelte";

    export let options = [];
    export let selected = [];
    export let showCustomInput = true;
    export let heading;

    function toggleAll() {
        if (arraysAreEqual(optionKeys, selectedCoreOptions)) {
            selectedCoreOptions = [];
        } else {
            selectedCoreOptions = optionKeys;
        }

        updateCustom(selectedCustomOptions);
    }

    function updateCoreSelections(values) {
        const customSelections = selectedCustomOptions
            .split(";")
            .map((option) => {
                console.log(option);
                return option.trim();
            })
            .filter(Boolean);

        dispatch("updateSelection", [...values, ...customSelections]);
    }

    function updateCustomSelections(values) {
        selected = [
            ...selectedCoreOptions,
            ...values
                .split(";")
                .map((option) => {
                    console.log(option);
                    return option.trim();
                })
                .filter(Boolean),
        ];

        dispatch("updateSelection", selected);
    }

    const optionKeys = options.map(([key]) => key);
    const dispatch = createEventDispatcher();

    $: selectedCoreOptions = selected.filter((option) =>
        optionKeys.includes(option)
    );

    $: selectedCustomOptions = selected
        .filter((option) => !optionKeys.includes(option))
        .join("; ");
</script>

<header class="u-align-center u-flex u-gap-lg">
    <h3 class="u-text-bold u-text-sm">{localize(heading)}</h3>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a on:click={toggleAll} class="u-text-xs"> + Toggle All</a>
</header>

<CheckboxGroup
    {options}
    selected={selectedCoreOptions}
    on:updateSelection={(event) => updateCoreSelections(event.detail)}
/>

{#if showCustomInput}
    <div class="u-mt-sm u-w-full">
        <input
            class="a5e-input"
            type="text"
            value={selectedCustomOptions}
            on:change={({ target }) => updateCustomSelections(target.value)}
        />
    </div>

    <span class="a5e-form__hint">
        {localize("A5E.HintSeparateBySemiColon")}</span
    >
{/if}
