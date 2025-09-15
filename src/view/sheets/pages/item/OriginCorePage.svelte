<script lang="ts">
    import { getContext } from "svelte";

    import Editor from "#view/components/Editor.svelte";

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);
</script>

<section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    {#key itemStore.description}
        <Editor
            content={itemStore.description}
            document={item}
            documentUuid={item.uuid}
            field="system.description"
            manageSecrets={item.isOwner}
        />
    {/key}
</section>
