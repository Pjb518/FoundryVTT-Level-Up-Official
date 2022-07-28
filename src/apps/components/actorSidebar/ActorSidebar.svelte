<script>
    import { getContext } from "svelte";

    import BonusHpDisplay from "./BonusHPDisplay.svelte";
    import HitPointBar from "./HitPointBar.svelte";
    import PrimaryHPDisplay from "./PrimaryHPDisplay.svelte";
    import StatusTrack from "./StatusTrack.svelte";
    import TempHPDisplay from "./TempHPDisplay.svelte";

    export let hp;

    const actor = getContext("actor");

    $: hp = $actor.system.attributes.hp;
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

        <TempHPDisplay {hp} />
        <PrimaryHPDisplay {hp} />
        <BonusHpDisplay {hp} />

        <!-- <HitPointValues /> -->
    </div>
</div>

<style lang="scss">
    .actor-sidebar {
        display: flex;
        flex-direction: column;
        flex-grow: 0;
        flex-shrink: 0;
        height: 100%;
        width: 217px;
        padding: 0.75rem;
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
