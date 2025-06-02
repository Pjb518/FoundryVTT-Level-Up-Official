<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { ItemGrantsManager } from "#managers/ItemGrantsManager.ts";

    import ItemGrantList from "../../components/item/ItemGrantList.svelte";
    import Section from "#view/snippets/Section.svelte";

    function addGrant(detail: string) {
        const data = {
            grantType: detail,
            optional: false,
        };

        ItemGrantsManager.addGrant(item, data);
    }

    function getGrantTemplateConfiguration() {
        let areas = "icon name indicators";
        let columns = "min-content 1fr min-content";

        if (item.documentName === "Item" || !sheetIsLocked) {
            areas += " menu";
            columns += " 2rem";
        }

        return { areas: `"${areas}"`, columns };
    }

    let item: any = getContext("item");
    const itemGrantTypes = CONFIG.A5E.itemGrants;

    let grants = $derived(item.reactive.grants) as ItemGrantsManager;

    let sheetIsLocked = !item.isOwner;
    let grantTemplateConfiguration = $derived(getGrantTemplateConfiguration());
</script>

<div class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <ul class="grant-config-list">
        {#each Object.keys(itemGrantTypes) as grantType (grantType)}
            {#if grants.byType(grantType).length}
                <li class="grant-config-list__item">
                    <Section
                        heading={`A5E.grants.headingsPlural.${grantType}`}
                        headerButtons={[
                            {
                                classes: "add-button",
                                handler: () => addGrant(grantType),
                                label: localize("A5E.ButtonAddGrant", {
                                    type: localize(
                                        `A5E.grants.headings.${grantType}`,
                                    ),
                                }),
                            },
                        ]}
                    />

                    <ul class="a5e-item-list">
                        {#each grants.byType(grantType) as grant (grant._id)}
                            <ItemGrantList
                                {grant}
                                --grantTemplateAreas={grantTemplateConfiguration.areas}
                                --grantTemplateColumns={grantTemplateConfiguration.columns}
                            />
                        {/each}
                    </ul>
                </li>
            {/if}
        {/each}
    </ul>
</div>

<style lang="scss">
    .grant-config-list {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 0.75rem;
        list-style: none;
        margin: 0;
        margin-right: -0.375rem;
        padding: 0;
        padding-right: 0.375rem;
        overflow-y: auto;

        &__item {
            display: flex;
            flex-direction: column;
            // gap: 0.5rem;
        }
    }
</style>
