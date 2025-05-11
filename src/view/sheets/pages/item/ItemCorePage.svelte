<script lang="ts">
    import type { Tab } from "#view/navigation/data.ts";

    import { getContext } from "svelte";
    import { getSummaryData } from "#utils/summaries/getSummaryData.ts";

    import Editor from "#view/components/Editor.svelte";
    import ItemSummary from "../../components/item/ItemSummary.svelte";
    import SecondaryNavigationBar from "#view/navigation/SecondaryNavigationBar.svelte";

    function getProperty(): string {
        if (currentTab.name === "description") return "description";
        if (currentTab.name === "gmNotes") return "secretDescription";
        return "unidentifiedDescription";
    }

    function getTabs(): Tab[] {
        return [
            {
                name: "description",
                label: "A5E.ItemSheetLabelDescriptionTab",
                display: !itemStore.unidentified || game.user?.isGM,
            },
            {
                name: "unIdentifiedDescription",
                label: "A5E.ItemSheetLabelUnidentifiedDescriptionTab",
                display:
                    item.type === "object" &&
                    (itemStore.unidentified || game.user?.isGM),
            },
            {
                name: "gmNotes",
                label: "GM Notes",
                display: game.user?.isGM,
            },
        ];
    }

    function updateCurrentTab(name: string) {
        const { uuid } = item;
        const newTabName = name ?? "description";
        currentTab = tabs.find((tab) => tab.name === newTabName) ?? tabs[0];
    }

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);
    let summaryData = $derived(getSummaryData(item.reactive));

    let tabs = $derived(getTabs());
    let currentTab = $derived(
        itemStore?.unidentified && !game.user?.isGM ? tabs[1] : tabs[0],
    );

    let property = $derived(getProperty());
</script>

<SecondaryNavigationBar
    currentTab={currentTab.name}
    {tabs}
    onTabChange={updateCurrentTab}
/>

<section class="a5e-page-wrapper">
    {#if currentTab.name === "description" && Object.values(summaryData ?? {}).some(Boolean)}
        <ItemSummary {summaryData} --inline-padding="0.25rem" />

        <hr class="a5e-rule a5e-rule--card" />
    {/if}

    {#key itemStore[property]}
        <Editor
            content={itemStore[property]}
            document={item}
            documentUuid={item.uuid}
            field="system.{property}"
            manageSecrets={item.isOwner}
        />
    {/key}
</section>
