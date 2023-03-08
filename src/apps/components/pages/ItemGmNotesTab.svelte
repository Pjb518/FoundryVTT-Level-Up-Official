<script>
    import { getContext } from "svelte";

    import Editor from "../Editor.svelte";

    const item = getContext("item");
    $: content = $item.system.secretDescription;
</script>

<Editor document={item} {content} updatePath="system.secretDescription" />
