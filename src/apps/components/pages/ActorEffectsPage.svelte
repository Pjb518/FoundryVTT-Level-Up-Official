<script>
    import { getContext } from "svelte";
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

    const actor = getContext("actor");
    const { activeEffects } = actor;
    const { A5E, statusEffects } = CONFIG;
    const subTypes = A5E.activeEffectTypes;
    const reducerType = "activeEffects";
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

    <section>
        <ul class="conditions-list">
            {#each Object.values(statusEffects) as { icon, id, label } (id)}
                <!-- TODO: Adds a real condition for the active modifier class -->
                <!-- TODO: Adds a click handler to toggle conditions -->
                <!-- TODO: Adds strife and fatigue counter and colours -->
                <li
                    class="conditions-list__item"
                    class:conditions-list__item--active={false}
                    data-tooltip={getConditionTooltip(id, label)}
                    data-tooltip-direction="UP"
                >
                    <img class="condition-icon" src={icon} alt="label" />
                </li>
            {/each}
        </ul>
    </section>
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

            &--fatigue,
            &--strife {
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
                    font-size: $font-size-xs;
                    color: white;
                    border-radius: 50%;
                }
            }

            &--fatigue::after {
                content: var(--fatigue);
                background-color: var(--fatigue-col);
            }

            &--strife::after {
                content: var(--strife);
                background-color: var(--strife-col);
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
