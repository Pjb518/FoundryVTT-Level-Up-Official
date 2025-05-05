<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import ItemList from "./ItemList.svelte";
    import ItemListSpellSlots from "./ItemListSpellSlots.svelte";

    type Props = {
        icon?: string;
        label: string;
        level?: number;
        items: Item[];
        showArtifactCharges?: boolean;
        showDescription?: boolean;
        showQuantity?: boolean;
        showSpellPoints?: boolean;
        showSpellSlots?: boolean;
        showUses?: boolean;
        type: string;
    };

    let {
        icon = null,
        label,
        level = 0,
        items,
        showArtifactCharges = false,
        showDescription = false,
        showQuantity = false,
        showSpellPoints = false,
        showSpellSlots = false,
        showUses = false,
        type,
    } = $props();

    function getHeadingTemplateConfiguration() {
        let areas = "name";
        let columns = "1fr";

        if (showUses) {
            if (showQuantity) {
                areas = "name quantity uses";
                columns = "1fr 4rem 6.25rem";
            } else {
                areas = "name uses";
                columns = "1fr 6.25rem";
            }
        } else if (showQuantity) {
            areas = "name quantity";
            columns = "1fr 4rem";
        }

        areas += " menu";
        columns += " 2rem";

        return { areas: `"${areas}"`, columns };
    }

    function getItemTemplateConfiguration() {
        let areas = "icon name indicators";
        let columns = "min-content 1fr min-content";

        if (showUses) {
            if (showQuantity) {
                areas = "icon name indicators quantity uses";
                columns = "min-content 1fr min-content 4rem 6.25rem";
            } else {
                areas = "icon name indicators uses";
                columns = "min-content 1fr min-content 6.25rem";
            }
        } else if (showQuantity) {
            areas = "icon name indicators quantity";
            columns = "min-content 1fr min-content 4rem";
        }

        areas += " menu";
        columns += " 2rem";

        return { areas: `"${areas}"`, columns };
    }

    let actor: any = getContext("actor");
    let sheet: any = getContext("sheet");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    const { A5E } = CONFIG;

    let actorStore = $derived(actor.reactive.system);

    let headingTemplateConfiguration = $derived(
        getHeadingTemplateConfiguration(),
    );
    let itemTemplateConfiguration = $derived(getItemTemplateConfiguration());
</script>

<section class="category-container">
    {#if !(type === "featureTypes" && actor.type === "npc")}
        <header
            class="a5e-section-header a5e-section-header--item-list"
            class:a5e-section-header--flat-bottom={[...items].length}
            style="
                --a5e-section-heading-template-areas: {headingTemplateConfiguration.areas};
                --a5e-section-heading-template-columns: {headingTemplateConfiguration.columns};
            "
        >
            <h3
                class="a5e-section-header__heading a5e-section-header__heading--name"
            >
                <div>
                    {#if icon}
                        <i class={icon}></i>
                    {/if}

                    {#if type === "favorites"}
                        {localize(label)}
                    {:else}
                        {localize((A5E[type] ?? {})[label] ?? label)}
                    {/if}
                </div>

                {#if type === "spellLevels" && showSpellSlots}
                    <ItemListSpellSlots {level} />
                {/if}

                {#if type === "spellLevels" && showArtifactCharges}
                    {localize("A5E.ArtifactChargesCost", {
                        cost: A5E.WIELDER_ARTIFACT_CHARGES[level]?.charges ?? 0,
                    })}
                {/if}

                <!-- {#if type === "spellLevels" && showSpellInventions}
                    {localize("A5E.SpellInventionsCost", {
                        cost: 1,
                    })}
                {/if} -->

                {#if type === "spellLevels" && showSpellPoints}
                    {localize("A5E.SpellPointsCost", {
                        cost: A5E.spellLevelCost[level],
                    })}
                {/if}
            </h3>

            {#if showQuantity}
                <h3
                    class="a5e-section-header__heading a5e-section-header__heading--center a5e-section-header__heading--quantity"
                >
                    Quantity
                </h3>
            {/if}

            {#if showUses}
                <h3
                    class="a5e-section-header__heading a5e-section-header__heading--center a5e-section-header__heading--uses"
                >
                    Uses
                </h3>
            {/if}
        </header>
    {/if}

    <ul class="a5e-item-list">
        {#each [...items] as item (item?.id)}
            <ItemList
                {item}
                {showDescription}
                --itemTemplateAreas={itemTemplateConfiguration.areas}
                --itemTemplateColumns={itemTemplateConfiguration.columns}
                on:dropObject={({ detail }) => onDropObject(detail, [...items])}
            />
        {/each}
    </ul>
</section>

<style lang="scss">
    .a5e-section-header__heading {
        &--name {
            display: grid;
            align-items: center;
            grid-template-columns:
                minmax(3.5rem, max-content)
                max-content max-content;
            gap: 0.75rem;
            grid-area: name;
            text-align: left;
        }

        &--quantity {
            grid-area: quantity;
        }

        &--uses {
            grid-area: uses;
        }
    }
</style>
