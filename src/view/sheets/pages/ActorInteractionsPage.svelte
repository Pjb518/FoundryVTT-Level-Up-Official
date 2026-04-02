<script lang="ts">
    import type { Tab } from "#view/navigation/data.ts";

    import { getContext } from "svelte";

    import createItem from "#utils/createItem.ts";
    import ItemCategory from "../components/ItemCategory.svelte";
    import SecondaryNavigationBar from "#view/navigation/SecondaryNavigationBar.svelte";
    import UtilityBar from "../../snippets/UtilityBar.svelte";

    import { actorSheetTempSettings } from "#stores/ActorSheetTempSettingsStore.svelte.ts";

    import { filterItems } from "#utils/view/filterItems.ts";
    import { usesRequired } from "#utils/view/usesRequired.ts";

    function sortHandler(reverse: boolean) {
        sheet._sortEmbeddedAlphabetically(items, "Item", reverse);
    }

    function updateCurrentTab(name: string) {
        const { uuid } = actor;
        const newTabName = name ?? "journey";
        currentTab = tabs.find((tab) => tab.name === newTabName) ?? tabs[0];

        actorSheetTempSettings[uuid].currentInteractionTab = name;
    }

    let actor: any = getContext("actor");
    let sheet: any = getContext("sheet");

    let filterOptions = $state({
        searchTerm: "",
        searchDescription: false,
        page: "interactions",
    });

    const tabs: Tab[] = [
        {
            name: "basicAction",
            label: "Basic Actions",
        },
        {
            name: "journey",
            label: "Journey Activities",
            display: actor.type === "character",
        },
        {
            name: "other",
            label: "Other Interactions",
        },
    ];

    let showDescription = $state(false);

    const defaultTab = "journey";
    let currentTab = $derived(
        tabs.find(
            (tab) =>
                tab.name === actorSheetTempSettings[actor.uuid]?.currentInteractionTab,
        ) ??
            tabs.find((tab) => tab.name === defaultTab) ??
            tabs[0],
    );

    let items = $derived(
        filterItems(actor.reactive, "interaction", {
            searchTerm: filterOptions.searchTerm,
            searchDescription: filterOptions.searchDescription,
            filters: (item: any) => item.system.interactionType === currentTab.name,
        }),
    );

    let showUses = $derived(usesRequired(items));

    let interactionTypes = Object.entries(CONFIG.A5E.interactionTypes) as string[][];
</script>

<SecondaryNavigationBar
    currentTab={currentTab.name}
    {tabs}
    onTabChange={updateCurrentTab}
/>

{#if actor.isOwner}
    <UtilityBar
        bind:filterOptions
        showAddIcon={true}
        addIconOptions={interactionTypes}
        showDescriptionButton={true}
        bind:showDescription
        showFilters={false}
        showSortButton={true}
        {sortHandler}
        onAddIconClick={(subType) => createItem(actor, "interaction", subType)}
    ></UtilityBar>
{/if}

<div class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <section class="a5e-page-wrapper a5e-page-wrapper--item-list">
        <ItemCategory
            label={currentTab.label}
            {items}
            {showDescription}
            {showUses}
            type="interaction"
        />
    </section>
</div>
