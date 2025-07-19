<script lang="ts">
    import { getContext } from "svelte";

    import Section from "#view/snippets/Section.svelte";
    import CodeEditor from "#view/components/CodeEditor.svelte";

    let item: any = getContext("item");
    let actionId: string | null = getContext("actionId");

    let field = actionId ? `actions.${actionId}.macro` : "macro";
    let content = $derived(
        foundry.utils.getProperty(item.reactive.system, field),
    );
</script>

{#key field}
    <CodeEditor document={item} {field} {content}></CodeEditor>
{/key}
