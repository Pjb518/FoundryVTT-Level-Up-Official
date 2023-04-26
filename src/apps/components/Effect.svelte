<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let effect;

    const actor = getContext("actor");
</script>

<div
    class="effect__container"
    on:auxclick|preventDefault={() => {
        console.log(effect);
        effect.sheet?.render(true);
    }}
>
    <!-- Image? -->
    <img src="" alt="" />
    <!-- Name -->
    <div>{effect.label}</div>
    <!-- Summary -->

    <!-- Buttons -->
    <span>Buttons</span>
</div>

<style lang="scss">
    .effect__container {
        position: relative;
        display: grid;
        grid-template-columns: 2rem 1fr 5rem;
        column-gap: 0.5rem;
        align-items: center;
        padding: 0.125rem;
        padding-right: 0.5rem;
        width: 100%;
        border: 1px solid #ccc;
        background-color: rgba(0 0 0 / 0.05);
        cursor: pointer;
    }
</style>
