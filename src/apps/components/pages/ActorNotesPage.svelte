<script>
    import { getContext } from "svelte";

    import Editor from "../Editor.svelte";

    const actor = getContext("actor");
    $: content = $actor.system.details.notes;
</script>

<Editor document={actor} {content} updatePath="system.details.notes" />
