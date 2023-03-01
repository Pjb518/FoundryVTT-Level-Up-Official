<script>
    import { getContext } from "svelte";

    import Editor from "../Editor.svelte";

    const item = getContext("item");
    const actionId = getContext("actionId");

    $: content = $item.system.actions[actionId]?.description;
</script>

<Editor
    document={item}
    {content}
    updatePath={`system.actions.${actionId}.description`}
/>
