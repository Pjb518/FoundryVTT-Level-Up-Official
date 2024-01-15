<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import type { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store/fvtt/document";

    import ItemGrantManager from "../../../managers/ItemGrantsManager";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import ItemGrantListComponent from "../grants/ItemGrantListComponent.svelte";
    import Section from "../Section.svelte";

    const item: TJSDocument = getContext("item");
    // @ts-ignore
    const itemGrantTypes = CONFIG.A5E.itemGrants;

    function getGrantTemplateConfiguration() {
        let areas = "icon name indicators";
        let columns = "min-content 1fr min-content";

        if ($item.documentName === "Item" || !sheetIsLocked) {
            areas += " menu";
            columns += " 2rem";
        }

        return { areas: `"${areas}"`, columns };
    }

    function addGrant(detail: string) {
        const data = {
            grantType: detail,
            optional: false,
        };

        ItemGrantManager.addGrant($item, data);
    }

    $: grants = $item.grants as ItemGrantManager;

    $: menuList = Object.entries(itemGrantTypes).reduce(
        (acc: any[], [grantType, label]) => {
            acc.push([grantType, label]);
            return acc;
        },
        [],
    );

    $: sheetIsLocked = !$item.isOwner ? true : false;
    $: grantTemplateConfiguration = getGrantTemplateConfiguration();
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
                            <ItemGrantListComponent
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

<div class="sticky-add-button">
    <CreateMenu
        {menuList}
        offset={{ x: -115, y: -110 }}
        documentName="Grant"
        on:press={({ detail }) => addGrant(detail)}
    />
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
    .sticky-add-button {
        position: relative;
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: #999;
    }
</style>
