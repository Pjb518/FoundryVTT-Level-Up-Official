<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import Effect from "../Effect.svelte";
    import EffectCategory from "../EffectCategory.svelte";
    import SortFilter from "../SortFilter.svelte";

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

    const subTypes = {
        temporary: "A5E.effects.type.temporary",
        passive: "A5E.effects.type.passive",
        inactive: "A5E.effects.type.inactive",
    };
    console.log($activeEffects._types);
</script>

<div class="effects-page">
    {#if $actor.isOwner}
        <SortFilter itemType="activeEffects" hideFilter={true} {subTypes} />
    {/if}

    <section class="effects__main-container">
        {#each Object.entries($activeEffects._types) as [label, effects]}
            {#if effects.length}
                <EffectCategory label={subTypes[label]} {effects} />
            {/if}
        {/each}
    </section>
</div>

<style lang="scss">
    .effects-page {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.5rem;
        overflow: hidden;
    }

    .effects__main-container {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        gap: 0.75rem;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
