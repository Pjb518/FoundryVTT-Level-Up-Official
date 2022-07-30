<script>
    import { createEventDispatcher } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let currentTab;
    export let tabs;

    const dispatch = createEventDispatcher();
</script>

<nav class="nav-wrapper">
    <ul class="nav-list">
        {#each tabs as tab, index}
            <li
                class="nav-list-item {tab.name === currentTab.name &&
                    'nav-list-item-active'}"
                on:click={() => dispatch("tab-change", index)}
            >
                {localize(tab.label)}
            </li>
        {/each}
    </ul>
</nav>

<style lang="scss">
    .nav-wrapper {
        padding: 0.375rem 1.25rem;
        width: calc(100% - 1.5rem);
        margin: 0 auto;
        background: #2b6537;
        color: #f6f2eb;
        font-family: "Modesto Condensed", serif;
        font-size: 1rem;
        border-radius: 3px;
        text-transform: lowercase;
        box-shadow: 0 0 10px darken($color: #2b6537, $amount: 10) inset;
    }

    .nav-list {
        display: flex;
        gap: 1rem;
        margin: 0;
        padding: 0;
        list-style: none;

        &-item {
            cursor: pointer;
            transition: all 0.15s ease-in-out;

            &:hover {
                transform: scale(1.1);
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

                &:hover {
                    transform: none;
                }
            }
        }
    }
</style>
