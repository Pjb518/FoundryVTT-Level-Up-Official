<script>
    import { getContext } from "svelte";

    import ActorGeneralSettingsTab from "./ActorGeneralSettingsTab.svelte";
    import ActorInventorySettingsTab from "./ActorInventorySettingsTab.svelte";
    import ActorManeuverSettingsTab from "./ActorManeuverSettingsTab.svelte";
    import ActorRollSettingsTab from "./ActorRollSettingsTab.svelte";
    import ActorSpellSettingsTab from "./ActorSpellSettingsTab.svelte";
    import SecondaryNavigationBar from "../navigation/SecondaryNavigationBar.svelte";
    import ActorNpcSettingsTab from "./ActorNPCSettingsTab.svelte";

    import ActorSheetTempSettingsStore from "../../../stores/ActorSheetTempSettingsStore";

    function updateCurrentTab({ detail: name }) {
        const { uuid } = $actor;
        currentTab = name;

        ActorSheetTempSettingsStore.update((currentSettings) => ({
            ...currentSettings,
            [uuid]: {
                ...(currentSettings[uuid] ?? {}),
                currentSettingsTab: name,
            },
        }));
    }

    let tempSettings = {};

    ActorSheetTempSettingsStore.subscribe((store) => {
        tempSettings = store;
    });

    const actor = getContext("actor");

    const tabs = {
        general: {
            component: ActorGeneralSettingsTab,
            label: "General",
        },
        inventory: {
            component: ActorInventorySettingsTab,
            label: "Inventory",
        },
        maneuvers: {
            component: ActorManeuverSettingsTab,
            label: "Maneuvers",
            display: $actor.type === "character",
        },
        spells: {
            component: ActorSpellSettingsTab,
            label: "Spells",
        },
        rolls: {
            component: ActorRollSettingsTab,
            label: "Rolls",
            display: $actor.type === "character",
        },
        npc: {
            component: ActorNpcSettingsTab,
            label: "NPC Options",
            display:
                $actor.type === "npc" &&
                (game.settings.get("a5e", "randomizeNPCHitPoints") ?? true),
        },
    };

    let currentTab =
        tempSettings[$actor?.uuid]?.currentSettingsTab ?? "general";
</script>

<SecondaryNavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />

<section class="a5e-page-wrapper">
    <svelte:component this={tabs[currentTab]?.component} />
</section>
