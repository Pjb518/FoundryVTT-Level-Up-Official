<script>
    import { createEventDispatcher, onDestroy } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import getFormattedTimeFromSeconds from "../../utils/getFormattedTimeFromSeconds";

    export let actor;
    export let description;
    export let conditionId;
    export let linked = null;
    export let icon;
    export let _id;
    export let name;

    function getEffectDuration() {
        const effect = actor?.effects.get(_id);
        const duration = effect?.duration ?? {};

        let notes =
            '<p class="u-flex u-gap-xs u-align-center a5e-tag a5e-tag--active a5e-tag--tight">';

        notes += '<i class="fa-regular fa-clock"></i>';

        const { startTime, seconds, rounds, turns } = duration;
        if (!seconds && !rounds && !turns) {
            notes += "Infinite</p>";
            return notes;
        }

        let totalDuration = seconds;
        if (rounds === 1 && turns === 1) {
            totalDuration = 0;
        } else if (rounds >= 1) {
            totalDuration = rounds * 6;
        }
        totalDuration ??= 0;

        const remainingDuration =
            startTime + totalDuration - game.time.worldTime ?? 0;

        if (remainingDuration <= 0 && !turns) {
            return '<p class="a5e-tag a5e-tag--red a5e-tag--tight">Expired</p>';
        }

        notes += `${seconds ? "Remaining: " : ""} ${getFormattedTimeFromSeconds(
            remainingDuration,
            rounds,
            turns
        )}`;
        notes += "</p>";

        return notes;
    }

    function getEffectNotes() {
        let notes =
            '<div class="u-flex u-flex-row-reverse u-gap-md u-text-xs">';

        notes += duration;

        if (conditionId) {
            notes += `<p class="a5e-tag a5e-tag--active a5e-tag--tight">
                Condition
                </p>`;
        } else {
            notes += `<p class="a5e-tag a5e-tag--active a5e-tag--tight">
                Active Effect
                </p>`;
        }

        if (linked) {
            notes += `<p class="a5e-tag a5e-tag--active a5e-tag--tight">
                Applied by: ${conditions?.[linked]}
                </p>`;
        }

        notes += "</div>";
        return notes;
    }

    function getEffectDescription(actor) {
        if (description) return description;

        const { fatigue, strife } = actor.system.attributes;

        if (name === localize("A5E.Exhaustion")) {
            return localize(`A5E.tracks.exhaustion.hints.${fatigue}`);
        }

        if (conditionId === "fatigue") {
            return localize(`A5E.tracks.fatigue.hints.${fatigue}`);
        }

        if (conditionId === "strife") {
            return localize(`A5E.tracks.strife.hints.${strife}`);
        }

        return "";
    }

    function getEffectName(actor) {
        const { fatigue, strife } = actor.system.attributes;

        if (conditionId === "fatigue") return `${name} (${fatigue}) `;
        if (conditionId === "strife") return `${name} (${strife}) `;

        return name;
    }

    function getEffectRemovalNote() {
        if (linked) return "";

        if (conditionId === "fatigue") {
            return `<small class="a5e-effect-item__removal-note">Right click to remove a level of fatigue.</small>`;
        }

        if (conditionId === "strife") {
            return `<small class="a5e-effect-item__removal-note">Right click to remove a level of strife.</small>`;
        }

        return `<small class="a5e-effect-item__removal-note">Right click the icon to remove this ${
            conditionId ? "condition" : "effect"
        }.</small>`;
    }

    const dispatch = createEventDispatcher();

    const colors = {
        1: "#919f00",
        2: "#a09200",
        3: "#af8300",
        4: "#bd7100",
        5: "#cb5c00",
        6: "#d63f00",
        7: "#e00006",
    };

    const { conditions } = CONFIG.A5E;

    $: duration = getEffectDuration(actor);

    const durationHook = Hooks.on(
        "updateWorldTime",
        () => (duration = getEffectDuration(actor))
    );

    onDestroy(() => Hooks.off("updateWorldTime", durationHook));

    $: fatigue = actor?.system.attributes.fatigue ?? 0;
    $: strife = actor?.system.attributes.strife ?? 0;

    $: tooltip = `
        <div class="a5e-effect-item__details">
            <h3 class="a5e-effect-item__heading">${getEffectName(actor)}</h3>
            ${getEffectDescription(actor)}
            ${getEffectRemovalNote()}
            ${getEffectNotes(actor, duration)}
        </div>
    `;
</script>

<div
    class:linked={!!linked}
    class:fatigue-counter={conditionId === "fatigue"}
    class:strife-counter={conditionId === "strife"}
    style="--strife: '{strife}'; --fatigue: '{fatigue}'; --fatigue-col: {colors[
        fatigue
    ]}; --strife-col: {colors[strife]}"
>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <li
        class="a5e-effect-item"
        data-tooltip={tooltip}
        data-tooltip-direction="LEFT"
        on:click={() => dispatch("increaseCounter", _id)}
        on:auxclick={() => linked ?? dispatch("deleteEffect", _id)}
    >
        <img class="a5e-effect-item__icon" src={icon} alt={name} />
    </li>
</div>

<style lang="scss">
    :global(.a5e-effect-item__details) {
        font-size: 0.833rem;
    }

    :global(.a5e-effect-item__heading) {
        margin-bottom: 0;
        border-bottom: 0;
        font-size: 1rem;
    }

    :global(.a5e-effect-item__removal-note) {
        display: block;
        margin-block: 0.25rem 0.125rem;
        opacity: 0.75;
    }

    .a5e-effect-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: var(--icon-size, 2.5rem);
        width: var(--icon-size, 2.5rem);
        border-radius: 50%;
        background-color: rgba(20, 20, 20, 0.6);
        backdrop-filter: blur(3px);
        box-shadow: 0 0 0 1px #e9d7a1, 0 0 0 2px #956d58;
        cursor: pointer;
        overflow: hidden;

        &__icon {
            height: 100%;
            width: 100%;
            object-fit: cover;
            object-position: top;
            border: none;
        }
    }

    .linked,
    .fatigue-counter,
    .strife-counter {
        position: relative;

        &::after {
            content: "\f0c1";
            font: var(--fa-font-solid);

            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1px;

            background-color: rgba(0 0 0 / 0.45);
            border-radius: 50%;
            width: 1rem;
            aspect-ratio: 1/1;
            color: white;
            font-size: $font-size-xs;
            font-weight: 400;

            position: absolute;
            top: -0.375rem;
            right: -0.375rem;
        }
    }

    .fatigue-counter::after {
        content: var(--fatigue);
        font-family: $font-secondary;
        font-size: 0.833rem;
        background-color: var(--fatigue-col);
    }

    .strife-counter::after {
        content: var(--strife);
        font-family: $font-secondary;
        font-size: 0.833rem;
        background-color: var(--strife-col);
    }
</style>
