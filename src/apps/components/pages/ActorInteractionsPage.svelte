<script>
    import { getContext, onDestroy } from 'svelte';
    
    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import Filter from "../actorUtilityBar/Filter.svelte";
    import ItemCategory from '../ItemCategory.svelte';
    import Search from "../actorUtilityBar/Search.svelte";
    import SecondaryNavigationBar from '../navigation/SecondaryNavigationBar.svelte';
    import ShowDescription from "../actorUtilityBar/ShowDescription.svelte";
    import Sort from "../actorUtilityBar/Sort.svelte";
    import UtilityBar from "../actorUtilityBar/UtilityBar.svelte";
    
    import ActorSheetTempSettingsStore from '../../../stores/ActorSheetTempSettingsStore';
    
    import usesRequired from '../../../utils/usesRequired';
    
    function updateCurrentTab({ detail: name }) {
        const { uuid } = $actor;
        currentTab = name;
    
        ActorSheetTempSettingsStore.update((currentSettings) => ({
            ...currentSettings,
            [uuid]: {
                ...(currentSettings[uuid] ?? {}),
                currentInteractionTab: name,
            },
        }));
    }
    
    const actor = getContext('actor');
    const { interactions } = actor;
    const { A5E } = CONFIG;

    const reducerType = "interactions";
    const subTypes = A5E.interactionTypes;
    
    const tabs = {
        basicAction: {
            label: 'Basic Actions',
        },
        journey: {
            label: 'Journey Activities',
            display: $actor.type === 'character',
        },
        other: {
            label: 'Other Interactions',
        },
    };

    let showDescription = false;
    let showUses = usesRequired(interactions);
    let tempSettings = {};

    const unsubscribe = interactions.subscribe((_) => {
	    showUses = usesRequired(interactions);
    });

    onDestroy(() => {
        unsubscribe();
    });

    ActorSheetTempSettingsStore.subscribe((store) => {
        tempSettings = store;
    });

    let currentTab =
        tempSettings[$actor?.uuid]?.currentInteractionTab ?? 'journey';

    $: menuList = Object.entries(subTypes);

</script>

<SecondaryNavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />

{#if $actor.isOwner}
    <UtilityBar>
        <Search {reducerType} />
        <ShowDescription
            on:updateSelection={() => (showDescription = !showDescription)}
        />
        <Sort {reducerType} />
        <Filter {reducerType} />
        <CreateMenu {reducerType} {menuList} />
    </UtilityBar>
{/if}

<div class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <section class="a5e-page-wrapper a5e-page-wrapper--item-list">
        <ItemCategory
            label={tabs[currentTab].label}
            items={[...$interactions].filter((interaction) => interaction.system.interactionType === currentTab).sort((a, b) => a.sort - b.sort)}
            {showDescription}
            {showUses}
            type="interaction"
        />
    </section>
</div>