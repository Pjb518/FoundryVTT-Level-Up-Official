<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { get } from "svelte/store";

    export let active = false;
    export let disabled = false;
    export let optionStyles = "";
    export let orange = false;
    export let red = false;
    export let label = "";
    export let tight = false;
    export let value = "";

    function getColorData(color: string): string {
        if (color === "red") {
            return `
                --tag-font-color: hsl(0, 58%, 100%);
                --tag-background-color: hsl(0, 58%, 35%);
                --tag-border-color: hsl(0, 58%, 28%);
                --tag-hover-background-color: hsl(0, 58%, 35%);
                --tag-hover-font-color: var(--color-hover, hsl(0, 58%, 100%));
            `;
        }

        if (color === "orange") {
            return `
                --tag-font-color: hsl(36, 58%, 100%);
                --tag-background-color: hsl(36, 58%, 35%);
                --tag-border-color: hsl(36, 58%, 28%);
                --tag-hover-background-color: hsl(36, 58%, 35%);
                --tag-hover-font-color: var(--color-hover, hsl(36, 58%, 100%));
            `;
        }

        if (color === "green") {
            return `
                --tag-font-color: hsl(190, 21%, 100%);
                --tag-background-color: hsl(190, 21%, 33%);
                --tag-border-color: hsl(190, 21%, 28%);
                --tag-hover-background-color: hsl(190, 21%, 33%);
                --tag-hover-font-color: var(--color-hover, hsl(190, 21%, 100%));
            `;
        }

        if (color === "disabled") {
            return `
                --tag-font-color: hsl(0, 0%, 100%);
                --tag-background-color: hsl(0, 0%, 67%);
                --tag-border-color: hsl(0, 0%, 60%);
                --tag-hover-background-color: hsl(0, 0%, 67%);
                --tag-hover-font-color: var(--color-hover, hsl(0, 0%, 100%));
            `;
        }

        return `
            --tag-font-color: inherit;
            --tag-background-color: transparent;
            --tag-border-color: #706b55;
            --tag-hover-background-color: #d8d4c6;
            --tag-hover-font-color: var(--color-hover, inherit);
        `;
    }

    function getColor(
        green: boolean,
        red: boolean,
        orange: boolean,
        disabled: boolean,
    ): string {
        if (green) return "green";
        if (disabled) return "disabled";
        if (red) return "red";
        if (orange) return "orange";
        return "default";
    }

    const dispatch = createEventDispatcher();

    $: color = getColor(active, red, orange, disabled);
    $: colorStyles = getColorData(color);
    $: style = `${colorStyles} ${optionStyles}`;
</script>

<li>
    <button
        class="tag"
        {style}
        class:tag--tight={tight}
        {disabled}
        {value}
        on:click|preventDefault={() => dispatch("tagToggle", value)}
        on:auxclick|preventDefault={() => dispatch("tagToggleAux", value)}
    >
        {localize(label)}
    </button>
</li>

<style lang="scss">
    .tag {
        all: unset;
        background: var(--tag-background-color, transparent);
        display: inline;
        padding: 0.15rem 0.4rem;
        border: 1px solid var(--tag-border-color);
        border-radius: $border-radius-standard;
        color: var(--tag-font-color, inherit);
        transition: $standard-transition;
        white-space: normal;
        cursor: pointer;

        &:hover,
        &:focus {
            background: var(--tag-hover-background-color);
            color: var(--tag-hover-font-color);
        }

        &:disabled,
        &[disabled] {
            cursor: auto;
        }

        &--tight {
            padding: 0.1rem 0.375rem;
        }
    }
</style>
