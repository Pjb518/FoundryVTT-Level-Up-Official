<script>
import { createEventDispatcher, onDestroy } from 'svelte';
import { localize } from '#runtime/util/i18n';

import getFormattedTimeFromSeconds from '../../utils/getFormattedTimeFromSeconds';

export let actor;
export let description;
export let conditionId;
export let linked = null;
export let img;
export let _id;
export let name;

function getEffectDuration() {
	const effect = actor?.effects.get(_id);
	const duration = effect?.duration ?? {};

	let notes = '<p class="u-flex u-gap-xs u-align-center a5e-tag a5e-tag--active a5e-tag--tight">';

	notes += '<i class="fa-regular fa-clock"></i>';

	const { startTime, seconds, rounds, turns } = duration;
	if (!seconds && !rounds && !turns) {
		notes += 'Infinite</p>';
		return notes;
	}

	let totalDuration = seconds;
	if (rounds === 1 && turns === 1) {
		totalDuration = 0;
	} else if (rounds >= 1) {
		totalDuration = rounds * 6;
	}
	totalDuration ??= 0;

	const remainingDuration = startTime + totalDuration - game.time.worldTime ?? 0;

	if (remainingDuration <= 0 && !turns) {
		return '<p class="a5e-tag a5e-tag--red a5e-tag--tight">Expired</p>';
	}

	notes += `${seconds ? 'Remaining: ' : ''} ${getFormattedTimeFromSeconds(
		remainingDuration,
		rounds,
		turns,
	)}`;
	notes += '</p>';

	return notes;
}

function getEffectNotes() {
	let notes = '<div class="u-flex u-flex-row-reverse u-gap-md u-text-xs">';

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

	notes += '</div>';
	return notes;
}

function getEffectDescription(actor) {
	if (description) return description;

	const { corruption, fatigue, inebriated, strife } = actor.system.attributes;

	if (conditionId === 'corruption') {
		return localize(`A5E.tracks.corruption.hints.${corruption}`);
	}

	if (name === localize('A5E.conditions.exhaustion')) {
		return localize(`A5E.tracks.exhaustion.hints.${fatigue}`);
	}

	if (conditionId === 'fatigue') {
		return localize(`A5E.tracks.fatigue.hints.${fatigue}`);
	}

	if (conditionId === 'inebriated') {
		return localize(`A5E.tracks.inebriated.hints.${inebriated}`);
	}

	if (conditionId === 'strife') {
		return localize(`A5E.tracks.strife.hints.${strife}`);
	}

	return '';
}

function getEffectName(actor) {
	const { corruption, fatigue, inebriated, strife } = actor.system.attributes;

	if (conditionId === 'corruption') return `${name} (${corruption}) `;
	if (conditionId === 'fatigue') return `${name} (${fatigue}) `;
	if (conditionId === 'inebriated') return `${name} (${inebriated}) `;
	if (conditionId === 'strife') return `${name} (${strife}) `;

	return name;
}

function getEffectRemovalNote() {
	if (linked) return '';

	if (
		conditionId === 'corruption' ||
		conditionId === 'fatigue' ||
		conditionId === 'inebriated' ||
		conditionId === 'strife'
	) {
		return `
                <small class="a5e-tooltip__note">
                    Right click to remove a level of ${conditionId}.
                </small>
            `;
	}

	return `
            <small class="a5e-tooltip__note">
                Right click the icon to remove this ${conditionId ? 'condition' : 'effect'}.
            </small>
        `;
}

const dispatch = createEventDispatcher();

const colors = {
	1: '#919f00',
	2: '#a09200',
	3: '#af8300',
	4: '#bd7100',
	5: '#cb5c00',
	6: '#d63f00',
	7: '#e00006',
};

const { conditions } = CONFIG.A5E;

$: duration = getEffectDuration(actor);

const durationHook = Hooks.on('updateWorldTime', () => (duration = getEffectDuration(actor)));

onDestroy(() => Hooks.off('updateWorldTime', durationHook));

$: corruption = actor?.system.attributes.corruption ?? 0;
$: fatigue = actor?.system.attributes.fatigue ?? 0;
$: inebriated = actor?.system.attributes.inebriated ?? 0;
$: strife = actor?.system.attributes.strife ?? 0;

$: tooltip = `
        <h3 class="a5e-tooltip__heading">${getEffectName(actor)}</h3>
        ${getEffectDescription(actor)}
        ${getEffectRemovalNote()}
        ${getEffectNotes(actor, duration)}
    `;
</script>

<div
    class:linked={!!linked}
    class:corruption-counter={conditionId === "corruption"}
    class:fatigue-counter={conditionId === "fatigue"}
    class:inebriated-counter={conditionId === "inebriated"}
    class:strife-counter={conditionId === "strife"}
    style="--strife: '{strife}'; --fatigue: '{fatigue}'; --fatigue-col: {colors[
        fatigue
    ]}; --strife-col: {colors[
        strife
    ]};  --corruption: '{corruption}'; --corruption-col: {colors[
        corruption
    ]};  --inebriated: '{inebriated}'; --inebriated-col: {colors[inebriated]};"
>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <li
        class="a5e-effect-item"
        data-tooltip={tooltip}
        data-tooltip-direction="LEFT"
        data-tooltip-class="a5e-tooltip a5e-tooltip--dark a5e-tooltip--effect-summary"
        on:click={() => dispatch("increaseCounter", _id)}
        on:auxclick={() => linked ?? dispatch("deleteEffect", _id)}
    >
        <img
            class="a5e-effect-item__icon"
            class:a5e-effect-item__icon--svg={img?.endsWith(".svg")}
            src={img}
            alt={name}
        />
    </li>
</div>

<style lang="scss">
    .a5e-effect-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: var(--icon-size, 2.5rem);
        width: var(--icon-size, 2.5rem);
        border-radius: 50%;
        background-color: rgba(20, 20, 20, 0.6);
        backdrop-filter: blur(3px);
        filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.4));
        box-shadow:
            0 0 0 1px #e9d7a1,
            0 0 0 2px #956d58;
        cursor: pointer;
        overflow: hidden;

        &__icon {
            height: 100%;
            width: 100%;
            object-fit: cover;
            object-position: top;
            border: none;

            &--svg {
                height: 75%;
                width: 75%;
            }
        }
    }

    .linked,
    .corruption-counter,
    .fatigue-counter,
    .inebriated-counter,
    .strife-counter {
        position: relative;

        &::after {
            content: "\f0c1";
            position: absolute;
            top: -0.4rem;
            right: -0.4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1rem;
            padding: 1px;
            font: var(--fa-font-solid);
            font-size: var(--a5e-text-size-xs);
            font-weight: 400;
            color: white;
            background-color: rgba(20, 20, 20, 0.6);
            box-shadow:
                0 0 0 1px #e9d7a1,
                0 0 0 2px #956d58;
            backdrop-filter: blur(1px);
            border-radius: 50%;
            aspect-ratio: 1/1;
        }
    }

    .corruption-counter::after {
        content: var(--corruption);
        font-family: --a5e-font-sans-serif;
        font-size: var(--a5e-text-size-sm);
        background-color: var(--corruption-col);
    }

    .fatigue-counter::after {
        content: var(--fatigue);
        font-family: --a5e-font-sans-serif;
        font-size: var(--a5e-text-size-sm);
        background-color: var(--fatigue-col);
    }

    .inebriated-counter::after {
        content: var(--inebriated);
        font-family: --a5e-font-sans-serif;
        font-size: var(--a5e-text-size-sm);
        background-color: var(--inebriated-col);
    }

    .strife-counter::after {
        content: var(--strife);
        font-family: --a5e-font-sans-serif;
        font-size: var(--a5e-text-size-sm);
        background-color: var(--strife-col);
    }
</style>
