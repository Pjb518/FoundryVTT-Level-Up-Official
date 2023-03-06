<script>
    import { createEventDispatcher } from "svelte";
    import prepareExpertiseDiceOptions from "../handlers/prepareExpertiseDiceOptions";

    export let selected;

    const randomId = foundry.utils.randomID();
    const dispatch = createEventDispatcher();
    const options = prepareExpertiseDiceOptions();
</script>

<div
    class="
    u-flex
    u-flex-wrap
    u-list-style-none
    u-m-0
    u-p-0
    u-w-full
    a5e-radio-group--expertise
    u-gap-md
    u-mb-md
    u-text-sm
"
    role="radiogroup"
    id="{randomId}-expertise"
>
    {#each options as [diceQuantity, dieSize]}
        <input
            class="u-hidden"
            type="radio"
            id="{randomId}-expertise-{dieSize}"
            {diceQuantity}
        />

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <label
            class="a5e-tag u-pointer u-p-md u-text-center u-w-12"
            class:a5e-tag--active={diceQuantity === selected}
            for="{randomId}-expertise-{dieSize}"
            on:click={() => dispatch("updateSelection", diceQuantity)}
        >
            {dieSize}
        </label>
    {/each}
</div>
