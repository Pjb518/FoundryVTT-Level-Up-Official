<script>
    import { localize } from "#runtime/util/i18n";
    import { getContext, onDestroy } from 'svelte';

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";
    
    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import Filter from "../actorUtilityBar/Filter.svelte";
    import ItemCategory from '../ItemCategory.svelte';
    import Search from "../actorUtilityBar/Search.svelte";
    import SecondaryNavigationBar from '../navigation/SecondaryNavigationBar.svelte';
    import ShowDescription from "../actorUtilityBar/ShowDescription.svelte";
    import Sort from "../actorUtilityBar/Sort.svelte";
    import TabFooter from "../TabFooter.svelte";
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
    const appId = getContext('appId');
    const { interactions } = actor;
    const { A5E } = CONFIG;

    const reducerType = "interactions";
    const subTypes = A5E.interactionTypes;
    const showFavorPoints = game.settings.get("a5e", "showFavorPoints") ?? false;
    
    const tabs = {
        basicAction: {
            label: 'Basic Actions',
        },
        downtime: {
            label: 'Downtime Activities',
            display: $actor.type === 'character',
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

    $: favorPoints = $actor.system.attributes.favorPoints;
    $: keyKnowledge = $actor.system.keyKnowledge;
    $: projectTime = $actor.system.projectTime;
    $: religiousFavors = $actor.system.religiousFavors;
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

<TabFooter --padding-right="1rem">
    {#if currentTab === 'downtime'}
        <section class="shield-container">
            <div class="shield">
                <h3
                    class="footer-shield-header"
                >
                    {#if showFavorPoints}
                        {localize("Religious Favors")}
                    {:else}
                        {localize("Favors")}
                    {/if}
                </h3>

                <input
                    class="a5e-footer-group__input"
                    class:disable-pointer-events={!$actor.isOwner}
                    type="number"
                    name="system.religiousFavors"
                    value={religiousFavors}
                    placeholder="0"
                    min="0"
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            Number(target.value),
                        )}
                />
            </div>

            <div class="shield">
                <h3
                    class="footer-shield-header"
                >
                    {localize("Key Knowledge")}
                </h3>

                <input
                    class="a5e-footer-group__input"
                    class:disable-pointer-events={!$actor.isOwner}
                    type="number"
                    name="system.keyKnowledge"
                    value={keyKnowledge}
                    placeholder="0"
                    min="0"
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            Number(target.value),
                        )}
                />
            </div>

            <div class="shield">
                <div class="shield shield--projectName">
                    <h3
                        class="footer-shield-header"
                    >
                        {localize("Project")}
                    </h3>
    
                    <input
                        class="a5e-input a5e-input--slim"
                        type="text"
                        value={$actor.system.projectName || ""}
                        id={`${appId}-projectName`}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                "system.projectName",
                                target.value,
                            )}
                    />
                </div>

                <div class="shield">
                    <h3
                        class="footer-shield-header"
                    >
                        {localize("Time Spent")}
                    </h3>
    
                    <input
                        class="a5e-footer-group__input"
                        class:disable-pointer-events={!$actor.isOwner}
                        type="number"
                        name="system.projectTime"
                        value={projectTime}
                        placeholder="0"
                        min="0"
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                Number(target.value),
                            )}
                    />
                </div>
            </div>
        </section>
    {:else if currentTab === 'journey' && showFavorPoints}
        <section class="shield-container">
            <div class="shield">
                <h3
                    class="footer-shield-header"
                >
                    {localize("Social Favors")}
                </h3>

                <input
                    class="a5e-footer-group__input"
                    class:disable-pointer-events={!$actor.isOwner}
                    type="number"
                    name="system.attributes.favorPoints.current"
                    value={favorPoints.current}
                    placeholder="0"
                    min="0"
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            Number(target.value),
                        )}
                />

                /

                <span class="a5e-footer-group__value">
                    {favorPoints.max}
                </span>
            </div>
        </section>
    {/if}
</TabFooter>

<style lang="scss">
    .footer-shield-header {
        flex: 0 0 100%;
        text-align: center;
        font-size: var(--a5e-text-size-sm);
        font-weight: bold;
    }

    .shield {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        
        &--projectName {
            width: 8rem;
        }
    }

    .shield-container {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: start;
        gap: 0.5rem;
    }
</style>