<script lang="ts">
    import type { Tab } from "./data.ts";

    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";
    import { toggleSheetLockedState } from "#utils/view/toggleSheetLockedState.ts";

    import NavigationItem from "./NavigationItem.svelte";

    type Props = {
        currentTab: Tab;
        tabs: Tab[];
        showLock?: boolean;
        onTabChange: (name: string) => void;
    };

    let { currentTab, tabs, showLock = false, onTabChange }: Props = $props();

    let actor: any = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");
    const observerPermissionsLevel = CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;
</script>

{sheetIsLocked()}
<nav class="a5e-nav" class:a5e-nav--flat-bottom={currentTab.hasSubNavigation}>
    <!-- This allows us to reserve enough space for the largest tab name -->
    {#each tabs as { name, label }}
        <span
            class="a5e-nav__current-tab-label"
            class:a5e-nav__current-tab-label--active={name === currentTab.name}
        >
            {localize(label!) || name}
        </span>
    {/each}

    <ul class="a5e-nav-list">
        {#each tabs as { name, display, icon, label }}
            {#if display ?? true}
                <NavigationItem
                    {icon}
                    {label}
                    {name}
                    {currentTab}
                    {onTabChange}
                />
            {/if}
        {/each}

        {#if showLock && actor.permission !== observerPermissionsLevel}
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <li
                class="a5e-nav-item a5e-nav-item--lock fa-solid {sheetIsLocked()
                    ? 'fa-lock'
                    : 'fa-lock-open'}"
                class:a5e-nav-item--active={sheetIsLocked()}
                onclick={({ currentTarget }) => {
                    toggleSheetLockedState(actor);
                    currentTarget.blur();
                }}
            ></li>
        {/if}

        <!-- This is needed to align the last tab to look like the others for some reason -->
        <li></li>
    </ul>
</nav>
