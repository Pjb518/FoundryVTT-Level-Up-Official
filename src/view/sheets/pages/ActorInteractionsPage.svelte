<script lang="ts">
    import type { Tab } from "#view/navigation/data.ts";

    import { getContext } from "svelte";

    import ItemCategory from "../components/ItemCategory.svelte";
    import SecondaryNavigationBar from "#view/navigation/SecondaryNavigationBar.svelte";

    import { actorSheetTempSettings } from "#stores/ActorSheetTempSettingsStore.svelte.ts";

    import { filterItems } from "#utils/view/filterItems.ts";
    import { usesRequired } from "#utils/view/usesRequired.ts";

    function updateCurrentTab(name: string) {
        const { uuid } = actor;
        const newTabName = name ?? "journey";
        currentTab = tabs.find((tab) => tab.name === newTabName) ?? tabs[0];

        actorSheetTempSettings[uuid].currentInteractionTab = name;
    }

    let actor: any = getContext("actor");

    const tabs: Tab[] = [
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
            filters: (item: any) => item.system.interactionType === currentTab.name,
        }),
    );

    let showUses = $derived(usesRequired(items));
</script>

<SecondaryNavigationBar
    currentTab={currentTab.name}
    {tabs}
    onTabChange={updateCurrentTab}
/>

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
