<script lang="ts">
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    type Props = {
        uuids?: string[];
        embeddedData?: any[];
        type: string;
        onUpdateSelection: (values: any[]) => void;
    };

    function onClick(idx: number) {
        if (type === "feature") {
            uuids = uuids.filter((_, i) => i !== idx);
            onUpdateSelection(uuids);
        }

        if (type === "item") {
            embeddedData = embeddedData.filter((_, i) => i !== idx);
            onUpdateSelection(embeddedData);
        }
    }

    function onUpdateQuantity(idx: number, value: number | string) {
        if (type === "item") {
            embeddedData[idx].quantityOverride = value;
            onUpdateSelection(embeddedData);

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
                    i.reactive.img,
                    i.reactive.name,
                    quantityOverride || i.reactive.system.quantity || 1,
                ];
            });
        }

        return [];
    }

    let {
        uuids = [],
        embeddedData = [],
        type = "feature",
        onUpdateSelection,
    }: Props = $props();

    let documents = $derived(getDocuments(type));
</script>

<FieldWrapper --a5e-field-wrapper-direction="row">
    {#each documents as [img, name, quantity], idx}
        <div class="a5e-tag-wrapper">
            <img src={img} alt={name} class="tag-img" />

            <span class="a5e-tag-name">{name}</span>

            {#if type === "item"}
                <input
                    class="a5e-input a5e-input--slime a5e-input--small a5e-tag-count"
                    type="number"
                    value={quantity}
                    onchange={({ currentTarget }) => {
                        onUpdateQuantity(idx, currentTarget.value);
                    }}
                />
            {/if}

            <button
                class="a5e-button a5e-tag-delete-button"
                aria-label="Delete Item"
                onclick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClick(idx);
                }}
            >
                <i class="icon fa-solid fa-x"></i>
            </button>
        </div>
    {/each}
</FieldWrapper>

<style lang="scss">
    .a5e-tag-wrapper {
        display: flex;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.05);
        gap: 0.5rem;
        padding: 0.25rem;
        border-radius: 4px;
    }

    .a5e-tag-img {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 4px;
    }

    .a5e-tag-count {
        width: 3rem;
        height: 1.25rem;
        padding-inline: 0.25rem;
        padding-block: 0rem;
        font-size: var(--a5e-xs-text);
        text-align: center;
    }

    .a5e-tag-delete-button {
        all: unset;
        cursor: pointer;
        font-size: 0.699rem;
    }
</style>
