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
        radio-group
        {listClasses}
    "
>
    {#each options as [value, label]}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <Tag
            active={selected === value ||
                selected?.toString() === value?.toString()}
            {label}
            {optionStyles}
            {value}
            disabled={disabled.includes(value)}
            on:tagToggle={({ detail }) => updateSelection(detail)}
        />
    {/each}
</ul>

<style lang="scss">
    .radio-group {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
        width: var(--radio-group-width, 100%);
        margin: 0;
        padding: 0;
        font-size: 0.694rem;
        list-style: none;
    }
</style>
