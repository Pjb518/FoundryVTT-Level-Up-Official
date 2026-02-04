<script lang="ts">
    import { getContext } from "svelte";

    import { pressedKeys } from "#stores/pressedKeysStore.svelte.ts";
    import { getKeyPressAsOptions } from "#utils/view/getKeyPressAsOptions.ts";

    function getRollOptions() {
        const options = getKeyPressAsOptions(pressedKeys, {
            reverseAlt: game.settings.get(
                "a5e",
                "reverseInitiativeAltBehavior",
            ) as boolean,
        }) as Record<string, any>;

        options.expertiseDie = actor.RollOverrideManager.getExpertiseDice(
            "initiative",
            options.expertiseDie ?? 0,
            { ability: abilityKey },
        );

        options.rollMode = actor.RollOverrideManager.getRollOverride(
            "initiative",
            options.rollMode,
            {
                ability: abilityKey,
            },
        );

        return options;
    }

    let actor: Actor = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    let actorStore = $derived(actor.reactive.system);
    let abilityKey = $derived(actorStore.attributes.initiative.ability ?? "dex");
</script>

<li class="a5e-actor-initiative__wrapper">
    <h4 class="a5e-actor-initiative__label">Initiative</h4>

    {#if sheetIsLocked()}
        <button
            class="a5e-button a5e-actor-initiative__roll-button"
            class:a5e-actor-initiative__roll-button--shift={pressedKeys.Shift}
            class:a5e-actor-initiative__roll-button--ctrl={pressedKeys.Control}
            class:disable-pointer-events={!actor.isOwner}
            data-tooltip="A5E.rollLabels.initiative"
            data-tooltip-direction="DOWN"
            aria-label="Roll Initiative"
            onclick={() =>
                actor.rollInitiative({
                    createCombatants: true,
                    initiativeOptions: {
                        rollOptions: getRollOptions(),
                    },
                })}
        >
            <i class="fa-solid fa-dice-d20"></i>
        </button>
    {:else}
        <button
            class="a5e-button a5e-actor-initiative__roll-button"
            data-tooltip="A5E.initiative.configurationTitle"
            data-tooltip-direction="DOWN"
            aria-label="Configure Initiative"
            onclick={() => actor.configureInitiative()}
        >
            <i class="fa-solid fa-cog"></i>
        </button>
    {/if}
</li>

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .a5e-actor-initiative {
        &__roll-button {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-grow: 1;
            height: 2.5rem;
            width: 2.5rem;
            margin-inline: auto;
            font-size: var(--a5e-xl-text);
            color: var(--a5e-button-gray);
            background: transparent;
            border: 0;
            cursor: pointer;

            transition: var(--a5e-transition-standard);

            &:hover {
                transform: scale(1.2);
                color: var(--a5e-button-gray-hover);
                box-shadow: none;
            }

            &--ctrl:hover {
                color: #ffb63b;
            }

            &--shift:hover {
                color: #488f9a;
            }
        }

        &__label {
            padding-bottom: 0.125rem;
            font-family: var(--a5e-condensed-font);
            font-size: var(--a5e-sm-text);
            font-weight: 700;
            text-align: center;
            margin: 0.1rem;
            margin-top: 0.5rem;
        }

        &__wrapper {
            position: relative;
            font-family: var(--a5e-condensed-font);
        }
    }
</style>
