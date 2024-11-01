<script>
    import { getContext } from "svelte";

    const actor = getContext("actor");

    let replaceFatigueAndStrife = game.settings.get("a5e", "replaceFatigueAndStrife");
</script>

<div
    class="rest"
    class:rest--5e={replaceFatigueAndStrife}
    class:disable-pointer-events={!$actor.isOwner}
    data-tooltip="A5E.Rest"
    data-tooltip-direction="DOWN"
>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <i
        class="rest__icon fas fa-campfire"
        class:disable-pointer-events={!$actor.isOwner}
        on:click={() => $actor.triggerRest()}
    />
</div>

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .rest {
        position: absolute;
        z-index: 4;
        display: flex;
        overflow: hidden;
        width: 2rem;
        height: 2rem;
        align-items: center;
        border-radius: 50%;

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
            border: 1px solid #ccc;
            background-color: --a5e-color-background-light;
            border-radius: 50%;
            box-shadow: 0 0 10px #ccc inset;
            color: rgba(0 0 0 / 0.2);
            cursor: pointer;
            font-size: var(--a5e-text-size-lg);
            transform: translateX(-1px);

            transition: var(--a5e-transition-standard);
        }

        &:hover {
            background-color: darken(#dddace, 2.5%);

            .rest__icon {
                color: lighten-color(var(--a5e-color-text-dark), 35);
            }
        }
    }
</style>
