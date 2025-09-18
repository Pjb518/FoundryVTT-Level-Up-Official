<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";

    type Props = {
        buttonLabel?: string;
        buttonIcon?: string;
        menuPosition?: { x: number; y: number };
        showMenu?: boolean;
        menuItems?: Array<{
            name: string;
            onClick: () => void;
            icon?: string;
            label?: string;
        }>;
        onclick?: () => void;
        children?: any;
    };

    function onActivate(
        event: MouseEvent & {
            currentTarget: EventTarget & HTMLButtonElement;
        },
    ) {
        showMenu = true;

        const buttonElem = button.getBoundingClientRect();

        const container = event.currentTarget
            ?.closest(".window-content")
            ?.getBoundingClientRect()!;

        pos = {
            x: buttonElem.left - container.left + menuPositionProp.x,
            y: buttonElem.top - container.top + menuPositionProp.y,
        };
    }

    function onBlur(e) {
        showMenu = false;
    }

    let {
        menuPosition: menuPositionProp = { x: 0, y: 0 },
        showMenu: showMenuProp = false,
        menuItems = [],
        buttonLabel = "",
        buttonIcon = "fa-solid fa-plus",
        onclick = () => {},
        children = undefined,
    }: Props = $props();

    let pos = $state({ x: 0, y: 0 });
    let showMenu = $state(showMenuProp);
    let button: HTMLButtonElement;
</script>

<button
    bind:this={button}
    class="a5e-button a5e-button--transparent a5e-context-menu__button"
    onclick={onActivate}
    onauxclick={onActivate}
    onblur={onBlur}
    aria-label="Open Context Menu"
>
    <i class="fa-solid {buttonIcon}"></i>
    {localize(buttonLabel)}
</button>

{#if showMenu}
    <div class="a5e-context-menu" style="top: {pos.y}px; left: {pos.x}px;">
        {#if children}
            {@render children?.()}
        {:else}
            <ul class="a5e-context-menu__list">
                {#each menuItems as item}
                    {#if item.name === "hr"}
                        <hr class="a5e-rule" />
                    {:else}
                        <li class="a5e-context-menu__list-item">
                            <button
                                class="a5e-context-menu__list-button"
                                onpointerdown={(e) => {
                                    item.onClick();
                                }}
                            >
                                {#if item.icon}
                                    <i class={item.icon}></i>
                                {/if}

                                {localize(item.label as string)}
                            </button>
                        </li>
                    {/if}
                {/each}
            </ul>
        {/if}
    </div>
{/if}

<style lang="scss">
    .a5e-context-menu {
        background: rgba(0, 0, 0, 0.85);
        border: 1px khaki solid;
        width: var(--a5e-context=menu-width, min-content);
        height: var(--a5e-context-menu-height, min-content);
        z-index: 100;
        position: absolute;

        &__button {
            color: var(--a5e-context-menu-icon-color, inherit);
        }

        &__list {
            list-style: none;
            margin: 0.75rem;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.25rem;

            &-item {
                color: white;
            }

            &-button {
                color: white;
                font-size: var(--a5e-sm-text);
            }
        }
    }
</style>
