<script>
    import A5EEffectsPanelEffect from "./A5EEffectsPanelEffect.svelte";

    function removeEffect(id) {
        const effect = actor?.effects.get(id);
        const statuses = effect?.statuses;

        if (statuses?.size === 1) {
            if (
                subConditions[statuses.first()]?.some((c) => activeConditions.includes(c))
            )
                return;
            const id = statuses.first();
            const src = effect.img;
            return token?.object?._removeStatusEffect({ id, src });
        }

        effect?.delete();
    }

    function increaseCounter(id) {
        const effect = actor?.effects.get(id);
        const statuses = effect?.statuses;

        if (
            statuses?.size === 1 &&
            ["corruption", "fatigue", "inebriated", "strife"].includes(statuses.first())
        ) {
            const id = statuses.first();
            const src = effect.img;
            return token?.object?._addStatusEffect({ id, src });
        }
    }

    // Gets the maximum amount of icons that will fit given the user font size and the default
    // icon size.
    function getMaxEffectIconsPerColumn() {
        const fontSize = parseFloat(
            document.getElementsByTagName("html").style?.fontSize ?? 16,
        );

        const { clientHeight } = document.documentElement;
        const availableHeight = clientHeight - 5 - 8 * fontSize;

        return (availableHeight - 2.5 * fontSize) / (3.25 * fontSize);
    }

    function convertRemToPixels(rem) {
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    function getIconSize(size) {
        if (size === "small") return ["2rem", "2rem"];
        if (size === "medium") return ["2rem", "2.5rem"];
        if (size === "large") return ["2.5rem", "3rem"];
    }

    // Get panel settings
    let panelOffset = $derived(game.settings.get("a5e", "effectsPanelOffset"));
    let panelTop = $derived(convertRemToPixels(4) + (panelOffset.top ?? 0));
    let panelLeft = $derived(convertRemToPixels(18.75) - (panelOffset.right ?? 0));
    let panelBottom = $derived(convertRemToPixels(4) + 5 + (panelOffset.bottom ?? 0));

    let panelIconSize = $derived(game.settings.get("a5e", "effectsPanelIconSize"));
    let iconSize = $derived(getIconSize(panelIconSize));

    let token = $state(canvas.tokens.controlled.at(0)?.document ?? null);
    let actor = $derived(token?.actor ?? game.user?.character ?? null);

    // Track version to force reactivity when effects change
    let actorVersion = $state(0);

    const maxIconsPerColumn = getMaxEffectIconsPerColumn();

    // Update token when control changes
    $effect(() => {
        const controlledHook = Hooks.on("controlToken", () => {
            token = canvas.tokens.controlled.at(0)?.document ?? null;
            actorVersion++;
        });

        return () => {
            Hooks.off("controlToken", controlledHook);
        };
    });

    // Track actor updates to trigger reactivity
    $effect(() => {
        if (!actor) return;

        const updateHook = Hooks.on("updateActor", (updatedActor) => {
            if (updatedActor.id === actor.id) {
                actorVersion++;
            }
        });

        const createEffectHook = Hooks.on("createActiveEffect", (effect) => {
            if (effect.parent?.id === actor.id) {
                actorVersion++;
            }
        });

        const updateEffectHook = Hooks.on("updateActiveEffect", (effect) => {
            if (effect.parent?.id === actor.id) {
                actorVersion++;
            }
        });

        const deleteEffectHook = Hooks.on("deleteActiveEffect", (effect) => {
            if (effect.parent?.id === actor.id) {
                actorVersion++;
            }
        });

        return () => {
            Hooks.off("updateActor", updateHook);
            Hooks.off("createActiveEffect", createEffectHook);
            Hooks.off("updateActiveEffect", updateEffectHook);
            Hooks.off("deleteActiveEffect", deleteEffectHook);
        };
    });

    let activeConditions = $derived(token?.object?._getActiveConditions() ?? []);

    const subConditions = CONFIG.statusEffects.reduce((acc, c) => {
        if (!c?.statuses?.length) return acc;

        c.statuses.forEach((s) => {
            acc[s] ??= [];
            acc[s].push(c.id);
        });
        return acc;
    }, {});

    // Get Panel Data - using actorVersion to force re-evaluation
    let effects = $derived.by(() => {
        // Access actorVersion to create dependency
        actorVersion;

        if (!actor?.temporaryEffects) return [];

        return [...actor.temporaryEffects]
            .filter((e) => !e.statuses.first()?.startsWith("generic"))
            .sort((a, b) => a.name.localeCompare(b.name));
    });
</script>

{#if token && actor && effects.length}
    <article
        id="a5e-effects-panel"
        class="a5e-effects-panel"
        style="--top: {panelTop}px; --left: {panelLeft}px; --bottom: {panelBottom}px;"
    >
        <ul class="a5e-effect-list">
            {#each effects as { description, flags, img, _id, name, statuses } (_id)}
                <A5EEffectsPanelEffect
                    {actor}
                    {description}
                    {img}
                    {_id}
                    {name}
                    conditionId={statuses.first()}
                    linked={flags?.a5e?.source ?? null}
                    --icon-size={effects.length > maxIconsPerColumn
                        ? iconSize[0]
                        : iconSize[1]}
                    onDeleteEffect={() => removeEffect(_id)}
                    onIncreaseCounter={() => increaseCounter(_id)}
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
