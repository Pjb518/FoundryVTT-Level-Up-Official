<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
    import { getContext } from "svelte";

    export let { actor, sheet } = getContext("#external").application;
    export let elementRoot;
</script>

<ApplicationShell bind:elementRoot>
    <main>
        <header>Actor Header</header>

        <section>Actor Body</section>
    </main>
</ApplicationShell>
