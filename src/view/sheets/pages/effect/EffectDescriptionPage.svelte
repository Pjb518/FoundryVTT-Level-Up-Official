<script lang="ts">
    import { getContext } from "svelte";

    import Editor from "#view/components/Editor.svelte";

    let effect: any = getContext("effect");
</script>

{#key effect.reactive.description}
    <Editor
        content={effect.reactive.description}
        document={effect}
        documentUuid={effect.uuid}
        field="description"
        manageSecrets={effect.isOwner}
    />
{/key}
