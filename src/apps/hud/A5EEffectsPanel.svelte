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
</script>

{#if token && $actor && effects.length}
    <article id="a5e-effects-panel">
        <ul>
            {#each effects as { name }}
                <li>
                    {name}
                </li>
            {/each}
        </ul>
    </article>
{/if}

<style lang="scss">
    #a5e-effects-panel {
        background-color: aliceblue;
        pointer-events: initial;
        padding: 0.75rem;

        width: 8rem;
        position: absolute;
        left: 0;
        top: 4rem;
        transform: translateX(-100%);
    }
</style>
