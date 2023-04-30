<script>
    import { getContext } from "svelte";

    import pressedKeysStore from "../../../stores/pressedKeysStore";
    import getKeyPressAsOptions from "../../handlers/getKeyPressAsOptions";

    const actor = getContext("actor");
    const { settings } = game;

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<li>
    <h4 class="initiative-label">Initiative</h4>

    {#if sheetIsLocked}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
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
                        rollOptions: getKeyPressAsOptions($pressedKeysStore, {
                            reverseAlt: settings.get(
                                "a5e",
                                "reverseInitiativeAltBehavior"
                            ),
                        }),
                    },
                })}
        />
    {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
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
        font-size: 1.44rem;
        width: 2.5rem;
        height: 2.5rem;
        margin: auto;
        cursor: pointer;

        transition: all 0.15s ease-in-out;

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
        font-size: 1rem;
        text-align: center;
        padding-bottom: 0.125rem;
    }
</style>
