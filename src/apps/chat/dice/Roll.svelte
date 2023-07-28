<script>
    function applyDamage(multiplier = 1) {
        const { character } = game.user;
        const selectedTokens = canvas.tokens.controlled;
        const damage = roll.total * multiplier;

        if (selectedTokens.length)
            selectedTokens.forEach((t) => t.actor.applyDamage(damage));
        else if (character) character.applyDamage(damage);
        else ui.notifications.warn("No tokens selected");
    }

    async function applyHealing(healingType) {
        const { character } = game.user;
        const selectedTokens = canvas.tokens.controlled;

        if (selectedTokens.length) {
            selectedTokens.forEach((t) => {
                t.actor.applyHealing(roll.total, {
                    temp: healingType !== "healing",
                });
            });
        } else if (character) {
            character.applyHealing(roll.total, {
                temp: healingType !== "healing",
            });
        } else {
            ui.notifications.warn("No tokens selected");
        }
    }

    export let roll;
    export let rollData;
    export let isCriticalFailure;
    export let isCriticalSuccess;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="a5e-roll a5e-roll--total u-pointer"
    class:max={isCriticalSuccess}
    class:min={isCriticalFailure}
>
    {roll.total}

    {#if rollData.type === "damage"}
        <ul class="button-list">
            <li>
                <button
                    class="button"
                    data-tooltip="Apply Damage"
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => applyDamage()}
                >
                    <i class="fa-solid fa-heart-crack button__icon" />
                </button>
            </li>

            <li>
                <button
                    class="button"
                    data-tooltip="Apply Half Damage"
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => applyDamage(0.5)}
                >
                    <i class="fa-solid fa-shield-halved button__icon" />
                </button>
            </li>

            <li>
                <button
                    class="button"
                    data-tooltip="Apply Quarter Damage"
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => applyDamage(0.25)}
                >
                    <i class="fa-solid fa-shield button__icon" />
                </button>
            </li>

            <li>
                <button
                    class="button"
                    data-tooltip="Apply Double Damage"
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
            {#if rollData.healingType === "temporaryHealing"}
                <li>
                    <button
                        class="button"
                        data-tooltip={"Apply Temporary Healing"}
                        data-tooltip-direction="UP"
                        on:click|stopPropagation={() =>
                            applyHealing(rollData.healingType)}
                    >
                        <i class="fa-solid fa-heart-circle-bolt button__icon" />
                    </button>
                </li>
            {:else}
                <li>
                    <button
                        class="button"
                        data-tooltip={"Apply Healing"}
                        data-tooltip-direction="UP"
                        on:click|stopPropagation={() =>
                            applyHealing(rollData.healingType)}
                    >
                        <i class="fa-solid fa-heart-circle-plus button__icon" />
                    </button>
                </li>
            {/if}
        </ul>
    {/if}
</div>

<style lang="scss">
    .a5e-roll {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2.25rem;
        width: 2.5rem;
    }

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

    .max {
        color: #18520b;
        background-color: #c7d0c0;
        border: 1px solid #97ae8f;
    }

    .min {
        color: #aa0200;
        background-color: #ffdddd;
        border: 1px solid #f0b5b5;
    }
</style>
