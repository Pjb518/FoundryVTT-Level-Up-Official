<script lang="ts">
    import { getContext } from "svelte";

    import SecondaryNavigationBar from "../../navigation/SecondaryNavigationBar.svelte";

    import ActorGeneralSettingsTab from "./subPages/ActorGeneralSettingsTab.svelte";
    import ActorInventorySettingsTab from "./subPages/ActorInventorySettingsTab.svelte";
    import ActorManeuverSettingsTab from "./subPages/ActorManeuverSettingsTab.svelte";
    import ActorNpcSettingsTab from "./subPages/ActorNpcSettingsTab.svelte";
    import ActorRollSettingsTab from "./subPages/ActorRollSettingsTab.svelte";
    import ActorSpellSettingsTab from "./subPages/ActorSpellSettingsTab.svelte";

    import { actorSheetTempSettings } from "#stores/ActorSheetTempSettingsStore.svelte.ts";
    import type { Tab } from "#view/navigation/data.ts";

    function updateCurrentTab(name: string) {
        const { uuid } = actor;
        const newTabName = name ?? "general";
        currentTab = tabs.find((tab) => tab.name === newTabName) ?? tabs[0];

        actorSheetTempSettings[uuid].currentSettingsTab = name;
    }

    let actor: any = getContext("actor");
    let actorStore = $derived(actor.reactive.system);
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    const tabs: Tab[] = [
        {
            name: "general",
            component: ActorGeneralSettingsTab,
            label: "General",
        },
        {
            name: "inventory",
            component: ActorInventorySettingsTab,
            label: "Inventory",
        },
        {
            name: "maneuvers",
            component: ActorManeuverSettingsTab,
            label: "Maneuvers",
            display: actor.type === "character",
        },
        {
            name: "spells",
            component: ActorSpellSettingsTab,
            label: "Spells",
        },
        {
            name: "rolls",
            component: ActorRollSettingsTab,
            label: "Rolls",
            display: actor.type === "character",
        },
        {
            name: "npc",
            component: ActorNpcSettingsTab,
            label: "NPC Options",
            display: actor.type === "npc",
        },
    ];

    let currentTab = $derived(
        tabs.find(
            (tab) =>
                tab.name ===
                actorSheetTempSettings[actor.uuid]?.currentSettingsTab,
        ) ?? tabs[0],
    );
</script>

<SecondaryNavigationBar
    currentTab={currentTab.name}
    {tabs}
    onTabChange={updateCurrentTab}
/>

<section class="a5e-page-wrapper">
    <currentTab.component />
</section>
