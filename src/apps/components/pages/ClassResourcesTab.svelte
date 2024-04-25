<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";

    const item = getContext("item");
    const resourceTypes = {
        number: { heading: "Number", singleLabel: "", component: null },
        dice: { heading: "Dice", component: null },
        string: { heading: "String", component: null },
    };

    $: menuList = [
        ["number", "Number"],
        ["dice", "Dice"],
        ["string", "String"],
    ];

    $: resources = $item.resources;
</script>

<div class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <ul class="resource-config-list"></ul>
</div>
