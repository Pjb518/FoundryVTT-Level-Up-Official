<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import FieldWrapper from "./FieldWrapper.svelte";

    export let uuids: string[] = [];

    const dispatch = createEventDispatcher();

    function onClick(idx: number) {
        uuids = uuids.filter((_, i) => i !== idx);
        dispatch("updateSelection", uuids);
    }

    $: documents = uuids.map((uuid) => {
        const i = fromUuidSync(uuid);
        return [i.img, i.name];
    });
</script>

<FieldWrapper --a5e-field-wrapper-direction="row">
    {#each documents as [img, name], idx}
        <div class="tag-wrapper">
            <img src={img} alt={name} class="tag-img" />
            <span class="tag-name">{name}</span>
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
        gap: 0.5rem;
        padding: 0.25rem;
        border-radius: 4px;
        background: #ddd;
    }

    .tag-img {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 4px;
    }

    .tag-delete-button {
        all: unset;
        cursor: pointer;
        font-size: 0.699rem;
    }
</style>
