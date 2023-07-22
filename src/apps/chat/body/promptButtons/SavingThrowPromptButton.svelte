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
        <img class="die" src="/icons/svg/d20.svg" alt="Roll" />
    </button>

    <span class="title">
        {getSavingThrowPrompt()}
    </span>

    <span class="subtitle">Testing</span>
</div>

<style lang="scss">
    .die {
        display: block;
        height: 100%;
        width: auto;
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
        grid-area: icon;
        transition: all 0.15s ease-in-out;
        box-shadow: none;
        grid-area: die;

        filter: saturate(0%) brightness(78%) contrast(65%);

        :hover {
            filter: saturate(0%) brightness(60%) contrast(65%);
        }

        &--shift:hover {
            filter: brightness(0) saturate(100%) invert(58%) sepia(10%)
                saturate(2832%) hue-rotate(73deg) brightness(88%) contrast(76%);

            // filter: invert(34%) sepia(4%) saturate(4360%) hue-rotate(143deg)
            //     brightness(78%) contrast(65%);
        }

        &--ctrl:hover {
            filter: brightness(0) saturate(100%) invert(18%) sepia(80%)
                saturate(5142%) hue-rotate(348deg) brightness(74%) contrast(94%);
            // filter: invert(15%) sepia(27%) saturate(4731%) hue-rotate(338deg)
            //     brightness(101%) contrast(95%);
        }
    }

    .save-prompt {
        display: grid;
        grid-template-areas:
            "die title"
            "die subtitle";
        grid-template-columns: min-content 1fr;
        grid-template-rows: repeat(2, min-content);
        gap: 0rem 0.5rem;
        align-items: center;
    }

    .subtitle {
        grid-area: subtitle;
        width: 100%;
        font-size: 0.694rem;
        color: #7e7960;
    }

    .title {
        grid-area: title;
        font-size: 0.833rem;
        font-weight: bold;
    }
</style>
