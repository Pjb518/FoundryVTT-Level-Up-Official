<script>
    import { getContext } from "svelte";

    import { grantTypes } from "../../../config/registerGrantsConfig";
    import ItemGrantManager from "../../../managers/ItemGrantsManager";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import ItemGrantListComponent from "../grants/ItemGrantListComponent.svelte";

    const item = getContext("item");

    function addGrant(detail) {
        const data = {
            grantType: detail,
            level: 1,
            optional: false,
        };

        ItemGrantManager.addGrant($item, data);
    }

    let grants = $item.grants;

    $: menuList = Object.entries(grantTypes).reduce(
        (acc, [grantType, { singleLabel }]) => {
            acc.push([grantType, singleLabel]);
            return acc;
        },
        [],
    );
</script>

<article>
    <ul class="grant-list">
        {#each grants.entries() as [id, grant] (id)}
            <ItemGrantListComponent {grant} />
        {/each}
    </ul>

    <div class="sticky-add-button">
        <CreateMenu
            {menuList}
            offset={{ x: -110, y: +5 }}
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

    .grant-list {
        display: flex;
        flex-direction: column;
        position: relative;
        margin: 0;
        padding: 0;
        gap: 0.25rem;
        list-style: none;
    }

    .sticky-add-button {
        position: relative;
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: #999;
    }
</style>
