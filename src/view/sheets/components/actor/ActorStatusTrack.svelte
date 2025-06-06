<script lang="ts">
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    type Props = {
        icon: string;
        tooltipText: string;
        trackProperty: string;
        options: { value: number; hint?: string }[];
        selectedOption: number;
    };

    function handleStatusEffectChange(value: string | number) {
        updateDocumentDataFromField(
            actor,
            `system.attributes.${trackProperty}`,
            value,
        );
    }

    let { icon, tooltipText, trackProperty, options, selectedOption }: Props =
        $props();

    let actor: Actor = getContext("actor");
    let actorStore = $derived(actor.reactive.system);

    let replaceFatigueAndStrife = game.settings.get(
        "a5e",
        "replaceFatigueAndStrife",
    ) as boolean;
</script>

<div
    class="a5e-actor-track a5e-actor-track--{trackProperty}"
    class:a5e-actor-track--5e={replaceFatigueAndStrife}
    data-tooltip={tooltipText}
    data-tooltip-direction="DOWN"
>
    <i
        class="a5e-actor-track__icon fa-solid {icon} a5e-actor-track__icon-level-{selectedOption}"
    ></i>

    <ul class="a5e-actor-track__items">
        {#each options as { value, hint }}
            <li data-tooltip={hint || null} data-tooltip-direction="DOWN">
                <button
                    class="a5e-button a5e-actor-track__item"
                    class:a5e-actor-track__item-selected={value ===
                        selectedOption}
                    class:disable-pointer-events={!actor.isOwner}
                    data-degree={value}
                    onclick={() => handleStatusEffectChange(value)}
                >
                    {value}
                </button>
            </li>
        {/each}
    </ul>
</div>

<style lang="scss">
    @use "sass:color";

    :global(.tooltip-list) {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: var(--a5e-sm-text);
        text-align: left;
    }

    $colors: (
        "1": #919f00,
        "2": #a09200,
        "3": #af8300,
        "4": #bd7100,
        "5": #cb5c00,
        "6": #d63f00,
        "7": #e00006,
    );

    .disable-pointer-events {
        pointer-events: none;
    }

    .a5e-actor-track {
        position: absolute;
        z-index: 3;
        display: flex;
        overflow: hidden;
        width: 2rem;
        height: 2rem;
        align-items: center;
        border-radius: 50%;

        transition: width 0.3s ease;

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

            @each $level, $color in $colors {
                &-level-#{$level} {
                    border-color: $color;
                    box-shadow: 0 0 10px $color inset;
                    color: $color;
                }
            }
        }

        &__item {
            display: flex;
            align-items: center;
            height: 100%;
            padding: 0 0.5rem;
            background: transparent;
            border-radius: 0;
            color: var(--a5e-status-track-item-color);
            border: none;

            transition: var(--a5e-transition-standard);

            &:focus,
            &:hover {
                background: var(--a5e-status-track-item-background-hover);
                color: var(--a5e-status-track-item-color-hover);
                box-shadow: none;
            }

            &-selected {
                background: var(--a5e-status-track-item-background-selected);
                color: var(--a5e-status-track-item-color-selected);
            }
        }

        &__items {
            z-index: 0;
            display: flex;
            height: 2rem;
            padding: 0 0.75rem 0 1.5rem;
            border: 1px solid var(--a5e-status-track-items-border);
            border-left: 0;
            margin: 0;
            background: var(--a5e-status-track-items-background);
            border-radius: 0 1rem 1rem 0;
            list-style: none;
            opacity: 0;
            transform: translateX(-1rem);

            transition: var(--a5e-transition-standard);
        }

        &--fatigue {
            z-index: 3;
            top: 1rem;
            right: 0.625rem;
        }

        &--strife {
            top: 39%;
            right: -0.175rem;
        }

        &--5e {
            top: 2rem;
        }

        &:hover {
            overflow: initial;

            .a5e-actor-track__items {
                opacity: 1;
            }

            .a5e-actor-track__icon {
                color: lighten-color(var(--a5e-text-color-dark), 35);

                @each $level, $color in $colors {
                    &-level-#{$level} {
                        border-color: $color;
                        box-shadow: 0 0 10px $color inset;
                        color: $color;
                    }
                }
            }
        }
    }
</style>
