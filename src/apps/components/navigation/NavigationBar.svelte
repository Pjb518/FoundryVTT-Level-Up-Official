<script>
    import { getContext } from "svelte";

    import AddButton from "./AddButton.svelte";
    import LockButton from "./LockButton.svelte";
    import NavigationItem from "./NavigationItem.svelte";

    const actor = getContext("actor");

    export let currentTab;
    export let tabs;
    export let showLock = false;
    export let showAdd = false;
</script>

<nav class="nav-wrapper">
    <ul class="nav-list">
        {#each tabs as tab, index}
            {#if tab?.display ?? true}
                <NavigationItem on:tab-change {tab} {index} {currentTab} />
            {/if}
        {/each}

        <!-- svelte-ignore missing-declaration -->
        {#if showLock && $actor.permission !== CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER}
            <LockButton />
        {/if}

        <!-- svelte-ignore missing-declaration -->
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
        background: $color-primary;
        color: $color-light-text;
        font-family: $font-primary;
        font-size: $font-size-md;
        border-radius: $border-radius-standard;
        text-transform: lowercase;
        box-shadow: 0 0 10px darken($color: $color-primary, $amount: 10) inset;
    }

    .nav-list {
        display: flex;
        gap: 0.5rem;
        margin: 0;
        padding: 0;
        list-style: none;
    }
</style>
