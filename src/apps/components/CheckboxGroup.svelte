<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let options = [];
    export let selected = [];
    export let name;
    export let document;

    function update(value) {
        const newSelections = new Set(selected);

        if (newSelections.has(value)) newSelections.delete(value);
        else newSelections.add(value);

        updateDocumentDataFromField($document, name, [...newSelections]);
    }
</script>

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
            class:a5e-tag--active={selected.includes(value)}
            on:click={() => update(value)}
        >
            {localize(label)}
        </li>
    {/each}
</ul>
