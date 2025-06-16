<script lang="ts">
    type Props = {
        roll: any;
        rollData: any;
    };

    function applyDamage(damageType = null, multiplier = 1, temp = false) {
        if (multiplier < 0) {
            applyHealing(temp ? "temporaryHealing" : "healing");
            return;
        }

        const { character } = game.user;
        const selectedTokens = canvas.tokens.controlled;
        const damage = roll.total * multiplier;

        if (selectedTokens.length)
            selectedTokens.forEach((token) =>
                token.actor.applyDamage(damage, damageType),
            );
        else if (character) character.applyDamage(damage, damageType);
        else ui.notifications.warn("No tokens selected");
    }

    async function applyHealing(healingType) {
        const { character } = game.user;
        const selectedTokens = canvas.tokens.controlled;

        if (selectedTokens.length) {
            selectedTokens.forEach((token) => {
                token.actor.applyHealing(roll.total, healingType);
            });
        } else if (character) {
            character.applyHealing(roll.total, healingType);
        } else {
            ui.notifications.warn("No tokens selected");
        }
    }

    let { roll, rollData }: Props = $props();

    const damageButtons = [
        {
            label: "Grant Temporary Hit Points",
            multiplier: -1,
            temp: true,
            icon: "fa-heart-circle-bolt",
        },
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
        <i class="damage-menu__button icon fa-heart-circle-minus fa-solid"></i>

        <ol class="damage-buttons">
            {#each damageButtons as { label, multiplier, temp, icon }}
                <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <li
                    class="damage-buttons__item"
                    role="button"
                    onclick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        applyDamage(rollData.damageType, multiplier, temp);
                    }}
                >
                    <span>{label}</span>
                    <i class="icon fa-solid {icon} button__icon"></i>
                </li>
            {/each}
        </ol>
    </div>
{:else if rollData.healingType === "temporaryHealing"}
    <button
        class="a5e-button healing-button"
        data-tooltip="Apply Temporary Healing"
        data-tooltip-direction="LEFT"
        aria-label="Apply Temporary Healing"
        onclick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            applyHealing(rollData.healingType);
        }}
    >
        <i class="icon fa-solid fa-heart-circle-bolt button__icon"></i>
    </button>
{:else if rollData.healingType === "healing"}
    <button
        class="a5e-button healing-button"
        data-tooltip={"Apply Healing"}
        data-tooltip-direction="LEFT"
        aria-label="Apply Healing"
        onclick={(e) => {
            e.stopPropagation();
            applyHealing(rollData.healingType);
        }}
    >
        <i class="icon fa-solid fa-heart-circle-plus button__icon"></i>
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
        border: 1px solid var(--a5e-chat-card-border-color);
        border-radius: var(--a5e-border-radius-standard);

        &__item {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.5rem;
            flex-wrap: nowrap;
            padding: 0.125rem 0.5rem;
            white-space: nowrap;
            background: var(--a5e-chat-card-damage-apply-background);
            color: var(--a5e-text-color-medium);

            transition: var(--a5e-transition-standard);

            &:hover {
                color: var(--a5e-text-color-dark);
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
            color: var(--a5e-text-color-medium);
            background: var(--a5e-chat-card-button-background);
            border: 1px solid var(--a5e-chat-card-border-color);
            border-radius: var(--a5e-border-radius-standard);

            transition: var(--a5e-transition-standard);

            &:hover {
                color: var(--a5e-text-color-dark);
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
        color: var(--a5e-text-color-medium);
        background: var(--a5e-chat-card-button-background);
        border: 1px solid var(--a5e-chat-card-border-color);
        border-radius: var(--a5e-border-radius-standard);

        transition: var(--a5e-transition-standard);

        &:hover {
            color: var(--a5e-text-color-dark);
            box-shadow: none;
        }
    }
</style>
