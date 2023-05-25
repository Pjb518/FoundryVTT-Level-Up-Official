<script>
    import { getContext } from "svelte";
    import LockButton from "./LockButton.svelte";
    import NavigationItem from "./NavigationItem.svelte";

    const actor = getContext("actor");

    export let currentTab;
    export let tabs;
    export let showLock = false;
</script>

<nav class="nav-wrapper">
    <ul class="nav-list">
        {#each tabs as tab, index}
            {#if tab?.display ?? true}
                <NavigationItem on:tab-change {tab} {index} {currentTab} />
            {/if}
        {/each}

        <!-- svelte-ignore missing-declaration -->
        {#if showLock && !$actor?.pack && $actor.permission !== CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER}
            <LockButton />
        {/if}
    </ul>
</nav>

<style lang="scss">
    .nav-wrapper {
        margin: 0.25rem 0;
        padding: 0.375rem 0.75rem;
        background: #425f65;
        color: #f6f2eb;
        font-family: "Modesto Condensed", serif;
        font-size: 1rem;
        border-radius: 3px;
        text-transform: lowercase;
        box-shadow: 0 0 10px darken($color: #425f65, $amount: 10) inset;
    }

    .nav-list {
        display: flex;
        gap: 0.5rem;
        margin: 0;
        padding: 0;
        list-style: none;
    }
</style>
