<script lang="ts">
    import { getContext } from "svelte";

    import { editDocumentImage } from "#utils/view/editDocumentImage.ts";
    import ActorDeathSaveOverlay from "./ActorDeathSaveOverlay.svelte";
    import ActorStatusTrack from "./ActorStatusTrack.svelte";
    import ActorRestButton from "./ActorRestButton.svelte";

    function onEditImage(event) {
        editDocumentImage(actor, { shiftKey: event.shiftKey });
    }

    let actor: Actor = getContext("actor");
    let actorStore = $derived(actor.reactive.system);
    let hp = $derived(actorStore.attributes.hp);

    let hpPrimaryPercentage = $derived(
        Math.floor(Math.min((hp.value / hp.max) * 100, 100)),
    );

    let hpTempPercentage = $derived(
        Math.min(((hp.temp || 0) / hp.max) * 100, 100),
    );

    let fatigueOptions = $state([
        { value: 0, hint: "" },
        { value: 1, hint: "A5E.tracks.fatigue.hints.1" },
        { value: 2, hint: "A5E.tracks.fatigue.hints.2" },
        { value: 3, hint: "A5E.tracks.fatigue.hints.3" },
        { value: 4, hint: "A5E.tracks.fatigue.hints.4" },
        { value: 5, hint: "A5E.tracks.fatigue.hints.5" },
        { value: 6, hint: "A5E.tracks.fatigue.hints.6" },
        { value: 7, hint: "A5E.tracks.fatigue.hints.7" },
    ]);

    const strifeOptions = $state([
        { value: 0, hint: "" },
        { value: 1, hint: "A5E.tracks.strife.hints.1" },
        { value: 2, hint: "A5E.tracks.strife.hints.2" },
        { value: 3, hint: "A5E.tracks.strife.hints.3" },
        { value: 4, hint: "A5E.tracks.strife.hints.4" },
        { value: 5, hint: "A5E.tracks.strife.hints.5" },
        { value: 6, hint: "A5E.tracks.strife.hints.6" },
        { value: 7, hint: "A5E.tracks.strife.hints.7" },
    ]);

    const replaceFatigueAndStrife = game.settings.get(
        "a5e",
        "replaceFatigueAndStrife",
    );

    if (replaceFatigueAndStrife) {
        fatigueOptions = [
            { value: 0, hint: "" },
            { value: 1, hint: "A5E.tracks.exhaustion.hints.1" },
            { value: 2, hint: "A5E.tracks.exhaustion.hints.2" },
            { value: 3, hint: "A5E.tracks.exhaustion.hints.3" },
            { value: 4, hint: "A5E.tracks.exhaustion.hints.4" },
            { value: 5, hint: "A5E.tracks.exhaustion.hints.5" },
            { value: 6, hint: "A5E.tracks.exhaustion.hints.6" },
        ];
    }
</script>

<section class="a5e-actor-portrait-wrapper">
    <!-- Hit Point Bar -->
    <div
        class="a5e-actor-hp-bar"
        style="
            --primary-hp-percentage: {hpPrimaryPercentage}%;
            --temp-hp-percentage: {hpTempPercentage}%;
            --secondary-bar-color: #2FA6B1;
        "
    >
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img
            class="a5e-actor-image"
            src={actor.reactive.img}
            alt={actor.reactive.name}
            onclick={onEditImage}
        />

        {#if hp.value === 0}
            <ActorDeathSaveOverlay />
        {/if}
    </div>

    <!-- Status Track Fatigue & Exhaustion  -->
    <ActorStatusTrack
        icon="fa-solid fa-running"
        tooltipText={replaceFatigueAndStrife ? "A5E.Exhaustion" : "A5E.Fatigue"}
        trackProperty="fatigue"
        options={fatigueOptions}
        selectedOption={actorStore.attributes.fatigue}
    />

    <!-- Status Track Strife -->
    {#if !replaceFatigueAndStrife}
        <ActorStatusTrack
            icon="fa-solid fa-brain"
            tooltipText="A5E.Strife"
            trackProperty="strife"
            options={strifeOptions}
            selectedOption={actorStore.attributes.strife}
        />
    {/if}

    <!-- Rest Button -->
    <ActorRestButton />
</section>

<style lang="scss">
    @property --primary-hp-percentage {
        syntax: "<number>";
        inherits: true;
        initial-value: 1;
    }

    @property --temp-hp-percentage {
        syntax: "<number>";
        inherits: true;
        initial-value: 1;
    }

    .a5e-actor-portrait-wrapper {
        position: relative;
        padding: 0 0.5rem 0.125rem 0rem;
        margin-block-end: 0.5rem;
    }

    .a5e-actor-image {
        border-radius: 50%;
        cursor: pointer;
        width: 8rem;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        object-position: top;
        z-index: 1;
    }

    .a5e-actor-hp-bar {
        position: relative;
        width: 9rem;
        aspect-ratio: 1;
        display: inline-grid;
        place-content: center;

        &:before {
            --bar-thickness: 10px;

            background: conic-gradient(
                from 41.5deg,
                hsl(var(--primary-hp-percentage), 50%, 35%)
                    calc(var(--primary-hp-percentage) * 0.775%),
                rgba(0, 0, 0, 0.08) calc(var(--primary-hp-percentage) * 0.775%),
                rgba(0, 0, 0, 0.08) 279deg,
                transparent 0
            );

            @media (prefers-reduced-motion: no-preference) {
                animation: fillPrimaryRing 1s 0.25s both;
            }
        }

        &:after {
            --bar-thickness: 5px;

            background: conic-gradient(
                from 41.5deg,
                var(--secondary-bar-color)
                    calc(var(--temp-hp-percentage) * 0.775%),
                transparent 0
            );

            @media (prefers-reduced-motion: no-preference) {
                animation: fillSecondaryRing 1s 0.25s both;
            }
        }

        &:before,
        &:after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            width: 9rem;
            height: 9rem;
            transform: rotate(90deg);
            border-radius: 50%;
            inset: 0;

            -webkit-mask: radial-gradient(
                farthest-side,
                #0000 calc(99% - var(--bar-thickness)),
                #000 calc(100% - var(--bar-thickness))
            );

            mask: radial-gradient(
                farthest-side,
                #0000 calc(99% - var(--bar-thickness)),
                #000 calc(100% - var(--bar-thickness))
            );
        }
    }

    @keyframes fillPrimaryRing {
        from {
            --primary-hp-percentage: 0;
        }
    }

    @keyframes fillSecondaryRing {
        from {
            --temp-hp-percentage: 0;
        }
    }
</style>
