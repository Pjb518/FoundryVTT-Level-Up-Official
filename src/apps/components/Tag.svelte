<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

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
                --a5e-tag-color: hsl(0, 58%, 100%);
                --a5e-tag-background-color: var(--a5e-color-error);
                --a5e-tag-border-color: hsl(0, 58%, 28%);
                --a5e-tag-background-color-hover: var(--a5e-color-error);
                --a5e-tag-color-hover: var(--color-hover, hsl(0, 58%, 100%));
            `;
        }

        if (color === "orange") {
            return `
                --a5e-tag-color: hsl(36, 58%, 100%);
                --a5e-tag-background-color: var(--a5e-color-warning);
                --a5e-tag-border-color: hsl(36, 58%, 28%);
                --a5e-tag-background-color-hover: var(--a5e-color-warning);
                --a5e-tag-color-hover: var(--color-hover, hsl(36, 58%, 100%));
            `;
        }

        if (color === "green") {
            return `
                --a5e-tag-color: hsl(190, 21%, 100%);
                --a5e-tag-background-color: var(--a5e-color-primary);
                --a5e-tag-border-color: hsl(190, 21%, 28%);
                --a5e-tag-background-color-hover: var(--a5e-color-primary);
                --a5e-tag-color-hover: var(--color-hover, hsl(190, 21%, 100%));
            `;
        }

        if (color === "disabled") {
            return `
                --a5e-tag-color: hsl(0, 0%, 100%);
                --a5e-tag-background-color: var(--a5e-color-disabled);
                --a5e-tag-border-color: hsl(0, 0%, 60%);
                --a5e-tag-background-color-hover: var(--a5e-color-disabled);
                --a5e-tag-color-hover: var(--color-hover, hsl(0, 0%, 100%));
            `;
        }

        return "";
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
        background: var(--a5e-tag-background-color, transparent);
        display: inline;
        padding: 0.15rem 0.4rem;
        border: 1px solid var(--a5e-tag-border-color);
        border-radius: var(--a5e-border-radius-standard);
        color: var(--a5e-tag-color, inherit);
        transition: var(--a5e-transition-standard);
        white-space: normal;
        cursor: pointer;

        &:hover,
        &:focus {
            background: var(--a5e-tag-background-color-hover);
            color: var(--a5e-tag-color-hover);
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
