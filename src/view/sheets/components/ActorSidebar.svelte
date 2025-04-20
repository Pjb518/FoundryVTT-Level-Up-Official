<script>
    import { getContext } from "svelte";

    import ActorHitPoints from "./ActorHitPoints.svelte";
    import ActorSidebarDetails from "./ActorSidebarDetails.svelte";
    import ActorSidebarFooter from "./ActorSidebarFooter.svelte";

    let actor = getContext("actor");
</script>

<aside class="a5e-actor-sidebar">
    <section class="a5e-actor-portrait-wrapper">
        <ActorHitPoints />
    </section>

    <section class="a5e-actor-details-wrapper">
        <ActorSidebarDetails />
    </section>

    <!-- AC &   -->
    <footer class="a5e-actor-sidebar-footer">
        <ActorSidebarFooter />
    </footer>
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

    .a5e-actor-sidebar-footer {
        position: relative;

        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 0.25rem;
        padding-right: 0.125rem;
        justify-content: space-between;
    }
</style>
