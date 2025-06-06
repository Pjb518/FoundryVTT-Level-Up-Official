<script>
    import ActorHitDice from "./ActorHitDice.svelte";
    import ActorHitPoints from "./ActorHitPoints.svelte";
    import ActorInitiative from "../../../../apps/components/actorSidebar/ActorInitiative.svelte";
    import ActorSidebarPortrait from "./ActorSidebarPortrait.svelte";
    import ActorSidebarAC from "./ActorSidebarAC.svelte";
    import ActorSidebarDetails from "./ActorSidebarDetails.svelte";
    import ActorSidebarFooter from "./ActorSidebarFooter.svelte";
</script>

<aside class="a5e-actor-sidebar">
    <!-- Portrait -->
    <ActorSidebarPortrait />

    <!-- AC and Trackers -->
    <section class="a5e-actor-sidebar__hp-container">
        <ActorHitPoints />

        <ul class="a5e-actor-sidebar__glance-trackers">
            <ActorSidebarAC />
            <ActorHitDice />
            <ActorInitiative />
        </ul>
    </section>

    <!-- Details -->
    <section class="a5e-actor-sidebar__details-wrapper">
        <ActorSidebarDetails />
    </section>

    <!-- AC -->
    <footer class="a5e-actor-sidebar__footer">
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
        gap: 0.25rem;

        height: 100%;
        padding: 0.5rem;
        border-right: 1px solid var(--a5e-border-color);

        background: rgba(0, 0, 0, 0.05);

        &__hp-container {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }

        &__glance-trackers {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            gap: 0.5rem;
            font-family: var(--a5e-condensed-font);
            padding: 0;
            list-style: none;
            margin: 0;
        }

        &__details-wrapper {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            flex-grow: 1;
            overflow-y: auto;
            overflow-x: clip;
            margin-bottom: 0.5rem;
        }

        &__footer {
            display: flex;
            gap: 0.25rem;
        }
    }
</style>
