<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import FieldWrapper from "./FieldWrapper.svelte";

    export let uuids: string[] = [];
    export let embeddedData: any[] = [];
    export let type = "feature";

    const dispatch = createEventDispatcher();

    function onClick(idx: number) {
        if (type === "feature") {
            uuids = uuids.filter((_, i) => i !== idx);
            dispatch("updateSelection", uuids);
        }

        if (type === "item") {
            embeddedData = embeddedData.filter((_, i) => i !== idx);
            dispatch("updateSelection", embeddedData);
        }
    }

    function onUpdateQuantity(idx: number, value: number) {
        if (type === "item") {
            embeddedData[idx].quantityOverride = value;
            dispatch("updateSelection", embeddedData);

            embeddedData = embeddedData;
        }
    }

    function getDocuments(type: string) {
        if (type === "feature") {
            return uuids.map((uuid) => {
                const i = fromUuidSync(uuid);
                return [i.img, i.name];
            });
        }

        if (type === "item") {
            return embeddedData.map(({ uuid, quantityOverride }) => {
                const i = fromUuidSync(uuid);
                return [
                    i.img,
                    i.name,
                    quantityOverride || i.system.quantity || 1,
                ];
            });
        }

        return [];
    }

    // @ts-ignore
    $: documents = getDocuments(type, uuids, embeddedData);
</script>

<FieldWrapper --a5e-field-wrapper-direction="row">
    {#each documents as [img, name, quantity], idx}
        <div class="tag-wrapper">
            <img src={img} alt={name} class="tag-img" />

            <span class="tag-name">{name}</span>

            {#if type === "item"}
                <input
                    type="number"
                    class=" tag-count"
                    value={quantity}
                    on:change={({ target }) => {
                        // @ts-ignore
                        onUpdateQuantity(idx, target.value);
                    }}
                />
            {/if}

            <button
                class="tag-delete-button"
                on:click|preventDefault|stopPropagation={() => onClick(idx)}
            >
                <i class="fa-solid fa-x" />
            </button>
        </div>
    {/each}
</FieldWrapper>

<style lang="scss">
    .tag-wrapper {
        display: flex;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.05);
        gap: 0.5rem;
        padding: 0.25rem;
        border-radius: 4px;
    }

    .tag-img {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 4px;
    }

    .tag-count {
        width: 3rem;
        height: 1.25rem;
        padding-inline: 0.25rem;
        padding-block: 0rem;
        font-size: var(--a5e-text-size-xs);
        text-align: center;
    }

    .tag-delete-button {
        all: unset;
        cursor: pointer;
        font-size: 0.699rem;
    }
</style>
