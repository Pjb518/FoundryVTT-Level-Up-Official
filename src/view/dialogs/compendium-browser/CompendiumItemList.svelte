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
        totalDocuments: number;
        shownDocuments: number;
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

    function getTotalDocuments() {
        return packs.reduce((total, pack) => {
            const count = pack.index.filter(
                (doc) => doc.type === compendiumType,
            ).length;
            return total + count;
        }, 0);
    }

    async function importDocument(e, doc) {
        e.preventDefault();
        e.stopPropagation();

        const d = await fromUuid(doc.uuid);
        if (!d) return;

        const { collection } = d;

        const isOwner =
            collection.testUserPermission(
                game.user,
                CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
            ) || game.user!.isGM;

        if (!isOwner) {
            ui.notifications.warn(
                `You do not have permission to import this ${compendiumType}.`,
            );
            return;
        }

        return game.collections
            .get(collection.documentName)
            ?.importFromCompendium(collection, doc._id);
    }

    function onDragStart(event, doc) {
        const { uuid, documentType } = foundry.utils.parseUuid(doc.uuid);

        const data = {
            type: documentType,
            uuid: uuid,
        };

        return event.dataTransfer.setData("text/plain", JSON.stringify(data));
    }

    let {
        compendiumType,
        enableGrouping,
        filterOptions,
        shownDocuments = $bindable(),
        totalDocuments = $bindable(),
    }: Props = $props();

    const packs = [...game.packs.values()];

    let visibleDocumentCount = $state(100);
    let { filters, filterCount } = $derived(
        constructFilters(filterOptions.selections, compendiumType),
    );
    let documents = $derived(getDocuments());

    $effect(() => {
        documents;

        totalDocuments = getTotalDocuments();
        shownDocuments = documents.length;
    });
</script>

{#snippet ObjectItem(doc: any)}
    {@const objectSource = getSource(doc)}
    {@const objectDetails = getDetailsLabel(doc)}

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <li
        class="a5e-item a5e-item--compendium-document"
        draggable="true"
        onclick={async () => {
            const d = (await fromUuid(doc.uuid)) as any;
            if (!d) return;
            d.sheet.render(true);
        }}
        ondragstart={(e) => onDragStart(e, doc)}
    >
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

        <button
            class="a5e-compendium-import-button icon fa-solid fa-download"
            data-tooltip={`Import ${doc.name}`}
            data-tooltip-direction="UP"
            aria-label={`Import ${doc.name}`}
            onclick={async (e) => {
                importDocument(e, doc);
            }}
        ></button>
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
        padding-top: 0.5rem;
    }

    .a5e-compendium-import-button {
        grid-area: import;
        margin: 0;
        padding: 0.25rem;
        color: var(--a5e-button-gray);
        background: transparent;
        border: 0;
        transition: var(--a5e-transition-standard);

        &:hover {
            color: var(--a5e-color-text-dark);
            transform: scale(1.2);
            box-shadow: none;
        }
    }
</style>
