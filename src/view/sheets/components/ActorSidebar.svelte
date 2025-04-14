<script>
    import { getContext } from "svelte";

    import ActorHitPoints from "./ActorHitPoints.svelte";

    let actor = getContext("actor");
</script>

<aside class="a5e-actor-sidebar">
    <ActorHitPoints />

    <section>Details</section>

    <!-- AC &   -->
</aside>

<style lang="scss">
    .a5e-actor-sidebar {
        position: relative;
        grid-area: aside;

        display: flex;
        flex-direction: column;

        background: rgba(0, 0, 0, 0.05);
        height: 100%;
        padding: 0.5rem;
        padding-right: 0;
    }
</style>
