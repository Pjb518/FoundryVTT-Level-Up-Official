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
        {effect.name}
    </button>
{/if}
