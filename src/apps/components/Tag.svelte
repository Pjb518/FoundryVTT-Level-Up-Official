<script>
    import { createEventDispatcher } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let active = false;
    export let disabled = false;
    export let label;
    export let orange = false;
    export let optionStyles = "";
    export let red = false;
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
        {disabled}
        {value}
        on:click|preventDefault={() => dispatch("tagToggle", value)}
        on:auxclick|preventDefault={() => dispatch("tagToggleAux", value)}
    >
        {localize(label)}
    </button>
</li>

<style lang="scss">
    @import "../../scss/base/variables";

    .tag {
        all: unset;
        background: transparent;
        display: inline;
        padding: 0.15rem 0.4rem;
        border: 1px solid darken(#7e7960, 5%);
        border-radius: $border-radius-standard;
        color: inherit;
        transition: $standard-transition;
        white-space: nowrap;
        cursor: pointer;

        &:hover,
        &:focus {
            background: darken(#dddace, 2.5%);
        }

        &:disabled,
        &[disabled] {
            background: #aaa;
            border: 1px solid #999;
            color: #999;
            cursor: auto;

            &:hover,
            &:focus {
                background: #aaa;
            }
        }

        &--red {
            border-color: darken(#8b2525, 5%);
            background: #8b2525;
            color: lighten(#8b2525, 95%);

            &:hover,
            &:focus {
                background: #8b2525;
            }

            &:disabled,
            &[disabled] {
                color: lighten(#8b2525, 95%);
            }
        }

        &--orange {
            border-color: darken(#8b6225, 5%);
            background: #8b6225;
            color: lighten(#8b6225, 95%);

            &:hover,
            &:focus {
                background: #8b6225;
            }

            &:disabled,
            &[disabled] {
                color: lighten(#8b6225, 95%);
            }
        }

        &--active {
            border-color: $color-primary;
            background: $color-primary;
            color: lighten($color-primary, 80%);

            &:hover,
            &:focus {
                background: $color-primary;
            }

            &:disabled,
            &[disabled] {
                color: lighten($color-primary, 95%);
            }
        }

        // &--tight {
        //     padding: 0.1rem 0.375rem;
        // }
    }
</style>
