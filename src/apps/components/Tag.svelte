<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    export let active = false;
    export let disabled = false;
    export let optionStyles = "";
    export let orange = false;
    export let red = false;
    export let label = "";
    export let tight = false;
    export let tooltipDirection = "UP";
    export let tooltipText = "";
    export let value = "";

    function getColorData(color: string): string {
        if (color === "red") {
            return `
                --tag-font-color: hsl(0, 58%, 100%);
                --tag-background-color: var(--a5e-color-error);
                --tag-border-color: hsl(0, 58%, 28%);
                --tag-hover-background-color: var(--a5e-color-error);
                --tag-hover-font-color: var(--color-hover, hsl(0, 58%, 100%));
            `;
        }

        if (color === "orange") {
            return `
                --tag-font-color: hsl(36, 58%, 100%);
                --tag-background-color: var(--a5e-color-warning);
                --tag-border-color: hsl(36, 58%, 28%);
                --tag-hover-background-color: var(--a5e-color-warning);
                --tag-hover-font-color: var(--color-hover, hsl(36, 58%, 100%));
            `;
        }

        if (color === "green") {
            return `
                --tag-font-color: hsl(190, 21%, 100%);
                --tag-background-color: var(--a5e-color-primary);
                --tag-border-color: hsl(190, 21%, 28%);
                --tag-hover-background-color: var(--a5e-color-primary);
                --tag-hover-font-color: var(--color-hover, hsl(190, 21%, 100%));
            `;
        }

        if (color === "disabled") {
            return `
                --tag-font-color: hsl(0, 0%, 100%);
                --tag-background-color: var(--a5e-color-disabled);
                --tag-border-color: hsl(0, 0%, 60%);
                --tag-hover-background-color: var(--a5e-color-disabled);
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

    function getColor(green, red, orange, disabled): string {
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
        data-tooltip={tooltipText}
        data-tooltip-direction={tooltipDirection}
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
        border-radius: var(--a5e-border-radius-standard);
        color: var(--tag-font-color, inherit);
        transition: var(--a5e-transition-standard);
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
