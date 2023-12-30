<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import toggleSheetLockedState from "../../handlers/toggleSheetLockedState";

    import NavigationItem from "./NewNavigationItem.svelte";

    export let currentTab;
    export let tabs;
    export let showLock = false;

    const actor = getContext("actor");

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<nav class="a5e-nav" class:a5e-nav--flat-bottom={currentTab.hasSubNavigation}>
    <!-- This allows us to reserve enough space for the largest tab name -->
    {#each tabs as { name, label }}
        <span
            class="a5e-nav__current-tab-label"
            class:a5e-nav__current-tab-label--active={name === currentTab.name}
        >
            {localize(label)}
        </span>
    {/each}

    <ul class="a5e-nav-list">
        {#each tabs as { name, display, icon, label }}
            {#if display ?? true}
                <NavigationItem
                    on:tab-change
                    {icon}
                    {label}
                    {name}
                    {currentTab}
                />
            {/if}
        {/each}

        <!-- svelte-ignore missing-declaration -->
        {#if showLock && $actor.permission !== CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER}
            <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
            <li
                class="a5e-nav-item a5e-nav-item--lock fa-solid {sheetIsLocked
                    ? 'fa-lock'
                    : 'fa-unlock'}"
                class:a5e-nav-item--active={sheetIsLocked}
                on:click={({ target }) => {
                    toggleSheetLockedState($actor);
                    target.blur();
                }}
                data-tooltip="Toggle Sheet Lock"
                data-tooltip-direction="UP"
            />
        {/if}

        <!-- svelte-ignore missing-declaration -->
        <!-- {#if showAdd}
            <AddButton on:add-button-clicked />
        {/if} -->
    </ul>
</nav>
