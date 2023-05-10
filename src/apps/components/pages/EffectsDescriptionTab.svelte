<script>
    import { getContext } from "svelte";

    import Editor from "../Editor.svelte";

    const effect = getContext("effect");
    $: content = $effect.flags?.a5e?.description ?? "";
</script>

<Editor document={effect} {content} updatePath="flags.a5e.description" />
