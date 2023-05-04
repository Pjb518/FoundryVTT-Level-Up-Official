<script>
    import { getContext } from "svelte";

    import editDocumentImage from "../handlers/editDocumentImage";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const effect = getContext("effect");

    const appId = getContext("appId");
</script>

<header class="sheet-header">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <img
        class="effect-image"
        src={$effect.icon}
        alt={$effect.name}
        on:click={() => editDocumentImage($effect, { type: "effect" })}
    />

    <div class="name__wrapper">
        <input
            type="text"
            class="effect-name"
            name="label"
            value={$effect.label}
            placeholder="A5E.Name"
            on:change={({ target }) =>
                updateDocumentDataFromField($effect, target.name, target.value)}
        />
    </div>
</header>

<style lang="scss">
    .sheet-header {
        display: flex;
        align-items: center;
    }

    .effect-image {
        width: 3rem;
        height: 3rem;
        border-radius: 4px;
        cursor: pointer;
    }

    .name__wrapper {
        width: 100%;
    }

    .effect-name,
    .effect-name[type="text"] {
        font-family: "Modesto Condensed", serif;
        font-size: 1.728rem;
        border: 0;
        background: transparent;
        text-overflow: ellipsis;

        &:active,
        &:focus {
            box-shadow: none;
        }
    }
</style>
