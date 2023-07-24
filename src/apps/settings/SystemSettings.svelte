<svelte:options accessors={true} />

<script>
    import { getContext, setContext } from "svelte";
    import { ApplicationShell } from "#runtime/svelte/component/core";
    import { localize } from "#runtime/svelte/helper";

    import NavigationBar from "../components/navigation/NavigationBar.svelte";
    import Settings5eTab from "./Settings5eTab.svelte";
    import SettingsActorTab from "./SettingsActorTab.svelte";
    import SettingsCanvasTab from "./SettingsCanvasTab.svelte";
    import SettingsChatCardTab from "./SettingsChatCardTab.svelte";
    import SettingsEffectsTab from "./SettingsEffectsTab.svelte";
    import SettingsRollTab from "./SettingsRollTab.svelte";

    export let elementRoot;
    export let { appId, settings, dialog } =
        getContext("#external").application;

    function onSubmit() {
        for (const [key, value] of updates) {
            const setting = settings.getStore(key);
            setting.set(value);
        }

        dialog.submit({
            reload,
        });
    }

    function updateCurrentTab(event) {
        currentTab = tabs[event.detail];
    }

    const tabs = [
        {
            name: "actor",
            label: "A5E.settings.navigation.actor",
            component: SettingsActorTab,
        },
        {
            name: "canvas",
            label: "A5E.settings.navigation.canvas",
            component: SettingsCanvasTab,
        },
        {
            name: "chat",
            label: "A5E.settings.navigation.chat",
            component: SettingsChatCardTab,
        },
        {
            name: "effects",
            label: "A5E.settings.navigation.activeEffects",
            component: SettingsEffectsTab,
        },
        {
            name: "rolls",
            label: "A5E.settings.navigation.rolls",
            component: SettingsRollTab,
        },
        {
            name: "5eSettings",
            label: "A5E.settings.navigation.5eSettings",
            component: Settings5eTab,
        },
    ];

    let currentTab = tabs[0];
    let updates = new Map();
    let reload = false;

    setContext("settings", settings);
    setContext("appId", appId);
    setContext("updates", updates);
</script>

<ApplicationShell bind:elementRoot>
    <main>
        <section>
            <NavigationBar
                {currentTab}
                {tabs}
                on:tab-change={updateCurrentTab}
            />

            <svelte:component this={currentTab.component} bind:reload />
        </section>

        <button class="submit" on:click|preventDefault={() => onSubmit()}>
            {#if reload}
                <i
                    class="fa-solid fa-circle-exclamation"
                    style="color: #8b6225"
                    data-tooltip={localize("A5E.settings.reload")}
                    data-tooltip-direction="UP"
                />
            {:else}
                <i class="fas fa-save" />
            {/if}
            {localize("A5E.SaveSubmit")}
        </button>
    </main>
</ApplicationShell>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;

        background: rgba(246, 242, 235, 0.5);
    }

    .submit {
        margin-top: auto;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
