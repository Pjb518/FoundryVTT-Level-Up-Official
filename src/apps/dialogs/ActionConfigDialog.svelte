<svelte:options accessors={true} />

<script>
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
    import { getContext, setContext } from "svelte";

    import ActionsActivationTab from "../components/pages/ActionsActivationTab.svelte";
    import ActionsDescriptionTab from "../components/pages/ActionsDescriptionTab.svelte";
    import ActionsEffectsTab from "../components/pages/ActionsEffectsTab.svelte";
    import ActionsPromptsTab from "../components/pages/ActionsPromptsTab.svelte";
    import ActionsRollsTab from "../components/pages/ActionsRollsTab.svelte";
    import ActionsResourceManagementTab from "../components/pages/ActionsResourceManagementTab.svelte";
    import ActionsTargetingTab from "../components/pages/ActionsTargetingTab.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";

    import ItemDocument from "../ItemDocument";

    import editDocumentImage from "../handlers/editDocumentImage";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { actionId, dialog, itemDocument } =
        getContext("#external").application;

    const item = new ItemDocument(itemDocument);

    function updateCurrentTab(event) {
        currentTab = tabs[event.detail];
    }

    const tabs = [
        {
            name: "description",
            label: "A5E.ItemSheetLabelDescriptionTab",
            component: ActionsDescriptionTab,
        },
        {
            name: "activation",
            label: "A5E.TabActivation",
            component: ActionsActivationTab,
        },
        {
            name: "targeting",
            label: "A5E.TabTargeting",
            component: ActionsTargetingTab,
        },
        {
            name: "rolls",
            label: "A5E.TabRolls",
            component: ActionsRollsTab,
        },
        {
            name: "prompts",
            label: "A5E.TabPrompts",
            component: ActionsPromptsTab,
        },
        {
            name: "consumers",
            label: "A5E.TabResourceManagement",
            component: ActionsResourceManagementTab,
        },
        {
            name: "effects",
            label: "A5E.TabEffects",
            component: ActionsEffectsTab,
        },
    ];

    let currentTab = tabs[0];

    setContext("item", item);
    setContext("actionId", actionId);
</script>

<article>
    <header class="action-header">
        <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
        <img
            class="item-image"
            src={$item?.actions[actionId]?.img ?? $item.img}
            alt="{$item.name} image"
            on:click={() => editDocumentImage($item, { actionId, dialog })}
        />

        <input
            class="a5e-input a5e-input--character-name"
            type="text"
            name="name"
            value={$item.system.actions[actionId]?.name}
            placeholder="Action Name"
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.name`,
                    target.value
                )}
        />
    </header>

    <NavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />

    <svelte:component this={currentTab.component} />
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
        overflow: auto;
        background: $color-sheet-background;
    }

    .action-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .item-image {
        width: 3rem;
        height: 3rem;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
