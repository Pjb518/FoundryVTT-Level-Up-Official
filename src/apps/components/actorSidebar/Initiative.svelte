<script>
    import { getContext } from "svelte";

    import pressedKeysStore from "../../../stores/pressedKeysStore";
    import getKeyPressAsOptions from "../../handlers/getKeyPressAsOptions";
    import overrideRollMode from "../../../utils/overrideRollMode";

    const actor = getContext("actor");
    const { settings } = game;

    function getRollOptions() {
        const options = getKeyPressAsOptions($pressedKeysStore, {
            reverseAlt: settings.get("a5e", "reverseInitiativeAltBehavior"),
        });

        options.rollMode = overrideRollMode($actor, options.rollMode, {
            ability: "dex",
            type: "initiative",
        });

        return options;
    }

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<li>
    <h4 class="initiative-label">Initiative</h4>

    {#if sheetIsLocked}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <i
            class="initiative-roll-button fas fa-dice-d20"
            class:initiative-roll-button--shift={$pressedKeysStore.Shift}
            class:initiative-roll-button--ctrl={$pressedKeysStore.Control}
            class:disable-pointer-events={!$actor.isOwner}
            data-tooltip="A5E.RollInitiative"
            data-tooltip-direction="DOWN"
            on:click={() =>
                $actor.rollInitiative({
                    createCombatants: true,
                    initiativeOptions: {
                        rollOptions: getRollOptions(),
                    },
                })}
        />
    {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <i
            class="initiative-roll-button fas fa-cog"
            data-tooltip="A5E.InitiativeConfigurationTitle"
            data-tooltip-direction="DOWN"
            on:click={() => $actor.configureInitiative()}
        />
    {/if}
</li>

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .initiative-roll-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
        color: #7e7960;
        font-size: var(--a5e-text-size-xl);
        width: 2.5rem;
        height: 2.5rem;
        margin: auto;
        cursor: pointer;

        transition: var(--a5e-transition-standard);

        &:hover {
            transform: scale(1.2);
            color: #555;
        }

        &--ctrl:hover {
            color: #ffb63b;
        }

        &--shift:hover {
            color: #488f9a;
        }
    }

    .initiative-label {
        padding-bottom: 0.125rem;
        font-family: var(--a5e-font-serif);
        font-size: var(--a5e-text-size-sm);
        font-weight: bold;
        text-align: center;
    }
</style>
