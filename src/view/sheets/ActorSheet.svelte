<script lang="ts">
    import { setContext } from "svelte";

    import ActorSidebar from "./components/ActorSidebar.svelte";

    let { actor, sheet } = $props();

    setContext("actor", actor);
    setContext("sheet", sheet);
</script>

<main class="a5e-actor-sheet">
    <ActorSidebar />

    <header></header>

    <section></section>
</main>

<style lang="scss">
    .a5e-actor-sheet {
        display: grid;
        grid-template-areas:
            "aside header"
            "aside primaryNavigation"
            "aside secondaryNavigation"
            "aside body"
            "aside footer";
        grid-template-columns: 12rem 1fr;
    }
</style>
