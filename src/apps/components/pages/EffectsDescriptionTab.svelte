<script>
    import { getContext } from "svelte";

    import Editor from "../Editor.svelte";

    const effect = getContext("effect");
    $: content = $effect.description ?? "";
</script>

<Editor document={effect} {content} updatePath="description" />
