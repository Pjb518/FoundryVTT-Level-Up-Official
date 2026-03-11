<script lang="ts">
    import type { Tab } from "#view/navigation/data.ts";

    import NavigationBar from "#view/navigation/NavigationBar.svelte";
    import CompendiumFiltersTab from "./CompendiumFiltersTab.svelte";
    import CompendiumItemList from "./CompendiumItemList.svelte";

    function updateCurrentTab(name: string) {
        const newTabName = name ?? "archetype";

        currentTab = tabs.find((tab) => tab.name === newTabName) ?? tabs[0];
    }

    const tabs: Tab[] = [
        {
            name: "archetype",
            label: "Archetypes",
            icon: "fa-solid fa-user-gear",
        },
        {
            name: "background",
            label: "Backgrounds",
            icon: "fa-solid fa-person-walking-luggage",
        },
        {
            name: "class",
            label: "Classes",
            icon: "fa-solid fa-chalkboard-user",
        },
        {
            name: "destiny",
            label: "Destinies",
            icon: "fa-solid fa-chart-line",
        },
        {
            name: "feature",
            label: "Features",
            icon: "fa-solid fa-shield-halved",
        },
        {
            name: "heritage",
            label: "Heritages",
            icon: "fa-solid fa-dna",
        },
        {
            name: "maneuver",
            label: "Maneuvers",
            icon: "fa-solid fa-person-running",
        },
        {
            name: "npc",
            label: "Monsters",
            icon: "fa-solid fa-dragon",
        },
        {
            name: "object",
            label: "Objects",
            icon: "fa-solid fa-cubes-stacked",
        },
        {
            name: "spell",
            label: "Spells",
            icon: "fa-solid fa-wand-sparkles",
        },
    ];

    const types = {
        archetype: "Archetypes",
        background: "Backgrounds",
        class: "Classes",
        destiny: "Destinies",
        feature: "Features",
        heritage: "Heritages",
        maneuver: "Maneuvers",
        npc: "Monsters",
        object: "Objects",
        spell: "Spells",
    };

    let currentTab = $state(tabs[8]);
    let viewTab = $state("items");
    let filterOptions = $state({
        searchTerm: "",
        selections: {},
    });

    let totalDocuments = $state(0);
    let shownDocuments = $state(0);

    $effect(() => {
        // Reset Filter Options on Tab Change
        currentTab;

        filterOptions.searchTerm = "";
        filterOptions.selections = {};
        totalDocuments = 0;
        shownDocuments = 0;
    });
</script>

<main class="a5e-cb">
    <header class="a5e-cb__header">
        <NavigationBar {currentTab} {tabs} onTabChange={updateCurrentTab} />

        <div class="a5e-cb__header-buttons">
            <input
                class="a5e-input a5e-input--slim a5e-cb__header-search-bar"
                type="text"
                bind:value={filterOptions.searchTerm}
                placeholder={game.i18n.localize("Search ...")}
            />

            <button
                class="a5e-button a5e-cb__header-button"
                aria-label={viewTab === "items"
                    ? "Open Filter Tab"
                    : "Close Filter Tab"}
                data-tooltip={viewTab === "items"
                    ? "Open Filter Tab"
                    : "Close Filter Tab"}
                data-tooltip-direction="UP"
                onclick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    viewTab = viewTab === "items" ? "filters" : "items";
                }}
            >
                <i class="a5e-compendia-header__button fa-solid fa-filter"></i>
            </button>
        </div>
    </header>

    <section class="a5e-cb__body">
        <div class="a5e-cb__body-content">
            {#if viewTab === "items"}
                <CompendiumItemList
                    compendiumType={currentTab.name}
                    {filterOptions}
                    bind:totalDocuments
                    bind:shownDocuments
                />
            {:else}
                <CompendiumFiltersTab
                    compendiumType={currentTab.name}
                    bind:filterOptions
                />
            {/if}
        </div>
    </section>

    <footer class="a5e-cb__footer">
        <span class="a5e-cb__footer-note">
            Showing {shownDocuments} of {totalDocuments} items
        </span>
    </footer>
</main>

<style lang="scss">
    .a5e-cb {
        display: grid;
        max-height: 80vh;
        overflow: hidden;

        &__header {
            &-buttons {
                display: flex;
                gap: 0.25rem;
            }

            &-button {
                width: fit-content;
                padding: 0.5rem;
            }
        }

        &__body {
            overflow-y: hidden;
        }

        &__footer {
            margin-top: 0.5rem;
            border-top: 1px solid var(--a5e-border-color);
            padding-top: 0.5rem;
            text-align: center;
        }
    }
</style>
