<script>
    import { createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    export let checked;
    export let label;

    const id = foundry.utils.randomID();
    const dispatch = createEventDispatcher();
</script>

<div class="checkbox-wrapper">
    <input
        class="checkbox"
        type="checkbox"
        {id}
        {checked}
        on:change={({ target }) => dispatch("updateSelection", target.checked)}
    />

    <label class="label" for={id}>
        {localize(label)}
    </label>
</div>

<style lang="scss">
    .checkbox {
        margin: 0;
    }

    .checkbox,
    .label {
        cursor: pointer;
    }

    .checkbox-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
</style>
