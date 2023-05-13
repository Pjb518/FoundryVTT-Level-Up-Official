<script>
    import { getContext } from "svelte";

    import editDocumentImage from "../../handlers/editDocumentImage";

    import ArmorClass from "./ArmorClass.svelte";
    import HitDice from "./HitDice.svelte";
    import HitPointBar from "./HitPointBar.svelte";
    import HitPointValues from "./HitPointValues.svelte";
    import Initiative from "./Initiative.svelte";
    import Passives from "./Passives.svelte";
    import RestTrack from "./RestTrack.svelte";
    import StatusTrack from "./StatusTrack.svelte";
    import Details from "./Details.svelte";
    import DeathSaveOverlay from "./DeathSaveOverlay.svelte";

    export let hp;

    const actor = getContext("actor");

    const fatigueOptions = [
        { value: 0, hint: null },
        { value: 1, hint: "A5E.tracks.fatigue.hints.1" },
        { value: 2, hint: "A5E.tracks.fatigue.hints.2" },
        { value: 3, hint: "A5E.tracks.fatigue.hints.3" },
        { value: 4, hint: "A5E.tracks.fatigue.hints.4" },
        { value: 5, hint: "A5E.tracks.fatigue.hints.5" },
        { value: 6, hint: "A5E.tracks.fatigue.hints.6" },
        { value: 7, hint: "A5E.tracks.fatigue.hints.7" },
    ];

    const strifeOptions = [
        { value: 0, hint: null },
        { value: 1, hint: "A5E.tracks.strife.hints.1" },
        { value: 2, hint: "A5E.tracks.strife.hints.2" },
        { value: 3, hint: "A5E.tracks.strife.hints.3" },
        { value: 4, hint: "A5E.tracks.strife.hints.4" },
        { value: 5, hint: "A5E.tracks.strife.hints.5" },
        { value: 6, hint: "A5E.tracks.strife.hints.6" },
        { value: 7, hint: "A5E.tracks.strife.hints.7" },
    ];

    async function onEditImage() {
        await editDocumentImage($actor);
    }

    $: hp = $actor.system.attributes.hp;
</script>

<div class="actor-sidebar">
    <section class="actor-portrait-wrapper">
        <HitPointBar {hp}>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <img
                class="actor-image"
                src={$actor.img}
                alt={$actor.name}
                title={$actor.name}
                on:click={onEditImage}
            />

            {#if hp.value === 0}
                <DeathSaveOverlay />
            {/if}
        </HitPointBar>

        <StatusTrack
            icon="fa-running"
            tooltipText="A5E.Fatigue"
            trackProperty="fatigue"
            options={fatigueOptions}
            selectedOption={$actor.system.attributes.fatigue}
        />

        <StatusTrack
            icon="fa-brain"
            tooltipText="A5E.Strife"
            trackProperty="strife"
            options={strifeOptions}
            selectedOption={$actor.system.attributes.strife}
        />

        <RestTrack />
    </section>

    <section class="actor-sidebar-lower">
        <HitPointValues {hp} />

        <ul class="actor-glance-trackers">
            <ArmorClass />
            <HitDice />
            <Initiative />
        </ul>

        <div class="actor-details">
            <Details />
        </div>

        <footer class="actor-sidebar-footer">
            <Passives />
        </footer>
    </section>
</div>

<style lang="scss">
    .actor-sidebar {
        display: flex;
        flex-direction: column;
        flex-grow: 0;
        flex-shrink: 0;
        height: 100%;
        width: 200px;
        padding: 0.5rem;
        border-right: 1px solid #ccc;
    }

    .actor-portrait-wrapper {
        position: relative;
        padding: 0 0.5rem 0.125rem 0rem;
        margin-block-end: 0.5em;
    }

    .actor-image {
        border-radius: 50%;
        cursor: pointer;
        width: 8rem;
        height: 8rem;
        object-fit: cover;
        object-position: top;
        z-index: 1;
    }

    .actor-sidebar-lower {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.5rem;
        height: 100%;
        overflow: hidden;
    }

    .actor-glance-trackers {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        gap: 0.5rem;
        font-family: "Modesto Condensed", serif;
        padding: 0;
        list-style: none;
    }

    .actor-details {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        flex-grow: 1;
        overflow-y: auto;
    }

    .actor-sidebar-footer {
        display: flex;
        gap: 0.25rem;
    }
</style>
