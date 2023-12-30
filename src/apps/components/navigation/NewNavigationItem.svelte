<script>
    import { createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    export let currentTab;
    export let name;
    export let icon;
    export let label;

    const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<li
    class="a5e-nav-item {icon}"
    class:a5e-nav-item--active={name === currentTab.name}
    on:click={() => dispatch("tab-change", name)}
    data-tooltip={localize(label)}
    data-tooltip-direction="UP"
/>
