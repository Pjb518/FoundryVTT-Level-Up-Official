<script>
    import { createEventDispatcher } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    export let uuid;

    const dispatch = createEventDispatcher();
    const feature = new TJSDocument();

    feature.setFromUUID(uuid);
</script>

<div
    class="drop-area"
    on:drop|preventDefault|stopPropagation={(event) =>
        dispatch("item-dropped", [event, feature])}
>
    {#if $feature}
        <div class="feature-wrapper">
            <img
                class="feature-image"
                src={$feature.img}
                alt={$feature.name}
                title={$feature.name}
            />

            <h3>{$feature?.name}</h3>

            <i
                class="delete-button fas fa-trash"
                on:click={(event) => dispatch("item-deleted", [event, feature])}
            />
        </div>
    {:else}
        <i class="drop-icon fa-solid fa-plus" />
    {/if}
</div>

<style lang="scss">
    .delete-button {
        color: #8b2525;
        margin-inline: auto 0.5rem;
        padding: 0.25rem;
        cursor: pointer;
        transition: all 0.15s ease-in-out;

        &:hover {
            transform: scale(1.2);
        }
    }

    .drop-area {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 3.25rem;
        border-radius: 4px;
        border: 2px dashed #bbb;
        padding: 0.125rem;
        box-sizing: border-box;
    }

    .drop-icon {
        color: #888;
        font-size: 1.2rem;
    }

    .feature-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
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
