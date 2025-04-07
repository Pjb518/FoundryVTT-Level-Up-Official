<script>
    import { createEventDispatcher } from "svelte";
    import { localize } from "#runtime/util/i18n";

    export let currentTab;
    export let index;
    export let tab;

    const dispatch = createEventDispatcher();
</script>

<li>
    <button
        class="nav-item"
        class:nav-item-active={tab.name === currentTab.name}
        on:click={() => dispatch("tab-change", index)}
    >
        {#if tab.icon}
            <i class="nav-icon {tab.icon}" />
        {/if}

        {#if tab.label}{localize(tab.label)}{/if}
    </button>
</li>

<style lang="scss">
    .nav {
        &-icon {
            color: var(--a5e-primary-nav-item-color);
            font-size: var(--a5e-text-size-sm);
        }

        &-item {
            margin: 0;
            padding-block-start: 0.25rem;
            height: 17px;
            font-family: inherit;
            color: inherit;
            font-size: var(--a5e-text-size-sm);
            background: transparent;
            border: none;

            transition: var(--a5e-transition-standard);

            &:focus,
            &:hover {
                transform: scale(1.1);
                box-shadow: none;
                outline: none;
            }

            &-active {
                color: var(--a5e-primary-nav-item-color);
                position: relative;

                &:after {
                    content: "";
                    position: absolute;
                    bottom: -0.375rem;
                    left: 50%;
                    width: 0;
                    height: 0;
                    border-left: 3px solid transparent;
                    border-right: 3px solid transparent;
                    border-bottom: 3px solid var(--a5e-primary-nav-item-color);
                    transform: translateX(-50%);
                }

                &:focus,
                &:hover {
                    transform: none;
                }
            }
        }
    }
</style>
