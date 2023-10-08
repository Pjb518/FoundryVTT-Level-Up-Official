<script>
    import { getContext, onDestroy } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import EffectCategory from "../EffectCategory.svelte";
    import Search from "../actorUtilityBar/Search.svelte";
    import Sort from "../actorUtilityBar/Sort.svelte";
    import UtilityBar from "../actorUtilityBar/UtilityBar.svelte";

    function getConditionTooltip(id, label) {
        if (id?.startsWith("generic")) {
            return localize("A5E.ToggleGenericStatusCondition");
        }

        if (id === "concentration") {
            return localize("A5E.ToggleConcentrationStatusCondition");
        }

        if (id === "fatigue" || id === "strife") {
            return localize("A5E.ToggleTrackStatusCondition", {
                condition: localize(label),
            });
        }

        return localize("A5E.ToggleStatusCondition", {
            condition: localize(label),
        });
    }

    const tokenCreateHook = Hooks.on(
        "createToken",
        () => (token = $actor.getActiveTokens()?.[0])
    );

    const tokenDeleteHook = Hooks.on(
        "deleteToken",
        () => (token = $actor.getActiveTokens()?.[0])
    );

    onDestroy(() => {
        Hooks.off("createToken", tokenCreateHook);
        Hooks.off("deleteToken", tokenDeleteHook);
    });

    const actor = getContext("actor");
    const { activeEffects } = actor;
    const { A5E, statusEffects } = CONFIG;
    const subTypes = A5E.activeEffectTypes;
    const reducerType = "activeEffects";

    const subConditions = CONFIG.A5E.linkedStatusEffects;
    let token = $actor.getActiveTokens()?.[0];
    let linkedActor = $actor.prototypeToken.actorLink;

    console.log(token);
    $: activeConditions = token?._getActiveConditions($actor) ?? [];
    let fatigue = $actor.system.attributes.fatigue ?? 0;
    let strife = $actor.system.attributes.strife ?? 0;
</script>

<div class="effects-page">
    {#if $actor.isOwner}
        <UtilityBar>
            <Search {reducerType} />
            <Sort {reducerType} documentName="ActiveEffect" />
            <CreateMenu {reducerType} documentName="ActiveEffect" />
        </UtilityBar>
    {/if}

    <section class="effects-main-container">
        {#each Object.entries($activeEffects._types) as [label, effects]}
            {#if effects.length}
                <EffectCategory label={subTypes[label]} {effects} />
            {/if}
        {/each}
    </section>

    <!-- TODO: Adds strife and fatigue counter and colours -->
    {#if linkedActor || $actor.token}
        <section>
            <ul class="conditions-list">
                <!-- {console.log(tokens)} -->
                {#each Object.values(statusEffects) as { icon, id, label } (id)}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <li
                        class="conditions-list__item"
                        class:conditions-list__item--active={activeConditions.includes(
                            id
                        )}
                        class:conditions-list__item--linked={subConditions[
                            id
                        ]?.some((c) => activeConditions.includes(c))}
                        class:conditions-list__item--fatigue={id === "fatigue"}
                        class:conditions-list__item--strife={id === "strife"}
                        class:conditions-list__item--locked={$actor.system?.traits?.conditionImmunities?.includes(
                            id
                        )}
                        data-tooltip={getConditionTooltip(id, label)}
                        data-tooltip-direction="UP"
                        style="--fatigue: '{fatigue}''; --strife: '{strife}';"
                        on:click={() =>
                            subConditions[id]?.some((c) =>
                                activeConditions.includes(c)
                            )
                                ? null
                                : token._addStatusEffect({ id, src: icon })}
                        on:auxclick={() =>
                            subConditions[id]?.some((c) =>
                                activeConditions.includes(c)
                            )
                                ? null
                                : token._removeStatusEffect({ id, src: icon })}
                    >
                        <img class="condition-icon" src={icon} alt="label" />
                    </li>
                {/each}
            </ul>
        </section>
    {/if}
</div>

<style lang="scss">
    .conditions-list {
        display: grid;
        grid-template-columns: repeat(17, 1fr);
        gap: 0.375rem;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0.75rem 0.25rem 0.25rem 0.25rem;
        border-top: 1px solid #ccc;
        list-style: none;

        &__item {
            display: flex;
            position: relative;
            height: 1.5rem;
            width: 1.5rem;
            border-radius: 50%;
            cursor: pointer;

            &--active {
                box-shadow: 0 0 5px var(--color-shadow-primary);
            }

            &::after {
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: -0.375rem;
                right: -0.375rem;
                width: 0.75rem;
                height: 0.75rem;
                padding: 1px;
                font-family: $font-secondary;
                font-size: $font-size-xxs;
                font-weight: 400;
                color: white;
                background-color: rgba(0 0 0 / 0.45);
                border-radius: 50%;
            }

            &--locked {
                cursor: not-allowed;

                &::after {
                    content: "\f023";
                    font: var(--fa-font-solid);
                    font-size: $font-size-xxs;
                }
            }

            &--linked {
                cursor: not-allowed;

                & ::after {
                    content: "\f0c1";
                    font: var(--fa-font-solid);
                    font-size: $font-size-xxs;
                }
            }

            &--fatigue::after {
                content: var(--fatigue);
                background-color: var(--fatigue-col);
                font-size: $font-size-xxs;
            }

            &--strife::after {
                content: var(--strife);
                background-color: var(--strife-col);
                font-size: $font-size-xxs;
            }
        }
    }

    .condition-icon {
        height: 100%;
        width: 100%;
        object-fit: cover;
        object-position: top;
        border: 1px solid black;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.6);
    }

    .effects-page {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.5rem;
        overflow: hidden;
    }

    .effects-main-container {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        gap: 0.75rem;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
