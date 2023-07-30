<script>
    function applyDamage(multiplier = 1) {
        if (multiplier < 0) {
            applyHealing("healing");
            return;
        }

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

    const damageButtons = [
        {
            label: "Apply Damage as Healing",
            multiplier: -1,
            icon: "fa-heart-circle-plus",
        },
        {
            label: "Apply Double Damage",
            multiplier: 2,
            icon: "fa-skull",
        },
        {
            label: "Apply Quarter Damage",
            multiplier: 0.25,
            icon: "fa-shield",
        },
        {
            label: "Apply Half Damage",
            multiplier: 0.5,
            icon: "fa-shield-halved",
        },
        {
            label: "Apply Damage",
            multiplier: 1,
            icon: "fa-heart-crack",
        },
    ];
</script>

{#if rollData.type === "damage"}
    <div class="damage-menu">
        <i class="damage-menu__button fa-heart-circle-minus fa-solid" />

        <ol class="damage-buttons">
            {#each damageButtons as { label, multiplier, icon }}
                <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-to-interactive-role -->
                <li
                    class="damage-buttons__item"
                    role="button"
                    on:click|stopPropagation={() => applyDamage(multiplier)}
                >
                    <span>{label}</span>
                    <i class="fa-solid {icon} button__icon" />
                </li>
            {/each}
        </ol>
    </div>
{/if}

{#if rollData.healingType === "temporaryHealing"}
    <button
        class="healing-button"
        data-tooltip={"Apply Temporary Healing"}
        data-tooltip-direction="LEFT"
        on:click|stopPropagation={() => applyHealing(rollData.healingType)}
    >
        <i class="fa-solid fa-heart-circle-bolt button__icon" />
    </button>
{:else if rollData.healingType === "healing"}
    <button
        class="healing-button"
        data-tooltip={"Apply Healing"}
        data-tooltip-direction="LEFT"
        on:click|stopPropagation={() => applyHealing(rollData.healingType)}
    >
        <i class="fa-solid fa-heart-circle-plus button__icon" />
    </button>
{/if}

<style lang="scss">
    .damage-buttons {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        transform: translateY(-100%);
        margin: 0;
        padding: 0;
        list-style: none;
        border: 1px solid #ccc;
        border-radius: 3px;

        &__item {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.5rem;
            flex-wrap: nowrap;
            padding: 0.125rem 0.5rem;
            white-space: nowrap;
            background: #e1ddd5;
            color: #7e7960;

            transition: all 0.15s ease-in-out;

            &:hover {
                color: #191813;
            }
        }
    }

    .damage-menu {
        position: relative;
        margin-left: auto;

        &:hover .damage-buttons {
            display: block;
        }

        &__button {
            width: fit-content;
            margin: 0;
            padding: 0.25rem 0.375rem;
            line-height: 1;
            color: #7e7960;
            background: rgba(0, 0, 0, 0.05);
            border: 1px solid #ccc;
            border-radius: 3px;

            transition: all 0.15s ease-in-out;

            &:hover {
                color: #191813;
                box-shadow: none;
            }
        }
    }

    .healing-button {
        display: block;
        width: fit-content;
        margin: 0;
        margin-left: auto;
        padding: 0.25rem 0.375rem;
        line-height: 1;
        color: #7e7960;
        background: rgba(0, 0, 0, 0.05);
        border: 1px solid #ccc;
        border-radius: 3px;

        transition: all 0.15s ease-in-out;

        &:hover {
            color: #191813;
            box-shadow: none;
        }
    }
</style>
