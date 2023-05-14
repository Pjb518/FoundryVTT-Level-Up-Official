<script>
    import { createEventDispatcher } from "svelte";
    import Tag from "./Tag.svelte";

    export let listClasses = "";
    export let optionStyles = "";
    export let options = [];
    export let selected = [];
    export let disabledOptions = [];
    export let disabled = false;
    export let red = [];
    export let orange = [];

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
        {listClasses}
    "
>
    {#each options as [value, label]}
        <Tag
            active={selected.includes(value)}
            {label}
            {optionStyles}
            {value}
            red={red?.includes(value)}
            orange={orange?.includes(value)}
            disabled={disabledOptions.includes(value) ||
                (disabled && !selected.includes(value))}
            on:tagToggle={({ detail }) => updateSelection(detail)}
        />
    {/each}
</ul>
