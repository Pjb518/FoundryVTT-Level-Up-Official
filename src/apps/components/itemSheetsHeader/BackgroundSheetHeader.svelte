<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const item = getContext("item");
</script>

<header class="sheet-header">
    <img
        class="item-image"
        src={$item.img}
        alt={$item.name}
        title={$item.name}
    />

    <input
        type="text"
        name="name"
        value={$item.name}
        class="item-name"
        placeholder="Name"
        on:change={({ target }) =>
            updateDocumentDataFromField($item, target.name, target.value)}
    />
</header>

<style lang="scss">
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

    .item-name,
    .item-name[type="text"] {
        font-family: $font-primary;
        font-size: 1.728rem;
        border: 0;
        background: transparent;

        &:active,
        &:focus {
            box-shadow: none;
        }
    }
</style>
