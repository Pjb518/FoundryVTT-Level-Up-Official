<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import prepareSelectedTokenActors from "../../../dataPreparationHelpers/prepareSelectedTokenActors";

    export let prompt;

    const message = getContext("message");

    function applyEffect() {
        const tokenActors = prepareSelectedTokenActors();

        if (!tokenActors.length) {
            ui.notifications.warn("No tokens selected");
            return;
        }

        tokenActors.forEach((token) => {
            token.createEmbeddedDocuments("ActiveEffect", [effect]);
        });
    }

    let effect = fromUuidSync(prompt.effectUuid);
</script>

{#if effect}
    <button on:click={() => applyEffect()}>
        <span>
            <img class="effect-icon" src={effect.icon} alt="Icon Effect" />
            {effect.name}
        </span>
    </button>
{/if}

<style lang="scss">
    button {
        background-color: #425f65;
        color: #f6f2eb;
        border-radius: 4px;

        span {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.25rem;
            padding-block: 0.15rem;
        }
    }

    .effect-icon {
        width: 1rem;
        border: none;
        aspect-ratio: 1;
    }
</style>
