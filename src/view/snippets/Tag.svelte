<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    type Props = {
        active?: boolean;
        disabled?: boolean;
        optionStyles?: string;
        orange?: boolean;
        red?: boolean;
        label?: string;
        icon?: string;
        showIcon?: boolean;
        tight?: boolean;
        tooltipDirection?: string;
        tooltipText?: string;
        value?: string;
        onTagToggle?: (value: string) => void;
        onTagToggleAux?: (value: string) => void;
    };

    let {
        active = false,
        disabled = false,
        optionStyles = "",
        orange = false,
        red = false,
        label = "",
        icon = "",
        showIcon = false,
        tight = false,
        tooltipDirection = "UP",
        tooltipText = "",
        value = "",
        onTagToggle = () => {},
        onTagToggleAux = () => {},
    }: Props = $props();

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

    let color = $derived(getColor(active, red, orange, disabled));
    let colorStyles = $derived(getColorData(color));
    let style = $derived(`${colorStyles} ${optionStyles}`);
</script>

<li>
    <button
        class="tag"
        type="button"
        {style}
        class:tag--tight={tight}
        {disabled}
        {value}
        data-tooltip={tooltipText}
        data-tooltip-direction={tooltipDirection}
        onpointerdown={(e) => {
            e.preventDefault();
            if (e.button === 0) {
                onTagToggle(value);
            }
        }}
        onauxclick={(e) => {
            e.preventDefault();
            onTagToggleAux(value);
        }}
    >
        {localize(label)}

        {#if showIcon}
            <i class="{icon} tag__icon" aria-hidden="true"></i>
        {/if}
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

        &__icon {
            margin-right: 0.15rem;
            font-size: 0.85em;
        }
    }
</style>
