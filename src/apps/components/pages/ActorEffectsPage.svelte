<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import Effect from "../Effect.svelte";

    const actor = getContext("actor");
    const { activeEffects } = actor;

    function addEffect() {
        $actor.createEmbeddedDocuments("ActiveEffect", [
            {
                label: game.i18n.localize("A5E.effects.new"),
                icon: "icons/svg/aura.svg",
                origin: $actor.uuid,
            },
        ]);
    }
</script>

<header class="section-header">
    <h3>
        {localize("A5E.TabEffects")}
    </h3>
</header>

<button on:click={addEffect}> + Add Effect </button>

<ul class="effects-container">
    {#each [...$activeEffects] as effect}
        <Effect {effect} />
    {/each}
</ul>

<style lang="scss">
    .effects-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0;
        padding-right: 0.375rem;
        margin: 0;
        margin-right: -0.375rem;
        list-style: none;
        overflow-y: auto;
    }

    .section-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.25rem;
        padding-top: 0;
        border-bottom: 1px solid #ccc;
        font-size: 1rem;
        font-family: "Modesto Condensed", serif;
    }
</style>
