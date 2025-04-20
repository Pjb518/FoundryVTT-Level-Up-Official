<script>
    import { getContext } from "svelte";

    import ActorHitPoints from "./ActorHitPoints.svelte";
    import ActorSideBarDetails from "./ActorSideBarDetails.svelte";

    let actor = getContext("actor");
</script>

<aside class="a5e-actor-sidebar">
    <section class="a5e-actor-portrait-wrapper">
        <ActorHitPoints />
    </section>

    <section class="a5e-actor-details-wrapper">
        <ActorSideBarDetails />
    </section>

    <section>Testing Something else here</section>

    <!-- AC &   -->
</aside>

<style lang="scss">
    .a5e-actor-sidebar {
        position: relative;
        grid-area: aside;

        display: flex;
        flex-direction: column;
        flex-grow: 0;
        flex-shrink: 0;

        height: 100%;
        padding: 0.5rem;
        padding-right: 0;
        border-right: 1px solid var(--a5e-border-color);

        background: rgba(0, 0, 0, 0.05);
    }

    .a5e-actor-portrait-wrapper {
        position: relative;
        padding-right: 0.125rem;
        margin-block-end: 0.5rem;
    }

    .a5e-actor-details-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex-grow: 1;
        overflow-y: auto;
        overflow-x: clip;
    }
</style>
