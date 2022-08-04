<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    export let updatePath;

    const item = getContext("item");
    const feature = new TJSDocument();
    feature.setFromUUID($item.system.features[updatePath]);

    function onDrop(event) {
        try {
            const { uuid } = JSON.parse(
                event.dataTransfer.getData("text/plain")
            );

            $item.update({ [`system.features.${updatePath}`]: uuid });
            feature.setFromUUID(uuid);
        } catch (err) {
            console.error(err);
        }
    }

    function onDelete() {
        try {
            $item.update({ [`system.features.${updatePath}`]: "" });
            feature.set();
        } catch (err) {
            console.error(err);
        }
    }
</script>

<div class="drop-area" on:drop|preventDefault|stopPropagation={onDrop}>
    {#if $feature}
        <div class="feature-wrapper">
            <img
                class="feature-image"
                src={$feature.img}
                alt={$feature.name}
                title={$feature.name}
            />

            <h3>{$feature?.name}</h3>

            <i class="delete-button fas fa-trash" on:click={onDelete} />
        </div>
    {/if}
</div>

<style lang="scss">
    .delete-button {
        color: #8b2525;
        margin-left: auto;
        margin-right: 0.5rem;
        padding: 0.25rem;
        cursor: pointer;
        transition: all 0.15s ease-in-out;

        &:hover {
            transform: scale(1.2);
        }
    }

    .drop-area {
        min-height: 3.25rem;
        background: #bbb;
        border-radius: 4px;
        border: 1px solid #bbb;
        padding: 0.25rem;
    }

    .feature-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem;
        font-size: 0.833rem;
        background: #f6f2eb;
        box-shadow: 0 0 5px #ccc inset;
        border-radius: 3px;
        border: 1px solid #ccc;
    }

    .feature-image {
        height: 2rem;
        width: 2rem;
        border-radius: 3px;
    }
</style>
