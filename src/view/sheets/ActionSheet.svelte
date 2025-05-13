<script lang="ts">
    import type { Action } from "#types/action.d.ts";
    import type { Tab } from "#view/navigation/data.ts";

    import { setContext } from "svelte";

    import { editDocumentImage } from "#utils/view/editDocumentImage.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import NavigationBar from "../navigation/NavigationBar.svelte";

    import ActionsActivationPage from "./pages/action/ActionActivationPage.svelte";
    import ActionsConsumersPage from "./pages/action/ActionConsumersPage.svelte";
    import ActionsDescriptionPage from "./pages/action/ActionDescriptionPage.svelte";
    import ActionsEffectsPage from "./pages/action/ActionEffectsPage.svelte";
    import ActionsPromptsPage from "./pages/action/ActionPromptsPage.svelte";
    import ActionsRollsPage from "./pages/action/ActionRollsPage.svelte";
    import ActionsTargetingPage from "./pages/action/ActionsTargetingPage.svelte";
    import ItemMacroPage from "./pages/item/ItemMacroPage.svelte";

    type Props = {
        actionId: string;
        actor?: Actor;
        item: Item;
        sheet: any;
    };

    function updateCurrentTab(tabId: string) {
        const newTab = tabs.find((tab) => tab.name === tabId);

        currentTab = newTab ?? tabs[0];
    }

    function getTabs(): Tab[] {
        return [
            {
                name: "description",
                label: "A5E.ItemSheetLabelDescriptionTab",
                icon: "fa-solid fa-file",
                component: ActionsDescriptionPage,
            },
            {
                name: "activation",
                label: "A5E.TabActivation",
                icon: "fa-solid fa-clock",
                component: ActionsActivationPage,
            },
            {
                name: "targeting",
                label: "A5E.TabTargeting",
                icon: "fa-solid fa-crosshairs",
                component: ActionsTargetingPage,
            },
            {
                name: "rolls",
                label: "A5E.TabRolls",
                icon: "fa-solid fa-dice-d20",
                component: ActionsRollsPage,
            },
            {
                name: "prompts",
                label: "A5E.TabPrompts",
                icon: "fa-solid fa-comment-dots",
                component: ActionsPromptsPage,
            },
            {
                name: "consumers",
                label: "A5E.TabResourceManagement",
                icon: "fa-solid fa-cogs",
                component: ActionsConsumersPage,
            },
            {
                name: "effects",
                label: "A5E.TabEffects",
                icon: "fa-solid fa-magic",
                component: ActionsEffectsPage,
            },
            {
                name: "macro",
                label: "A5E.TabMacro",
                icon: "fa-solid fa-terminal",
                component: ItemMacroPage,
            },
        ];
    }

    let { actionId, actor, item, sheet }: Props = $props();

    let action: Action = $derived(item.reactive.actions.get(actionId));

    let tabs = $state(getTabs());
    let currentTab = $derived(tabs[0]);

    setContext("actionId", actionId);
    setContext("actor", actor);
    setContext("item", item);
    setContext("sheet", sheet);
</script>

<main class="a5e-action-sheet">
    <header class="a5e-action-sheet__header">
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img
            class="a5e-action-sheet__header-image"
            src={action.img || item.reactive.img}
            alt="{action.name} image"
            onclick={() => editDocumentImage(item, { actionId })}
        />

        <input
            class="a5e-input a5e-input--character-name"
            type="text"
            value={action.name}
            placeholder="Action Name"
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    item,
                    `system.actions.${actionId}.name`,
                    currentTarget.value,
                )}
        />
    </header>

    <NavigationBar
        {currentTab}
        {tabs}
        showLock={false}
        onTabChange={updateCurrentTab}
    />

    <section class="a5e-action-sheet__page">
        <currentTab.component />
    </section>
</main>

<style lang="scss">
    .a5e-action-sheet {
        position: relative;
        width: 100%;
        height: 100%;

        display: grid;
        grid-template-areas:
            "header"
            "primaryNavigation"
            "page"
            "footer";
        grid-template-rows: min-content min-content 1fr min-content;
        gap: 0.5rem;

        padding-inline: 0.5rem;
        padding-block: 0.5rem;

        &__header {
            grid-area: header;
            display: flex;
            align-items: center;
            gap: 0.5rem;

            &-image {
                width: 3rem;
                height: 3rem;
                border-radius: 4px;
                cursor: pointer;
            }
        }

        &__page {
            grid-area: page;
            overflow-y: auto;
        }
    }
</style>
