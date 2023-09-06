<script>
    import { createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import Tag from "./Tag.svelte";

    export let auxEnabled = true;
    export let color = "orange";
    export let hint = "";
    export let options = [];
    export let selected = [[], []];

    function updateSelection(value, skipDefault = false) {
        let newSelections = selected.map((c) => new Set(c));

        if (newSelections[0].has(value)) {
            newSelections[0].delete(value);
            newSelections[1].add(value);
        } else if (newSelections[1].has(value)) {
            newSelections[1].delete(value);
        } else if (auxEnabled && skipDefault) {
            newSelections[1].add(value);
        } else {
            newSelections[0].add(value);
        }

        newSelections = newSelections.map((c) => [...c]);

        dispatch("updateSelection", newSelections);
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
            active={selected[0].includes(value)}
            orange={selected[1].includes(value) && color === "orange"}
            red={selected[1].includes(value) && color === "red"}
            {label}
            {value}
            --color-hover="black"
            on:tagToggle={({ detail }) => updateSelection(detail)}
            on:tagToggleAux={({ detail }) => updateSelection(detail, true)}
        />
    {/each}
</ul>

{#if hint}
    <p class="hint">
        {localize(hint)}
    </p>
{/if}

<style lang="scss">
    .hint {
        margin-top: 0.25rem;
        color: #555;
        font-size: $font-size-xs;
    }
</style>
