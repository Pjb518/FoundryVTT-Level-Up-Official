<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";
    import arraysAreEqual from "../../modules/utils/arraysAreEqual";

    export let options = [];
    export let selected = [];
    export let showCustomInput = true;
    export let heading;
    export let name;
    export let document;

    function toggleAll() {
        if (arraysAreEqual(optionKeys, selectedCoreOptions)) {
            selectedCoreOptions = [];
        } else {
            selectedCoreOptions = optionKeys;
        }
    }

    function updateCore(value) {
        const temp = new Set(selected);

        if (temp.has(value)) temp.delete(value);
        else temp.add(value);

        updateDocumentDataFromField($document, name, [...temp]);
    }

    function updateCustom(values) {
        selected = [
            ...selectedCoreOptions,
            ...values
                .split(";")
                .map((option) => option.trim())
                .filter(Boolean),
        ];

        updateDocumentDataFromField($document, name, selected);
    }

    const optionKeys = options.map(([key]) => key);

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

<ul
    class="
            u-flex
            u-flex-wrap
            u-gap-sm
            u-list-style-none
            u-m-0
            u-p-0
            u-text-xs
            u-w-full
"
>
    {#each options as [value, label]}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li
            class="a5e-tag u-pointer"
            class:a5e-tag--inactive={!selectedCoreOptions.includes(value)}
            on:click={() => updateCore(value)}
        >
            {localize(label)}
        </li>
    {/each}
</ul>

{#if showCustomInput}
    <div class="u-mt-sm u-w-full">
        <input
            class="a5e-input"
            type="text"
            value={selectedCustomOptions}
            on:change={({ target }) => updateCustom(target.value)}
        />
    </div>

    <span class="a5e-form__hint">
        {localize("A5E.HintSeparateBySemiColon")}</span
    >
{/if}
