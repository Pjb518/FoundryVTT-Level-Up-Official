<script>
    import { getContext } from "svelte";

    const actor = getContext("actor");

    $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<li>
    <h4 class="initiative-label">Initiative</h4>

    {#if sheetIsLocked}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <i
            class="initiative-roll-button fas fa-dice-d20"
            data-tooltip="A5E.RollInitiative"
            data-tooltip-direction="DOWN"
            on:click={(event) =>
                $actor.rollInitiative({
                    createCombatants: true,
                    initiativeOptions: {
                        rollOptions: {
                            skipRollDialog: event.altKey,
                        },
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
            color: inherit;
        }
    }

    .initiative-label {
        font-size: 1rem;
        text-align: center;
        padding-bottom: 0.125rem;
    }
</style>
