<script>
    import { onDestroy } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import { gameSettings } from "../../settings/SettingsStore";

    import A5EEffectsPanelEffect from "./A5EEffectsPanelEffect.svelte";

    function removeEffect(id) {
        const effect = $actor.effects.get(id);
        const statuses = effect.statuses;

        if (statuses.size === 1) {
            if (
                subConditions[statuses.first()]?.some((c) =>
                    activeConditions.includes(c)
                )
            )
                return;
            const id = statuses.first();
            const src = effect.icon;
            return token?.object?._removeStatusEffect({ id, src });
        }

        effect.delete();
    }

    function increaseCounter(id) {
        const effect = $actor.effects.get(id);
        const statuses = effect.statuses;

        if (
            statuses.size === 1 &&
            ["fatigue", "strife"].includes(statuses.first())
        ) {
            const id = statuses.first();
            const src = effect.icon;
            return token?.object?._addStatusEffect({ id, src });
        }
    }

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

    function convertRemToPixels(rem) {
        return (
            rem *
            parseFloat(getComputedStyle(document.documentElement).fontSize)
        );
    }

    function getIconSize(size) {
        if (size === "small") return ["2rem", "2rem"];
        if (size === "medium") return ["2rem", "2.5rem"];
        if (size === "large") return ["2.5rem", "3rem"];
    }

    // Get panel settings
    let panelOffset = gameSettings.getStore("effectsPanelOffset");
    $: panelTop = convertRemToPixels(4) + ($panelOffset.top ?? 0);
    $: panelLeft = convertRemToPixels(-0.5) - ($panelOffset.right ?? 0);
    $: panelBottom = convertRemToPixels(4) + 5 + ($panelOffset.bottom ?? 0);

    let panelIconSize = gameSettings.getStore("effectsPanelIconSize");
    $: iconSize = getIconSize($panelIconSize);

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

    let activeConditions = token?.object?._getActiveConditions() ?? [];
    const subConditions = CONFIG.statusEffects.reduce((acc, c) => {
        if (!c?.statuses?.length) return acc;

        c.statuses.forEach((s) => {
            acc[s] ??= [];
            acc[s].push(c.id);
        });
        return acc;
    }, {});

    // Get Panel Data
    $: effects = [
        ...($actor?.temporaryEffects || []),
        ...(token?.effects || []),
    ]
        .filter((e) => !e.statuses.first()?.startsWith("generic"))
        .sort((a, b) => a.name.localeCompare(b.name));
</script>

{#if token && $actor && effects.length}
    <article
        id="a5e-effects-panel"
        class="a5e-effects-panel"
        style="--top: {panelTop}px; --left: {panelLeft}px; --bottom: {panelBottom}px;"
    >
        <ul class="a5e-effect-list">
            {#each effects as { description, flags, icon, _id, name, statuses } (_id)}
                <A5EEffectsPanelEffect
                    actor={$actor}
                    {description}
                    {icon}
                    {_id}
                    {name}
                    conditionId={statuses.first()}
                    linked={flags?.a5e?.source ?? null}
                    --icon-size={effects.length > maxIconsPerColumn
                        ? iconSize[0]
                        : iconSize[1]}
                    on:deleteEffect={() => removeEffect(_id)}
                    on:increaseCounter={() => increaseCounter(_id)}
                />
            {/each}
        </ul>
    </article>
{/if}

<style lang="scss">
    .a5e-effects-panel {
        position: absolute;
        top: var(--top);
        left: var(--left);
        width: fit-content;
        pointer-events: initial;
        transform: translateX(-100%);
    }

    .a5e-effect-list {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        gap: 0.75rem;
        max-height: calc(100vh - var(--bottom));
        margin: 0;
        padding: 0;
        list-style: none;
        direction: rtl;
    }
</style>
