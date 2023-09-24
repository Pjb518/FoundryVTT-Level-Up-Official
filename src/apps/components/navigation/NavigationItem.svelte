<script>
    import { createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    export let currentTab;
    export let index;
    export let tab;

    const dispatch = createEventDispatcher();
</script>

<li>
    <button
        class="nav-item {tab.name === currentTab.name && 'nav-item-active'}"
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
            font-size: $font-size-sm;
        }

        &-item {
            margin: 0;
            font-family: inherit;
            color: inherit;
            font-size: $font-size-sm;
            line-height: unset;
            background: transparent;
            border: none;

            transition: $standard-transition;

            &:focus,
            &:hover {
                transform: scale(1.1);
                box-shadow: none;
            }

            &-active {
                color: #fedd9e;
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
                    border-bottom: 3px solid #fedd9e;
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
