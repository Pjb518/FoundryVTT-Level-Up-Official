<script>
    import { getContext, onDestroy } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    // Get current controlled token
    function getReactiveActor() {
        actor?.destroy();
        if (!token) return null;
        return new TJSDocument(token?.actor ?? game.user?.character ?? null);
    }

    let token = canvas.tokens.controlled.at(0)?.document ?? null;
    $: actor = getReactiveActor(token);

    const controlledHook = Hooks.on("controlToken", () => {
        token = canvas.tokens.controlled.at(0)?.document ?? null;
    });

    // Destroy Hooks on unmount
    onDestroy(() => {
        Hooks.off("controlToken", controlledHook);
    });

    // Get Panel Data
    $: effects = [
        ...($actor?.temporaryEffects || []),
        ...(token?.effects || []),
    ].sort((a, b) => a.name.localeCompare(b.name));

    console.log($actor?.temporaryEffects);
</script>

{#if token && $actor && effects.length}
    <article id="a5e-effects-panel" class="a5e-effects-panel">
        <ul class="a5e-effect-list">
            {#each effects as { name, icon }}
                <li class="a5e-effect-item">
                    <img class="a5e-effect-item__icon" src={icon} alt={name} />
                    <!-- {name} -->
                </li>
            {/each}
        </ul>
    </article>
{/if}

<style lang="scss">
    .a5e-effects-panel {
        position: absolute;
        top: 4rem;
        left: -0.5rem;
        pointer-events: initial;
        transform: translateX(-100%);
    }

    .a5e-effect-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .a5e-effect-item {
        display: flex;
        position: relative;
        border: 1px solid #e9d7a1;
        border-radius: 50%;
        cursor: pointer;

        &__icon {
            height: 2.5rem;
            width: 2.5rem;
            border: 1px solid black;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.6);
        }
    }
</style>
