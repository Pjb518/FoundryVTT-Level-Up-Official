<script>
    import { createEventDispatcher } from "svelte";
    import Tag from "./Tag.svelte";

    export let options = [];
    export let selected = [];

    function updateSelection(value) {
        const newSelections = new Set(selected);

        if (newSelections.has(value)) newSelections.delete(value);
        else newSelections.add(value);

        dispatch("updateSelection", [...newSelections]);
    }

    const dispatch = createEventDispatcher();
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
        <Tag
            active={selected.includes(value)}
            {label}
            {value}
            on:tagToggle={({ detail }) => updateSelection(detail)}
        />
    {/each}
</ul>
