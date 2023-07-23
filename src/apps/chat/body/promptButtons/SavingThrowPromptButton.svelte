<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import prepareSelectedTokenActors from "../../../dataPreparationHelpers/prepareSelectedTokenActors";
    import pressedKeysStore from "../../../../stores/pressedKeysStore";

    export let prompt;

    const { abilities } = CONFIG.A5E;
    const message = getContext("message");

    function getSavingThrowPrompt() {
        if (game.settings.get("a5e", "protectRolls") ?? false) {
            const actorId = $message?.flags?.a5e?.actorId;
            const actor = fromUuidSync(actorId);

            if (actor && actor.type !== "character" && actor.permission < 2) {
                return localize("A5E.RollPromptSavingThrow", {
                    ability: localize(abilities[prompt.ability]),
                });
            }
        }

        return localize("A5E.RollPromptSavingThrowWithDC", {
            ability: localize(abilities[prompt.ability]),
            dc: prompt.dc,
        });
    }

    function rollPrompt() {
        const tokenActors = prepareSelectedTokenActors();

        if (!tokenActors.length) {
            ui.notifications.warn("No tokens selected");
            return;
        }

        tokenActors.forEach((token) => {
            token.rollSavingThrow(prompt.ability);
        });
    }
</script>

<div class="save-prompt">
    <button
        class="roll-button"
        class:roll-button--shift={$pressedKeysStore.Shift}
        class:roll-button--ctrl={$pressedKeysStore.Control}
        on:click={() => rollPrompt()}
    >
        <i class="die fa-solid fa-dice-d20" />
    </button>

    <header class="title-wrapper">
        <span class="title">{getSavingThrowPrompt()}</span>
        <span class="subtitle">Lorem ipsum dolor sit, amet consectetur.</span>
    </header>
</div>

<style lang="scss">
    .die {
        display: block;
        font-size: 2rem;
        padding: 0;
        margin: 0;
        border: 0;
    }

    .roll-button {
        width: 2.5rem;
        height: 2.5rem;
        padding: 0;
        margin: 0;
        background: transparent;
        border: 0;
        color: #7e7960;
        grid-area: icon;
        transition: all 0.15s ease-in-out;
        box-shadow: none;

        transition: 0.15s all ease-in-out;

        &:hover {
            color: #555;
        }

        &--shift:hover {
            color: #2b6537;
        }

        &--ctrl:hover {
            color: #8b2525;
        }
    }

    .save-prompt {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .subtitle {
        width: 100%;
        font-size: 0.694rem;
        color: #7e7960;
    }

    .title {
        font-size: 0.833rem;
        font-weight: bold;
    }

    .title-wrapper {
        display: flex;
        flex-direction: column;
    }
</style>
