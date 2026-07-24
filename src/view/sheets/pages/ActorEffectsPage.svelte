<script lang="ts">
    import { getContext } from "svelte";

    import { createEffect } from "#utils/createActiveEffect.ts";
    import { filterEffects } from "#utils/view/filterEffects.ts";
    import { groupEffectsByType } from "#utils/view/groupEffectsByType.ts";

    import UtilityBar from "../../snippets/UtilityBar.svelte";
    import EffectCategory from "#view/sheets/components/effect/EffectCategory.svelte";
    import type { Tab } from "#view/navigation/data.ts";
    import { actorSheetTempSettings } from "#stores/ActorSheetTempSettingsStore.svelte.ts";
    import SecondaryNavigationBar from "#view/navigation/SecondaryNavigationBar.svelte";
    import { scss } from "svelte-preprocess";

    function onAddIconClick() {
        createEffect(actor, { effectType: "passive" });
    }

    function sortHandler(reverse: boolean) {
        sheet._sortEmbeddedAlphabetically(effects, "ActiveEffect", reverse);
    }

    function updateCurrentTab(name: string) {
        const { uuid } = actor;
        currentTab = tabs.find((tab) => tab.name === name) ?? tabs[0];

        actorSheetTempSettings[uuid].currentEffectsTab = name;
    }

    const tabs: Tab[] = [
        {
            name: "effects",
            label: "Active Effects",
        },
        {
            name: "conditions",
            label: "Conditions",
        },
    ];

    let filterOptions = $state({
        searchTerm: "",
        showDescription: false,
    });

    let actor: any = getContext("actor");
    let sheet: any = getContext("sheet");

    let effects = $derived(filterEffects(actor.reactive, "", filterOptions));
    let categorizedEffects = $derived(groupEffectsByType(effects));

    const openCompendium = game.a5e.utils.openCompendium;
    const subTypes = CONFIG.A5E.activeEffectTypes;

    let currentTab = $derived(
        tabs.find(
            (tab) =>
                tab.name ===
                actorSheetTempSettings[actor.uuid]?.currentEffectsTab,
        ) ?? tabs[0],
    );

    const conditionManager = game.a5e.ConditionManager;
    const conditions = [...conditionManager.conditions];
</script>

<SecondaryNavigationBar
    currentTab={currentTab.name}
    {tabs}
    onTabChange={updateCurrentTab}
/>

{#if actor.isOwner && currentTab.name === "effects"}
    <UtilityBar
        bind:filterOptions
        showAddIcon={true}
        showSortButton={true}
        {onAddIconClick}
        {sortHandler}
    />
{/if}

{#if currentTab.name === "effects"}
    <section class="a5e-page-wrapper a5e-page-wrapper--item-list">
        {#each Object.entries(categorizedEffects) as [label, effectList]}
            {#if effectList.length > 0}
                <EffectCategory label={subTypes[label]} effects={effectList} />
            {/if}
        {/each}
    </section>
{/if}

{#if currentTab.name === "conditions"}
    <section class="a5e-actor-conditions-section">
        {#each conditions as [conditionId, condition]}
            <div
                class="a5e-condition-item"
                class:a5e-condition-item--active={actor.reactive.statuses.has(conditionId)}
            >
                <img
                    class="a5e-condition-item__img"
                    src={condition.img}
                    alt={condition.name}
                />

                <span class="a5e-condition-item__name">
                   {condition.name}
                </span>
            </div>
        {/each}
    </section>
{/if}

<style lang="scss">
    .a5e-actor-conditions-section {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 0.25rem;
    }

    .a5e-condition-item {
        display: flex;
        gap: 0.5rem;
        justify-items: center;
        align-items: center;
        padding-inline: 0.75rem;
        padding-block: 0.125rem;
        border: 1px solid var(--a5e-border-color);
        border-radius: var(--a5e-border-radius-standard);
        /* background-color: var(--a5e-button-regular); */

        &__img {
            border-radius: 50%;
            width: 1.5rem;
            aspect-ratio: 1 / 1;
        }

        &--active {
            background-color: var(--a5e-button-primary);
        }
    }
</style>
