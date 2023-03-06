<script>
    import { createEventDispatcher } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let active = false;
    export let disabled = false;
    export let label;
    export let orange = false;
    export let optionClasses = "";
    export let red = false;
    export let value;

    console.log(active);

    const dispatch = createEventDispatcher();
</script>

<button
    class="tag u-pointer {optionClasses}"
    class:tag--active={active}
    class:tag--orange={orange}
    class:tag--red={red}
    {disabled}
    {value}
    on:click={() => dispatch("tagToggle", value)}
>
    {localize(label)}
</button>

<style lang="scss">
    @import "../../scss/base/variables";

    .tag {
        all: unset;
        background: transparent;
        width: min-content;
        padding: 0.15rem 0.4rem;
        border: 1px solid darken(#7e7960, 5%);
        border-radius: $border-radius-standard;
        color: inherit;
        transition: $standard-transition;
        white-space: nowrap;

        &:hover,
        &:focus {
            background: darken(#dddace, 2.5%);
        }

        &--active {
            border-color: $color-primary;
            background: $color-primary;
            color: lighten($color-primary, 80%);

            &:hover,
            &:focus {
                background: $color-primary;
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
        }

        &--orange {
            border-color: darken(#8b6225, 5%);
            background: #8b6225;
            color: lighten(#8b6225, 95%);

            &:hover,
            &:focus {
                background: #8b6225;
            }
        }

        &--tight {
            padding: 0.1rem 0.375rem;
        }
    }
</style>
