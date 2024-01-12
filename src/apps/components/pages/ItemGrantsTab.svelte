<script lang="ts">
    import { getContext } from "svelte";
    import type { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store/fvtt/document";

    import ItemGrantManager from "../../../managers/ItemGrantsManager";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import ItemGrantListComponent from "../grants/ItemGrantListComponent.svelte";

    const item: TJSDocument = getContext("item");

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

    // @ts-ignore
    $: menuList = Object.entries(CONFIG.A5E.itemGrants).reduce(
        (acc: any[], [grantType, label]) => {
            acc.push([grantType, label]);
            return acc;
        },
        [],
    );

    $: sheetIsLocked = !$item.isOwner ? true : false;
    $: grantTemplateConfiguration = getGrantTemplateConfiguration();
</script>

<article>
    <ul class="a5e-item-list">
        {#each grants.entries() as [id, grant] (id)}
            <ItemGrantListComponent
                {grant}
                --grantTemplateAreas={grantTemplateConfiguration.areas}
                --grantTemplateColumns={grantTemplateConfiguration.columns}
            />
        {/each}
    </ul>

    <div class="sticky-add-button">
        <CreateMenu
            {menuList}
            offset={{ x: -110, y: 115 }}
            documentName="Grant"
            on:press={({ detail }) => addGrant(detail)}
        />
    </div>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.75rem;
        overflow: hidden;
    }

    .sticky-add-button {
        position: relative;
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: #999;
    }
</style>
