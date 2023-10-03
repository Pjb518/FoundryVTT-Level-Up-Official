<script>
    import { createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    export let actor;
    export let description;
    export let conditionId;
    export let linked = null;
    export let icon;
    export let _id;
    export let name;

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

    $: fatigue = actor?.system.attributes.fatigue ?? 0;
    $: strife = actor?.system.attributes.strife ?? 0;

    $: tooltip = `
    <div class="a5e-effect-item__details">
    <h3 class="a5e-effect-item__heading">${getEffectName(actor)}</h3>
    ${getEffectDescription(actor)}
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
        on:auxclick={() => dispatch("deleteEffect", _id)}
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

    .a5e-effect-item {
        display: flex;
        height: var(--icon-size, 2.5rem);
        width: var(--icon-size, 2.5rem);
        border: 1px solid #e9d7a1;
        border-radius: 50%;
        cursor: pointer;

        &__icon {
            height: 100%;
            width: 100%;
            border: 1px solid black;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.6);
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
            width: 1.25rem;
            aspect-ratio: 1/1;
            color: white;
            font-size: 0.833rem;

            position: absolute;
            top: -0.75rem;
            left: 1.65rem;
        }
    }

    .fatigue-counter::after {
        content: var(--fatigue);
        font-family: $font-secondary;
        font-size: 1rem;
        background-color: var(--fatigue-col);
    }

    .strife-counter::after {
        content: var(--strife);
        font-family: $font-secondary;
        font-size: 1rem;
        background-color: var(--strife-col);
    }
</style>
