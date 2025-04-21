<script>
    import { getContext } from "svelte";

    import ActorHitPoints from "./ActorHitPoints.svelte";
    import ActorSidebarAC from "./ActorSidebarAC.svelte";
    import ActorSidebarDetails from "./ActorSidebarDetails.svelte";
    import ActorSidebarFooter from "./ActorSidebarFooter.svelte";

    let actor = getContext("actor");
</script>

<aside class="a5e-actor-sidebar">
    <!-- Portrait & Hp -->
    <section class="a5e-actor-portrait-wrapper">
        <ActorHitPoints />
    </section>

    <!-- AC and Trackers -->
    <section class="a5e-actor-sidebar-ac">
        <ActorSidebarAC />
    </section>

    <!-- Details -->
    <section class="a5e-actor-details-wrapper">
        <ActorSidebarDetails />
    </section>

    <!-- AC -->
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
        gap: 0.75rem;

        height: 100%;
        padding: 0.5rem;
        padding-right: 0;
        border-right: 1px solid var(--a5e-border-color);

        background: rgba(0, 0, 0, 0.05);
    }

    .a5e-actor-portrait-wrapper {
        position: relative;
        padding-right: 0.125rem;
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
