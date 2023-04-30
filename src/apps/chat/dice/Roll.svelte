<script>
    import RollTooltip from "../dice/RollTooltip.svelte";

    function applyDamage(multiplier = 1) {
        const { character } = game.user;
        const selectedTokens = canvas.tokens.controlled;
        const damage = roll.total * multiplier;

        if (selectedTokens.length) {
            selectedTokens.forEach((token) => {
                const currentHP = token.actor.system.attributes.hp.value;

                token.actor.update({
                    "system.attributes.hp.value": currentHP - damage,
                });
            });
        } else if (character) {
            const currentHP = character.system.attributes.hp.value;

            character.update({
                "system.attributes.hp.value": currentHP - damage,
            });
        } else {
            ui.notifications.warn("No tokens selected");
        }
    }

    function applyHealing(healingType) {
        const { character } = game.user;
        const selectedTokens = canvas.tokens.controlled;

        if (selectedTokens.length) {
            selectedTokens.forEach((token) => {
                const hp = token.actor.system.attributes.hp;
                const currentHP = hp.value;
                const currentTempHp = hp.temp;
                const maxHP = hp.max;

                if (healingType === "Healing") {
                    token.actor.update({
                        "system.attributes.hp.value": Math.min(
                            maxHP,
                            currentHP + roll.total
                        ),
                    });
                } else if (roll.total > currentTempHp) {
                    token.actor.update({
                        "system.attributes.hp.temp": roll.total,
                    });
                }
            });
        } else if (character) {
            const hp = token.actor.system.attributes.hp;
            const currentHP = hp.value;
            const currentTempHp = hp.temp;
            const maxHP = hp.max;

            if (healingType === "Healing") {
                token.actor.update({
                    "system.attributes.hp.value": Math.min(
                        maxHP,
                        currentHP + roll.total
                    ),
                });
            } else if (roll.total > currentTempHp) {
                token.actor.update({
                    "system.attributes.hp.temp": roll.total,
                });
            }
        } else {
            ui.notifications.warn("No tokens selected");
        }
    }

    export let roll;
    export let rollData;

    let tooltipIsVisible = false;
</script>

{#if tooltipIsVisible}
    <RollTooltip
        {roll}
        on:toggleTooltipVisibility={() =>
            (tooltipIsVisible = !tooltipIsVisible)}
    />
{/if}

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class="a5e-roll a5e-roll--total u-pointer"
    on:click={() => (tooltipIsVisible = !tooltipIsVisible)}
>
    {roll.total}

    {#if rollData.type === "damage"}
        <ul class="button-list">
            <li>
                <button
                    class="button"
                    data-tooltip="Apply quarter damage"
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => applyDamage(0.25)}
                >
                    <i class="fa-solid fa-shield button__icon" />
                </button>
            </li>

            <li>
                <button
                    class="button"
                    data-tooltip="Apply half damage"
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => applyDamage(0.5)}
                >
                    <i class="fa-solid fa-shield-halved button__icon" />
                </button>
            </li>

            <li>
                <button
                    class="button"
                    data-tooltip="Apply damage"
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={applyDamage}
                >
                    <i class="fa-solid fa-heart-crack button__icon" />
                </button>
            </li>

            <li>
                <button
                    class="button"
                    data-tooltip="Apply double damage"
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => applyDamage(2)}
                >
                    <i class="fa-solid fa-skull button__icon" />
                </button>
            </li>
        </ul>
    {/if}

    {#if rollData.type === "healing"}
        <ul class="button-list">
            {#if rollData.healingType === "Healing"}
                <li>
                    <button
                        class="button"
                        data-tooltip={"Apply healing"}
                        data-tooltip-direction="UP"
                        on:click|stopPropagation={() =>
                            applyHealing(rollData.healingType)}
                    >
                        <i class="fa-solid fa-heart-circle-plus button__icon" />
                    </button>
                </li>
            {:else}
                <li>
                    <button
                        class="button"
                        data-tooltip={"Apply temporary healing"}
                        data-tooltip-direction="UP"
                        on:click|stopPropagation={() =>
                            applyHealing(rollData.healingType)}
                    >
                        <i class="fa-solid fa-heart-circle-bolt button__icon" />
                    </button>
                </li>
            {/if}
        </ul>
    {/if}
</div>

<style lang="scss">
    .a5e-roll--total {
        position: relative;

        &:hover .button-list {
            display: flex;
        }
    }

    .button-list {
        position: absolute;
        display: none;
        top: 50%;
        right: 1px;
        transform: translateY(-50%);
        gap: 0.25rem;
        padding: 0;
        margin: 0;
        list-style: none;
    }

    .button {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1.375rem;
        width: 1.375rem;
        padding: 0;
        margin: 0;
        font-size: 1rem;
        background: #eee;
        color: #777;

        &__icon {
            margin: 0;
        }
    }
</style>
