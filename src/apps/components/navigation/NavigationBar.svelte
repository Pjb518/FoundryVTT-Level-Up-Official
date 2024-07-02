<script>
    import { getContext } from "svelte";

    import AddButton from "./AddButton.svelte";
    import LockButton from "./LockButton.svelte";
    import NavigationItem from "./NavigationItem.svelte";

    export let currentTab;
    export let tabs;
    export let showLock = false;
    export let showAdd = false;

    const actor = getContext("actor");
    const observerPermissionsLevel = CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;
</script>

<nav class="nav-wrapper">
    <ul class="nav-list">
        {#each tabs as tab, index}
            {#if tab?.display ?? true}
                <NavigationItem on:tab-change {tab} {index} {currentTab} />
            {/if}
        {/each}

        {#if showLock && $actor.permission !== observerPermissionsLevel}
            <LockButton />
        {/if}

        {#if showAdd}
            <AddButton on:add-button-clicked />
        {/if}
    </ul>
</nav>

<style lang="scss">
    .nav-wrapper {
        flex-grow: 0;
        margin: 0.25rem 0;
        padding: 0.375rem 0.75rem;
        background: var(--a5e-color-primary);
        color: $color-light-text;
        font-family: $font-primary;
        font-size: $font-size-md;
        border-radius: $border-radius-standard;
        text-transform: lowercase;
        box-shadow: 0 0 10px #darken(var(--a5e-color-primary), 10) inset;
    }

    .nav-list {
        display: flex;
        gap: 0.375rem;
        margin: 0;
        padding: 0;
        list-style: none;
    }
</style>
