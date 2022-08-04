<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const item = getContext("item");
</script>

<header class="sheet-header">
    <img
        class="item-image"
        src={$item.img}
        alt={$item.name}
        title={$item.name}
    />

    <h2>{$item.name}</h2>
</header>

<style>
    .sheet-header {
        display: flex;
        padding: 0.5rem;
        border-bottom: 1px solid #ccc;
    }

    .item-image {
        width: 5rem;
        height: 5rem;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
