<svelte:options accessors={true} />

<script>
    import { setContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    export let HUD;

    function handleStatusEffectClick({ id, src }, { overlay = false } = {}) {
        const effect =
            id && HUD?.object?.actor
                ? CONFIG.statusEffects.find((e) => e.id === id)
                : src;

        if (typeof effect === "object" && effect?.statuses?.length) {
            const existing = HUD.object.actor.effects.reduce((arr, e) => {
                if (e.statuses.size === 1 && e.statuses.has(id)) arr.push(e.id);

                effect?.statuses?.forEach((s) => {
                    if (e.statuses.size === 1 && e.statuses.has(s))
                        arr.push(e.id);
                });

                return arr;
            }, []);

            if (existing.length) {
                return HUD.object.actor.deleteEmbeddedDocuments(
                    "ActiveEffect",
                    existing
                );
            }
        }

        return HUD?.object?.toggleEffect(effect, { overlay });
    }

    const data = HUD.getData();
    const statusEffects = Object.values(data.statusEffects);
    const genericEffects = Object.values(data.genericConditions);

    const activeConditions = Object.values(data.statusEffects).reduce(
        (acc, e) => {
            if (!e.isActive) return acc;
            acc.push(e.id);
            return acc;
        },
        []
    );

    const subConditions = CONFIG.statusEffects.reduce((acc, c) => {
        if (!c?.statuses?.length) return acc;

        c.statuses.forEach((s) => {
            acc[s] ??= [];
            acc[s].push(c.id);
        });
        return acc;
    }, {});

    $: conditionImmunities =
        HUD?.object?.actor?.system?.traits?.conditionImmunities ?? [];
</script>

<div class="status-effects-container">
    {#each statusEffects as effect}
        <button
            class="condition-container {effect.cssClass}"
            class:linked={subConditions[effect.id]?.some((c) =>
                activeConditions.includes(c)
            )}
            class:locked={conditionImmunities.includes(effect.id)}
            title={effect.title ?? ""}
            data-status-id={effect.id}
            disabled={conditionImmunities.includes(effect.id) ||
                subConditions[effect.id]?.some((c) =>
                    activeConditions.includes(c)
                )}
            on:click|preventDefault|stopPropagation={() =>
                handleStatusEffectClick(effect)}
            on:auxclick|preventDefault|stopPropagation={() =>
                handleStatusEffectClick(effect, { overlay: true })}
        >
            <img
                class={effect.cssClass}
                src={effect.src}
                alt={effect.title ?? ""}
                title={effect.title ?? ""}
                data-status-id={effect.id}
            />
            <h3 class="condition-title">
                {effect.title}
            </h3>
        </button>
    {/each}
</div>

<hr class="a5e-rule" />

<div class="generic-effects-container">
    {#each genericEffects as effect}
        <button
            class="condition-container {effect.cssClass}"
            title={effect.title ?? ""}
            data-status-id={effect.id}
            on:click|preventDefault|stopPropagation={() =>
                handleStatusEffectClick(effect)}
            on:auxclick|preventDefault|stopPropagation={() =>
                handleStatusEffectClick(effect, { overlay: true })}
        >
            <img
                class={effect.cssClass}
                src={effect.src}
                alt={effect.title ?? ""}
                title={effect.title ?? ""}
                data-status-id={effect.id}
            />
        </button>
    {/each}
</div>

<button
    class="clear-all-conditions"
    on:click={HUD?._clearAllConditions.bind(HUD)}
>
    <i class="fa-solid fa-octagon-xmark" />
    {localize("A5E.UIClearAll")}
</button>

<style lang="scss">
    .status-effects-container {
        display: grid;
        grid-template-columns: repeat(3, minmax(8em, 1fr));
        gap: 0.75rem;
        padding: 0.75rem;
        padding-bottom: 0.5rem;
        font-size: 1.2rem;
        line-height: 1.2rem;
        text-align: left;
        width: max-content;

        .active {
            img,
            h3 {
                font-weight: bold;
                color: $color-primary-light;
                // filter: invert(62%) sepia(32%) saturate(6599%)
                //     hue-rotate(110deg) brightness(96%) contrast(83%);
            }
        }
    }

    .condition-container {
        display: flex;
        position: relative;
        background-color: transparent;
        gap: 0.5rem;
        font-size: 1rem;
        align-items: center;
        margin-block: 0.125rem;
        border: none;
        color: rgb(204 204 204);
        cursor: pointer;
        transition: $standard-transition;

        &:hover,
        &:focus {
            outline: none;
            box-shadow: none;
            color: $color-primary-light;
        }

        &:disabled {
            img,
            h3 {
                cursor: not-allowed;
                font-weight: bold;
                color: lighten($color: $color-warning, $amount: 15);
                // filter: invert(11%) sepia(42%) saturate(7092%)
                //     hue-rotate(352deg) brightness(94%) contrast(81%);
            }

            &:hover {
                color: rgb(204 204 204);
            }
        }

        &.linked,
        &.locked {
            h3::before {
                content: "\f0c1";
                font: var(--fa-font-solid);

                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1px;

                background-color: rgba(0 0 0 / 0.45);
                border-radius: 50%;
                width: 1.25rem;
                aspect-ratio: 1/1;
                color: white;
                font-size: 0.833rem;

                position: absolute;
                top: -0.75rem;
                left: 1.65rem;
            }
        }

        &.locked {
            h3::before {
                content: "\f023";
            }
        }

        h3 {
            height: 1rem;
            border: none;
        }

        img {
            width: 2rem;
            height: 2rem;
            margin: 0;
            padding: 0;
            border: none;
            opacity: 1;
        }
    }

    .generic-effects-container {
        display: flex;
        justify-content: space-around;
        padding-block-start: 0.375rem;
        padding-block-end: 0.75rem;

        .condition-container {
            justify-content: center;

            img {
                width: 2rem;
                aspect-ratio: 1/1;
                border: 2px solid black;
                border-radius: 50%;

                &:hover {
                    outline: 3px solid #ccc;
                }
            }
        }

        .active {
            img {
                border-radius: 50%;
                outline: 4px solid #ccc;
            }
        }
    }

    .clear-all-conditions {
        position: absolute;
        bottom: 100%;
        right: -1px;
        padding: 0.25em;
        color: rgb(204 204 204);
        border: none;
        border-radius: 4px 4px 0 0;
        background-color: black;
        font-size: 1.25rem;
        cursor: pointer;

        &:hover {
            color: $color-secondary;
            font-weight: bold;
        }
    }
    // Generate filter
    // https://isotropic.co/tool/hex-color-to-css-filter/
</style>
