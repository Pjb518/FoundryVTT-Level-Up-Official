<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import arraysAreEqual from "#utils/arraysAreEqual.ts";

    import Menu from "#view/snippets/Menu.svelte";
    import MultiStateCheckBoxGroup from "#view/snippets/MultiStateCheckBoxGroup.svelte";

    type Props = {
        page: string;
        subPage?: string;
    };

    function toggleAll(filters) {
        filters = Object.keys(filters);
        const sectionFilters = activeFilters?.inclusive?.filter((f) =>
            filters.includes(f),
        );

        if (arraysAreEqual(sectionFilters, filters)) {
            const inclusiveFilters = activeFilters?.inclusive?.filter(
                (f) => !filters.includes(f),
            );
            return onUpdateFilters([inclusiveFilters, []]);
        }

        const inclusiveFilters = new Set([
            ...filters,
            ...activeFilters.inclusive,
        ]);

        return onUpdateFilters([[...inclusiveFilters], []]);
    }

    function onUpdateFilters(values: [string[], string[]]) {
        const [inclusiveFilters, exclusiveFilters] = values;

        actor.setFlag("a5e", flagId, {
            inclusive: inclusiveFilters,
            exclusive: exclusiveFilters,
        });
    }

    let { page, subPage = "" }: Props = $props();
    let actor: Actor = getContext("actor");

    const filterSections: any[] = Object.values(CONFIG.A5E.filters[page] ?? {});
    const flagId = subPage.length
        ? `filters.${page}.${subPage}`
        : `filters.${page}`;

    let activeFilters = $derived(
        actor.reactive.getFlag("a5e", flagId) ?? {
            inclusive: [],
            exclusive: [],
        },
    );

    let filtersActive = $derived(
        activeFilters.inclusive.length || activeFilters.exclusive.length,
    );
</script>

<Menu
    buttonIcon="fa-solid fa-filter"
    menuPosition={{ x: -550, y: -180 }}
    --a5e-context-menu-width="500px"
    --a5e-context-menu-icon-color={filtersActive
        ? "var(--a5e-color-primary)"
        : "inherit"}
>
    <article class="a5e-actor-filter">
        {#each filterSections as { label, filters }}
            <section class="a5e-actor-filter__section">
                <header class="a5e-actor-filter__header">
                    <h3 class="a5e-actor-filter__title">
                        {localize(label)}
                    </h3>

                    <button
                        class="a5e-button a5e-button--transparent a5e-actor-filter__toggle-all"
                        onpointerdown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            toggleAll(filters);
                        }}
                    >
                        {localize("A5E.buttons.toggleAll")}
                    </button>
                </header>

                <div class="a5e-actor-filter__filters">
                    <MultiStateCheckBoxGroup
                        options={Object.entries(filters).map(
                            ([value, { label }]) => [value, label],
                        )}
                        selected={[
                            activeFilters.inclusive ?? [],
                            activeFilters.exclusive ?? [],
                        ]}
                        onUpdateSelection={(values) => onUpdateFilters(values)}
                    />
                </div>
            </section>
        {/each}
    </article>
</Menu>

<style lang="scss">
    .a5e-actor-filter {
        position: relative;
        overflow: auto;
        color: var(--a5e-text-color-white);
        font-size: var(--a5e-sm-text);
        width: 400px;
        border-radius: 4px;

        &__section {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            padding: 0.5rem;
            color: var(--a5e-text-color-white);
        }

        &__header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        &__toggle-all {
            font-size: var(--a5e-xs-text);

            &:hover {
                color: var(--a5e-text-color-white);
                transform: scale(1);
            }
        }

        &__title {
            font-size: var(--a5e-sm-text);
            color: var(--a5e-text-color-white);
            margin: 0;
        }

        &__filters {
            --a5e-tag-color: var(--a5e-text-color-white);
            --a5e-tag-color-hover: var(--a5e-text-color-white);

            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
        }
    }
</style>
