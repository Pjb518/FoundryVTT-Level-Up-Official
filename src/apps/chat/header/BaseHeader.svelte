<script>
import { createEventDispatcher, getContext } from 'svelte';

import zip from '../../../utils/zip';

export let altText;
export let clickableHeader;
export let img;
export let title;
export let subtitle = null;

const dispatch = createEventDispatcher();
const message = getContext('message');

$: showCritDamageToggle = ($message?.flags?.a5e?.rollData ?? []).some(
	(roll) => roll.type === 'damage' && (roll.canCrit ?? true) && roll.critRoll && roll.baseRoll,
);

$: critDamageEnabled = zip($message.rolls ?? [], $message?.flags?.a5e?.rollData ?? []).some(
	([roll, rollData]) => {
		if (rollData.type !== 'damage') return false;
		if (!rollData.canCrit ?? true) return false;
		if (!rollData.critRoll || !rollData.baseRoll) return false;

		if (rollData.baseRoll.formula === roll.formula) return false;

		return true;
	},
);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<header
    class="a5e-card-header"
    class:a5e-card-header--subtitle={subtitle}
    class:a5e-card-header--clickable={clickableHeader}
    role="button"
    tabindex="0"
    on:click={() => dispatch("toggleDescription")}
>
    <img class="a5e-card-header__image" src={img} alt={altText} />

    <h2 class="a5e-card-header__title">{title}</h2>

    {#if subtitle}
        <h3 class="a5e-card-header__subtitle">{subtitle}</h3>
    {/if}

    {#if showCritDamageToggle}
        <button
            class="a5e-card-header__crit-toggle-button fa-solid fa-bullseye"
            class:a5e-card-header__crit-toggle-button--crit={critDamageEnabled}
            data-tooltip="Toggle Critical Damage"
            data-tooltip-direction="LEFT"
            on:click|stopPropagation={() => dispatch("toggleCriticalDamage")}
        />
    {/if}
</header>
