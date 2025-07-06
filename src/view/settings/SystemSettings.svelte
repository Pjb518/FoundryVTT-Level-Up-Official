<script lang="ts">
    import type { Tab } from "#view/navigation/data.ts";

    import { setContext } from "svelte";
    import { SvelteMap } from "svelte/reactivity";
    import { localize } from "#utils/localization/localize.ts";

    import NavigationBar from "#view/navigation/NavigationBar.svelte";

    import SettingsActorPage from "./SettingsActorPage.svelte";
    import SettingsCanvasPage from "./SettingsCanvasPage.svelte";
    import SettingsChatCardPage from "./SettingsChatCardPage.svelte";
    import SettingsEffectsPage from "./SettingsEffectsPage.svelte";
    import SettingsRollPage from "./SettingsRollPage.svelte";
    import Settings5ePage from "./Settings5ePage.svelte";
    import SettingsExtraPage from "./SettingsExtraPage.svelte";

    type Props = {
        appId: string;
        settings: any;
        sheet: any;
    };

    function onSubmit() {
        for (const [key, value] of updates) {
            // const setting = settings.getStore(key);
            // setting.set(value);
        }

        reload = true;
    }

    function updateCurrentTab(name: string) {
        const newTabName = name ?? "actor";
        currentTab = tabs.find((tab) => tab.name === newTabName) ?? tabs[0];
    }

    function getTabs(): Tab[] {
        return [
            {
                name: "actor",
                label: "A5E.settings.navigation.actor",
                icon: "fa-solid fa-user",
                component: SettingsActorPage,
            },
            {
                name: "canvas",
                label: "A5E.settings.navigation.canvas",
                component: SettingsCanvasPage,
                icon: "fa-solid fa-chess-board",
                display: game.user!.isGM,
            },
            {
                name: "chat",
                label: "A5E.settings.navigation.chat",
                icon: "fa-solid fa-comments",
                component: SettingsChatCardPage,
            },
            {
                name: "effects",
                label: "A5E.settings.navigation.activeEffects",
                icon: "fa-solid fa-bolt",
                component: SettingsEffectsPage,
                display: game.user!.isGM,
            },
            {
                name: "partyViewer",
                label: "Party Viewer",
                icon: "fa-solid fa-users",
                component: null, //SettingsPartyViewerTab,
                // display: $playersCanAccessPartyViewer,
            },
            {
                name: "rolls",
                label: "A5E.settings.navigation.rolls",
                icon: "fa-solid fa-dice",
                component: SettingsRollPage,
                display: game.user!.isGM,
            },
            {
                name: "5eSettings",
                label: "A5E.settings.navigation.5eSettings",
                icon: "fa-solid fa-dragon",
                component: Settings5ePage,
                display: game.user!.isGM,
            },
            {
                name: "extraSettings",
                label: "A5E.settings.navigation.extraSettings",
                icon: "fa-solid fa-gear",
                component: SettingsExtraPage,
                display: game.user!.isGM,
            },
            {
                name: "misc",
                label: "A5E.settings.navigation.misc",
                icon: "fa-solid fa-ellipsis",
                component: null, //SettingsMiscTab,
                display: game.user!.isGM,
            },
        ];
    }

    let { appId, settings, sheet }: Props = $props();

    let tabs = getTabs();
    let currentTab = $derived(tabs[0]);

    let updates = new SvelteMap();
    let reload = $state(false);

    setContext("appId", appId);
    setContext("settings", settings);
    setContext("updates", updates);
</script>

<main class="a5e-settings-sheet">
    <NavigationBar
        {currentTab}
        {tabs}
        showLock={false}
        onTabChange={updateCurrentTab}
    />

    <section class="a5e-settings-sheet__page">
        <currentTab.component bind:reload />
    </section>

    <section class="a5e-settings-sheet__footer">
        <button
            class="a5e-button"
            type="submit"
            onclick={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            {#if reload}
                <i
                    class="fa-solid fa-circle-exclamation"
                    style="color: var(--a5e-color-warning)"
                    data-tooltip="A5E.settings.reload"
                >
                </i>
            {:else}
                <i class="fa-solid fa-check"></i>
            {/if}

            {localize("A5E.SaveSubmit")}
        </button>
    </section>
</main>

<style lang="scss">
    .a5e-settings-sheet {
        position: relative;
        width: 100%;
        height: 100%;

        display: grid;
        grid-template-areas:
            "header"
            "primaryNavigation"
            "secondaryNavigation"
            "page"
            "footer";
        grid-template-columns: 1fr;
        grid-template-rows: min-content min-content min-content 1fr min-content;
        overflow-y: auto;

        &__page {
            grid-area: page;

            display: flex;
            flex-direction: column;
            gap: 0.75rem;

            padding-inline: 0.5rem;
            padding-block: 0.75rem;
            overflow-x: hidden;
        }

        &__footer {
            grid-area: footer;
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
            align-items: center;
            justify-content: space-between;
            font-size: var(--a5e-sm-text);
            padding-right: var(--a5e-actor-footer-padding-right, 0);
            padding-block: 0.5rem;
            padding-inline: 0.5rem;
        }
    }
</style>
