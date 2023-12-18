<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import Editor from "../components/Editor.svelte";
    import FormSection from "../components/FormSection.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { actorDocument, updatePath } =
        getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
</script>

<article>
    <FormSection
        --background="transparent"
        --padding="0"
        --margin="0 0 0.25rem 0"
    >
        <input
            type="text"
            value={getProperty($actor, `${updatePath}.title`)}
            placeholder="Note Name"
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $actor,
                    `${updatePath}.title`,
                    target.value,
                )}
        />
    </FormSection>

    <section class="editor-wrapper">
        <Editor
            document={actor}
            content={getProperty($actor, `${updatePath}.content`)}
            updatePath={`${updatePath}.content`}
        ></Editor>
    </section>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        height: 100%;
        min-height: 10rem;
        padding: 0.75rem;
        gap: 0.5rem;
        overflow: auto;
        background: $color-sheet-background;
    }

    .editor-wrapper {
        height: 15rem;
    }
</style>
