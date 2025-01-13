<script>
    import { getContext, onDestroy } from 'svelte';
    
    import ItemCategory from '../ItemCategory.svelte';
    import SecondaryNavigationBar from '../navigation/SecondaryNavigationBar.svelte';
    
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
    
    const tabs = {
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

</script>

<SecondaryNavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />

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