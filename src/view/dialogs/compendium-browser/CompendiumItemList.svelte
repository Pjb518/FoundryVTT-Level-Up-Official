<script lang="ts">
    import { fade } from "svelte/transition";

    import getDocumentSourceTooltip from "#utils/getDocumentSourceTooltip.ts";
    import { getDetailsLabel } from "./utils/getDetailsLabel.ts";
    import { getSource } from "./utils/getSource.ts";
    import { constructFilters } from "./utils/constructFilters.ts";

    type Props = {
        compendiumType: string;
        enableGrouping: boolean;
        filterOptions: Record<string, any>;
    };

    function getDocuments() {
        const docs: any[] = packs
            .reduce((docs, pack) => {
                const filtered = pack.index.filter(
                    (doc) =>
                        doc.type === compendiumType &&
                        doc.name
                            .toLowerCase()
                            .includes(filterOptions.searchTerm.toLowerCase()),
                );

                if (filtered.length) docs.push(filtered);
                return docs;
            }, [])
            .flat()
            .filter((doc) => {
                return filters.every((filter) => filter(doc));
            })
            .sort((a, b) => a.name.localeCompare(b.name));

        return docs;
    }

    let { compendiumType, enableGrouping, filterOptions }: Props = $props();

    const packs = [...game.packs.values()];

    let visibleDocumentCount = $state(100);
    let { filters, filterCount } = $derived(
        constructFilters(filterOptions.selections, compendiumType),
    );
    $inspect(filters);
    let documents = $derived(getDocuments());
</script>

{#snippet ObjectItem(doc: any)}
    {@const objectSource = getSource(doc)}
    {@const objectDetails = getDetailsLabel(doc)}

    <li class="a5e-item a5e-item--compendium-document" draggable="true">
        <img
            class="a5e-item__image a5e-item__image--compendium-document"
            src={doc.img}
            alt={doc.nam}
        />

        <h3 class="a5e-item__name a5e-item__name--compendium-document">
            {doc.name}

            {#if doc.system?.requiresAttunement}
                <i
                    class="a5e-item__icon icon fa-solid fa-link"
                    data-tooltip="Requires Attunement"
                    data-tooltip-direction="UP"
                ></i>
            {/if}
        </h3>

        <span class="a5e-item__details">
            {#if objectSource?.abbreviation}
                <a
                    class="a5e-item__source-tag"
                    href={objectSource?.url}
                    target="_blank"
                    data-tooltip={getDocumentSourceTooltip(objectSource)}
                    data-tooltip-class="a5e-tooltip a5e-tooltip--dark a5e-tooltip--document-source"
                    onclick={(e) => e.stopPropagation()}
                >
                    {objectSource?.abbreviation}
                </a>
            {/if}

            {objectDetails}
        </span>
    </li>
{/snippet}

<ul
    class="a5e-item-list a5e-item-list--compendium"
    transition:fade
    onscroll={({ target }) => {
        const scrollPercent =
            (target.scrollTop / (target.scrollHeight - target.clientHeight)) *
            100;

        if (scrollPercent > 80) visibleDocumentCount += 50;
    }}
>
    {#each documents.slice(0, visibleDocumentCount) as doc}
        {@render ObjectItem(doc)}
    {/each}
</ul>

<style lang="scss">
    .a5e-item-list--compendium {
        max-height: 70vh;
        overflow-y: auto;
    }
</style>
