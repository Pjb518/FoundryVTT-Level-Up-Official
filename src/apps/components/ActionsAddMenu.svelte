<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { createEventDispatcher } from "svelte";

    export let menuList;

    const dispatch = createEventDispatcher();
</script>

<div class="something">
    {#each menuList as [heading, type]}
        <button on:click|preventDefault={() => dispatch("press", type)}>
            {localize(heading)}
        </button>
    {/each}
</div>

<style lang="scss">
    .something {
        position: relative;
        display: grid;
        min-width: 15rem;
        grid-template-columns: repeat(3, 5rem);
        gap: 0.125rem;
        padding: 0.125rem 0.125rem;

        button {
            background: transparent;
            color: white;
            font-size: 0.694rem;
        }
    }
</style>
