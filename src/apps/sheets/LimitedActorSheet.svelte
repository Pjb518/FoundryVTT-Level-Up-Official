<svelte:options accessors={true} />

<script>
    import { getContext, setContext } from "svelte";
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";

    export let { actor, sheet } = getContext("#external").application;
    export let elementRoot;

    setContext("actor", actor);
</script>

<ApplicationShell bind:elementRoot>
    <main>
        <div class="image-wrapper">
            <img
                class="actor-image"
                src={$actor.img}
                alt={$actor.name}
                title={$actor.name}
            />
        </div>

        <h1 class="actor-name">{$actor.name}</h1>
    </main>
</ApplicationShell>

<style lang="scss">
    :global(.a5e-actor-sheet--limited) {
        min-width: 32rem;
        min-height: 37.5rem;
        height: 37.5rem !important;
    }

    .image-wrapper {
        width: 32rem;
        height: 32rem;
        padding: 0.25rem;
    }

    .actor-img {
        width: 100%;
        height: auto;
        border-radius: 5px;
    }

    h1 {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2.75rem;
        margin-inline: 0.5rem;
        border-radius: 4px;
        font-family: "Modesto Condensed", serif;
    }

    main {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
</style>
