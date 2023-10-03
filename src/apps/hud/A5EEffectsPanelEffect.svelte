<script>
    import { createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    export let actor;
    export let description;
    export let icon;
    export let _id;
    export let name;

    // TODO: Find a way to map the conditions to their descriptions that isn't based on
    // name, as this will change with localization.
    function getEffectDescription(actor) {
        if (description) return description;

        const { fatigue, strife } = actor.system.attributes;

        if (name === localize("A5E.Exhaustion")) {
            return localize(`A5E.tracks.exhaustion.hints.${fatigue}`);
        }

        if (name === conditions.fatigue) {
            return localize(`A5E.tracks.fatigue.hints.${fatigue}`);
        }

        if (name === conditions.strife) {
            return localize(`A5E.tracks.strife.hints.${strife}`);
        }

        return conditionDescriptions[name.toLowerCase()] ?? "";
    }

    function getEffectName(actor) {
        const { fatigue, strife } = actor.system.attributes;

        if (name === conditions.fatigue || name === conditions.exhaustion) {
            return `${name} (${fatigue}) `;
        }

        if (name === conditions.strife) return `${name} (${strife}) `;

        return name;
    }

    const { conditionDescriptions, conditions } = CONFIG.A5E;
    const dispatch = createEventDispatcher();

    $: tooltip = `
    <div class="a5e-effect-item__details">
    <h3 class="a5e-effect-item__heading">${getEffectName(actor)}</h3>
    ${getEffectDescription(actor)}
    </div>
    `;
</script>

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
</style>
