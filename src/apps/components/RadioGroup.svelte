<script>
    import { createEventDispatcher } from "svelte";

    import Tag from "./Tag.svelte";

    export let allowDeselect = true;
    export let listClasses = "";
    export let optionStyles = "";
    export let disabled = [];
    export let options = [];
    export let selected = "";

    const dispatch = createEventDispatcher();

    function updateSelection(value) {
        if (allowDeselect) {
            dispatch("updateSelection", value === selected ? "" : value);
        } else {
            dispatch("updateSelection", value);
        }
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
        {listClasses}
    "
>
    {#each options as [value, label]}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <Tag
            active={selected === value || selected?.toString() === value}
            {optionStyles}
            {value}
            {label}
            disabled={disabled.includes(value)}
            on:tagToggle={({ detail }) => updateSelection(detail)}
        />
    {/each}
</ul>
