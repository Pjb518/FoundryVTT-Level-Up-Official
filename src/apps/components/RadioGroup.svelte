<script>
    import { createEventDispatcher } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let listClasses = "";
    export let optionClasses = "";
    export let options = [];
    export let selected = "";

    const dispatch = createEventDispatcher();
</script>

<ul
    class={`
        u-flex
        u-flex-wrap
        u-gap-sm
        u-list-style-none
        u-m-0
        u-p-0
        u-text-xs
        u-w-full
        ${listClasses}
    `}
>
    {#each options as [value, label]}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li
            class={`a5e-tag u-pointer ${optionClasses}`}
            class:a5e-tag--active={selected === value ||
                selected?.toString() === value}
            on:click={() =>
                dispatch("updateSelection", value === selected ? "" : value)}
        >
            {localize(label)}
        </li>
    {/each}
</ul>
