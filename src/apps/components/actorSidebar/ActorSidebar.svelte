<script>
    import { getContext } from "svelte";

    import Health from "./Health.svelte";
    import HitPointBar from "./HitPointBar.svelte";
    import StatusTrack from "./StatusTrack.svelte";

    const actor = getContext("actor");
</script>

<div class="actor-sidebar">
    <div class="actor-portrait-wrapper">
        <HitPointBar hp={$actor.system.attributes.hp}>
            <img
                class="actor-image"
                src={$actor.img}
                alt={$actor.name}
                title={$actor.name}
                data-edit="img"
            />
        </HitPointBar>

        <StatusTrack
            icon="fa-running"
            tooltipText="A5E.Fatigue"
            trackProperty="fatigue"
            value={$actor.system.attributes.fatigue}
        />

        <StatusTrack
            icon="fa-brain"
            tooltipText="A5E.Strife"
            trackProperty="strife"
            value={$actor.system.attributes.strife}
        />

        <Health />
    </div>
</div>

<style lang="scss">
    .actor-sidebar {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        height: 100%;
        width: fit-content;
        padding: 1rem;
        border-right: 1px solid #ccc;
    }

    .actor-portrait-wrapper {
        position: relative;
        padding: 0 1.5rem 1rem 1.5rem;
    }

    .actor-image {
        border-radius: 50%;
        cursor: pointer;
        width: 8rem;
        height: 8rem;
        z-index: 1;
    }
</style>
