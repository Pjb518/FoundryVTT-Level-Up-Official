<script lang="ts">
    import { getContext } from "svelte";

    let actor: Actor = getContext("actor");

    let replaceFatigueAndStrife = game.settings.get(
        "a5e",
        "replaceFatigueAndStrife",
    ) as boolean;
</script>

<div
    class="a5e-actor-rest-button"
    class:a5e-actor-rest-button--5e={replaceFatigueAndStrife}
    class:disable-pointer-events={!actor.isOwner}
    data-tooltip="A5E.rest.title"
    data-tooltip-direction="DOWN"
>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <i
        class="a5e-actor-rest-button__icon fa-solid fa-campfire"
        class:disable-pointer-events={!actor.isOwner}
        onclick={() => actor.triggerRest()}
    ></i>
</div>

<style lang="scss">
    @use "sass:color";

    .disable-pointer-events {
        pointer-events: none;
    }

    .a5e-actor-rest-button {
        position: absolute;
        z-index: 2;
        display: flex;
        overflow: hidden;
        width: 2rem;
        height: 2rem;
        align-items: center;
        border-radius: 50%;
        cursor: pointer;

        bottom: 1rem;
        right: 0.625rem;

        &--5e {
            bottom: 2rem;
        }

        &__icon {
            z-index: 1;
            display: flex;
            width: 2rem;
            height: 2rem;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--a5e-border-color);
            background: var(--a5e-status-track-icon-background);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--a5e-status-track-icon-shadow) inset;
            color: var(--a5e-status-track-icon-color);
            cursor: pointer;
            font-size: var(--a5e-lg-text);
            transform: translateX(-1px);

            transition: var(--a5e-transition-standard);
        }

        &:hover {
            background: var(--a5e-status-track-item-background-hover);

            .a5e-actor-rest-button__icon {
                color: var(--a5e-status-track-item-color-hover);
            }
        }
    }
</style>
