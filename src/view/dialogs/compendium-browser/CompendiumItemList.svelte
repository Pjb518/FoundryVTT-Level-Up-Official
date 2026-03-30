<script lang="ts">
    import { fade } from "svelte/transition";

    import getDocumentSourceTooltip from "#utils/getDocumentSourceTooltip.ts";
    import { getDetailsLabel } from "./utils/getDetailsLabel.ts";
    import { getSource } from "./utils/getSource.ts";
    import { constructFilters } from "./utils/constructFilters.ts";
    import { localize } from "#utils/localization/localize.ts";

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
                // Check perms for pack
                if (!pack.visible) return docs;

                // Get docs
                const filtered = pack.index.filter((doc) => {
                    if (doc.type !== compendiumType) return false;

                    const searchTerm = filterOptions.searchTerm.toLowerCase();

                    const nameMatch = doc.name
                        .toLowerCase()
                        .includes(searchTerm);

                    if (filterOptions.searchDescription) {
                        const description = (
                            doc.system?.description ?? ""
                        ).toLowerCase();

                        const containsDescription =
                            description.includes(searchTerm);

                        if (nameMatch || containsDescription) return true;
                        else return false;
                    }

                    return nameMatch;
                });

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
        {@const itemSource = getSource(doc)}
        {@const itemDetails = getDetailsLabel(doc)}

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

                {#if doc.type === "object" && doc.system?.requiresAttunement}
                    <i
                        class="a5e-item__icon icon fa-solid fa-link"
                        data-tooltip="Requires Attunement"
                        data-tooltip-direction="UP"
                    ></i>
                {/if}

                {#if doc.type === "spell" && doc.system?.rare}
                    <i
                        class="a5e-item__icon icon fa-solid fa-sun"
                        data-tooltip="Rare Spell Variant"
                        data-tooltip-direction="UP"
                    ></i>
                {/if}
            </h3>

            <span class="a5e-item__details">
                {#if itemSource?.abbreviation}
                    <a
                        class="a5e-item__source-tag"
                        href={itemSource?.url}
                        target="_blank"
                        data-tooltip={getDocumentSourceTooltip(itemSource)}
                        data-tooltip-class="a5e-tooltip a5e-tooltip--dark a5e-tooltip--document-source"
                        onclick={(e) => e.stopPropagation()}
                    >
                        {itemSource?.abbreviation}
                    </a>
                {/if}

                {itemDetails}
            </span>

            <!-- Spell Components -->
            {#if doc.type === "spell"}
                <ul class="component-wrapper">
                    {#if doc.system.components.vocalized}
                        <span
                            class="component"
                            data-tooltip="A5E.spells.components.vocalized"
                            data-tooltip-direction="UP"
                        >
                            {localize("A5E.spells.components.vocalizedAbbr")}
                        </span>
                    {/if}

                    {#if doc.system.components.seen}
                        <span
                            class="component"
                            data-tooltip="A5E.spells.components.seen"
                            data-tooltip-direction="UP"
                        >
                            {localize("A5E.spells.components.seenAbbr")}
                        </span>
                    {/if}

                    {#if doc.system.components.material}
                        <span
                            class="component"
                            data-tooltip="A5E.spells.components.material"
                            data-tooltip-direction="UP"
                        >
                            {localize("A5E.spells.components.materialAbbr")}
                        </span>
                    {/if}

                    {#if doc.system.concentration}
                        <span
                            class="component"
                            data-tooltip="A5E.SpellConcentration"
                            data-tooltip-direction="UP"
                        >
                            {localize("A5E.spells.concentrationAbbr")}
                        </span>
                    {/if}

                    {#if doc.system.ritual}
                        <span
                            class="component"
                            data-tooltip="A5E.spells.ritual"
                            data-tooltip-direction="UP"
                        >
                            {localize("A5E.spells.ritualAbbr")}
                        </span>
                    {/if}
                </ul>
            {/if}

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

    .component {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1rem;
        width: 1rem;
        border-radius: var(--a5e-border-radius-standard);
        font-size: var(--a5e-xxs-text);
        background: var(--a5e-border-color);
    }

    .component-wrapper {
        display: flex;
        justify-content: flex-end;
        gap: 0.25rem;
        grid-area: components;
        margin: 0 0.25rem;
        padding: 0;
        font-family: var(--a5e-primary-font);
        list-style: none;
    }
</style>
