<script>
    import { getContext } from "svelte";

    import Editor from "../Editor.svelte";

    const item = getContext("item");
    $: content = $item.description;
</script>

<Editor document={item} {content} updatePath="system.description" />
