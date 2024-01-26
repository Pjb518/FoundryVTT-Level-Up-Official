<script>
    import { createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    export let active = false;
    export let disabled = false;
    export let label;
    export let orange = false;
    export let optionStyles = "";
    export let red = false;
    export let tight = false;
    export let value;

    const dispatch = createEventDispatcher();
</script>

<li>
    <button
        class="tag"
        style={optionStyles}
        class:tag--active={active}
        class:tag--orange={orange}
        class:tag--red={red}
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
        background: transparent;
        display: inline;
        padding: 0.15rem 0.4rem;
        border: 1px solid darken(#7e7960, 5%);
        border-radius: $border-radius-standard;
        color: inherit;
        transition: $standard-transition;
        white-space: normal;
        cursor: pointer;

        &:hover,
        &:focus {
            background: darken(#dddace, 2.5%);
            color: var(--color-hover, inherit);
        }

        &--red {
            border-color: darken($color-secondary, 5%);
            background: $color-secondary;
            color: lighten($color-secondary, 95%);

            &:hover,
            &:focus {
                background: $color-secondary;
                color: lighten($color-secondary, 80%);
            }

            &:disabled,
            &[disabled],
            &:disabled:hover,
            &[disabled]:hover {
                background: $color-secondary;
                color: lighten($color-secondary, 95%);
            }
        }

        &--orange {
            border-color: darken($color-warning, 5%);
            background: $color-warning;
            color: lighten($color-warning, 95%);

            &:hover,
            &:focus {
                background: $color-warning;
                color: lighten($color-warning, 80%);
            }

            &:disabled,
            &[disabled],
            &:disabled:hover,
            &[disabled]:hover {
                background: $color-warning;
                color: lighten($color-warning, 95%);
            }
        }

        &:disabled,
        &[disabled] {
            background: $color-disabled;
            border: 1px solid #999;
            color: white;
            cursor: auto;

            &:hover,
            &:focus {
                background: $color-disabled;
            }
        }

        &--active {
            border-color: $color-primary;
            background: $color-primary;
            color: lighten($color-primary, 80%);

            &:hover,
            &:focus {
                background: $color-primary;
                color: lighten($color-primary, 80%);
            }

            &:disabled,
            &[disabled] {
                color: lighten($color-primary, 95%);
            }
        }

        &--tight {
            padding: 0.1rem 0.375rem;
        }
    }
</style>
