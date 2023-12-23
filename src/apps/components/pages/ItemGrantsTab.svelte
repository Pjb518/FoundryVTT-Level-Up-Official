<script lang="ts">
    import { getContext } from "svelte";
    import type { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store/fvtt/document";

    import ItemGrantManager from "../../../managers/ItemGrantsManager";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import ItemGrantListComponent from "../grants/ItemGrantListComponent.svelte";
    import NumericalGrantConfigDialog from "../grants/NumericalGrantConfigDialog.svelte";

    const item: TJSDocument = getContext("item");

    export const grantTypes = {
        ability: {
            heading: "A5E.grants.ability",
            singleLabel: "A5E.Ability",
            component: NumericalGrantConfigDialog,
        },
        skill: {
            heading: "A5E.grants.skill",
            singleLabel: "A5E.Skill",
            component: NumericalGrantConfigDialog,
        },
        movement: {
            heading: "A5E.grants.movement",
            singleLabel: "A5E.Movement",
            component: null,
        },
        proficiency: {
            heading: "A5E.grants.proficiency",
            singleLabel: "A5E.Proficiency",
            component: null,
        },
        trait: {
            heading: "A5E.grants.trait",
            singleLabel: "A5E.Trait",
            component: null,
        },
        vision: {
            heading: "A5E.grants.vision",
            singleLabel: "A5E.Vision",
            component: null,
        },
    };

    function addGrant(detail) {
        const data = {
            grantType: detail,
            level: 1,
            optional: false,
        };

        ItemGrantManager.addGrant($item, data);
    }

    let grants: ItemGrantManager = $item.grants;

    $: menuList = Object.entries(grantTypes).reduce(
        (acc: any[], [grantType, { singleLabel }]) => {
            acc.push([grantType, singleLabel]);
            return acc;
        },
        [],
    );
</script>

<article>
    <ul class="grant-list">
        {#each grants.entries() as [id, grant] (id)}
            <ItemGrantListComponent
                {grant}
                component={grantTypes[grant.grantType].component}
            />
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
