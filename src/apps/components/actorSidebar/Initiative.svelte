<script>
    import { getContext } from "svelte";

    import pressedKeysStore from "../../../stores/pressedKeysStore";
    import getKeyPressAsOptions from "../../handlers/getKeyPressAsOptions";

    const actor = getContext("actor");
    const { settings } = game;

    function getRollOptions() {
        const options = getKeyPressAsOptions($pressedKeysStore, {
            reverseAlt: settings.get("a5e", "reverseInitiativeAltBehavior"),
        });

        console.log(options);

        options.expertiseDie = $actor.RollOverrideManager.getExpertiseDice(
            "initiative",
            options.expertiseDie ?? 0,
            { ability: abilityKey },
        );

        options.rollMode = $actor.RollOverrideManager.getRollOverride(
            "initiative",
            options.rollMode,
            { ability: abilityKey },
        );

        return options;
    }

    let abilityKey = $actor.system.attributes.initiative.ability ?? "dex";

    $: sheetIsLocked = !$actor.isOwner ? true : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<li>
    <h4 class="initiative-label">Initiative</h4>

    {#if sheetIsLocked}
        <button
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
        <button
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
        height: 2.5rem;
        width: 2.5rem;
        margin: auto;
        font-size: var(--a5e-text-size-xl);
        color: var(--a5e-color-text-medium);
        background: transparent;
        border: 0;
        cursor: pointer;

        transition: var(--a5e-transition-standard);

        &:hover {
            transform: scale(1.2);
            color: #555;
            box-shadow: none;
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
        font-weight: 700;
        text-align: center;
    }
</style>
