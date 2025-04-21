<script lang="ts">
    import { setContext } from "svelte";

    import ActorSidebar from "./components/ActorSidebar.svelte";
    import ActorSheetHeader from "./components/ActorSheetHeader.svelte";

    let { actor, sheet } = $props();

    let sheetIsLocked = $derived(
        !actor.isOwner
            ? true
            : (actor.reactive.flags?.a5e?.sheetIsLocked ?? true),
    );

    setContext("actor", actor);
    setContext("sheet", sheet);
    setContext("sheetIsLocked", () => sheetIsLocked);
</script>

<main class="a5e-actor-sheet">
    <ActorSidebar />

    <ActorSheetHeader />

    <section></section>
</main>

<style lang="scss">
    .a5e-actor-sheet {
        position: relative;
        width: 100%;
        height: 100%;

        display: grid;
        grid-template-areas:
            "aside header"
            "aside primaryNavigation"
            "aside secondaryNavigation"
            "aside body"
            "aside footer";
        grid-template-columns: 12rem 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    }
</style>
