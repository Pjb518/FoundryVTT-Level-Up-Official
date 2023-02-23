<script>
    import { getContext } from "svelte";

    // TODO: Fix this
    import rollInitiative from "../../handlers/rollInitiative";

    const actor = getContext("actor");

    $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<li>
    <h4 class="initiative-label">Initiative</h4>

    {#if sheetIsLocked}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <i
            class="initiative-roll-button fas fa-dice-d20"
            on:click={() => $actor.rollInitiative({ createCombatants: true })}
        />
    {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <i
            class="initiative-roll-button fas fa-cog"
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
