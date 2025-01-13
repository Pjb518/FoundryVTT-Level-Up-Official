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
                currentActivityTab: name,
            },
        }));
    }
    
    const actor = getContext('actor');
    const { activities } = actor;
    
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
    let showUses = usesRequired(activities);
    let tempSettings = {};

    const unsubscribe = activities.subscribe((_) => {
	    showUses = usesRequired(activities);
    });

    onDestroy(() => {
        unsubscribe();
    });

    ActorSheetTempSettingsStore.subscribe((store) => {
        tempSettings = store;
    });

    let currentTab =
        tempSettings[$actor?.uuid]?.currentActivityTab ?? 'journey';

</script>

<SecondaryNavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />

<div class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <section class="a5e-page-wrapper a5e-page-wrapper--item-list">
        <ItemCategory
            label={tabs[currentTab].label}
            items={[...$activities].filter((activity) => activity.system.activityType === currentTab).sort((a, b) => a.sort - b.sort)}
            {showDescription}
            {showUses}
            type="activity"
        />
    </section>
</div>