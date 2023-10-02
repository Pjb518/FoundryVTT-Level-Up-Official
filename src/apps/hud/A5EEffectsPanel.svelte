<script>
    import { onDestroy } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import A5EEffectsPanelEffect from "./A5EEffectsPanelEffect.svelte";

    // Gets the maximum amount of icons that will fit given the user font size and the default
    // icon size.
    function getMaxEffectIconsPerColumn() {
        const fontSize = parseFloat(
            document.getElementsByTagName("html").style?.fontSize ?? 16
        );

        const { clientHeight } = document.documentElement;
        const availableHeight = clientHeight - 5 - 8 * fontSize;

        return (availableHeight - 2.5 * fontSize) / (3.25 * fontSize);
    }

    // Get current controlled token
    function getReactiveActor() {
        actor?.destroy();
        if (!token) return null;
        return new TJSDocument(token?.actor ?? game.user?.character ?? null);
    }

    let token = canvas.tokens.controlled.at(0)?.document ?? null;
    const maxIconsPerColumn = getMaxEffectIconsPerColumn();

    const controlledHook = Hooks.on("controlToken", () => {
        token = canvas.tokens.controlled.at(0)?.document ?? null;
    });

    // Destroy Hooks on unmount
    onDestroy(() => {
        Hooks.off("controlToken", controlledHook);
    });

    $: actor = getReactiveActor(token);

    // Get Panel Data
    $: effects = [
        ...($actor?.temporaryEffects || []),
        ...(token?.effects || []),
    ].sort((a, b) => a.name.localeCompare(b.name));
</script>

{#if token && $actor && effects.length}
    <article id="a5e-effects-panel" class="a5e-effects-panel">
        <ul class="a5e-effect-list">
            {#each effects as { icon, name }}
                <A5EEffectsPanelEffect
                    {icon}
                    {name}
                    --icon-size={effects.length > maxIconsPerColumn
                        ? "2rem"
                        : "2.5rem"}
                />
            {/each}
        </ul>
    </article>
{/if}

<style lang="scss">
    .a5e-effects-panel {
        position: absolute;
        top: 4rem;
        left: -0.5rem;
        width: fit-content;
        pointer-events: initial;
        transform: translateX(-100%);
    }

    .a5e-effect-list {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        gap: 0.75rem;
        max-height: calc(100vh - 4rem - 5px);
        margin: 0;
        padding: 0;
        list-style: none;
        direction: rtl;
    }
</style>
