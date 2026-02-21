<script lang="ts">
    import { fade } from "svelte/transition";

    import getDocumentSourceTooltip from "#utils/getDocumentSourceTooltip.ts";

    type Props = {
        compendiumType: string;
        documents: any[];
        enableGrouping: boolean;
    };

    function getObjectDetailsLabel(item) {
        const attunement = item.system.requiresAttunement
            ? "Requires Attunement"
            : null;

        const { price } = item.system;
        const rarity = (() => {
            const itemRarity = CONFIG.A5E.itemRarity;
            if (!item.system.rarity || item.system.rarity === "mundane")
                return null;
            return itemRarity[item.system.rarity] ?? item.system.rarity;
        })();

        if (rarity) {
            if (price && attunement)
                return `${rarity} (${attunement}; Cost ${price})`;
            if (price) return `${rarity} (Cost ${price})`;
            if (attunement) return `${rarity} (${attunement})`;

            return rarity;
        }

        if (price && attunement) return `${attunement}; Cost ${price}`;
        if (price) return `Cost ${price}`;
        if (attunement) return attunement;

        return null;
    }

    function getSource(item: any) {
        if (typeof item.system.source !== "string") return null;
        const source = CONFIG.A5E.products[item.system.source];
        return source || null;
    }

    function setupGrouping() {}

    let { compendiumType, documents, enableGrouping }: Props = $props();

    const groups = {
        object: "rarity",
        maneuver: "degree",
        monster: "details.cr",
        spell: "level",
    };

    const groupFilterBy = {
        object: [
            "mundane",
            "common",
            "uncommon",
            "rare",
            "very rare",
            "legendary",
            "artifact",
        ],
        maneuver: [0, 1, 2, 3, 4, 5],
        monster: [
            0,
            0.125,
            0.25,
            0.5,
            ...Array.from(Array(30).keys(), (n) => n + 1),
        ],
        spell: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    };
</script>

{#snippet ObjectItem(doc: any)}
    {@const objectSource = getSource(doc)}
    {@const objectDetails = getObjectDetailsLabel(doc)}

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

<ul class="a5e-item list a5e-item-list--compendium" transition:fade>
    {#each documents as doc}
        {@render ObjectItem(doc)}
    {/each}
</ul>
