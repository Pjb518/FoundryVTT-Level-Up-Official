<script>
    import { createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    export let currentTab;
    export let name;
    export let tab;

    const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<li
    class="a5e-secondary-nav-list__item"
    class:a5e-secondary-nav-item--active={name === currentTab}
    on:click={() => dispatch("tab-change", name)}
>
    {localize(tab.label)}
</li>
