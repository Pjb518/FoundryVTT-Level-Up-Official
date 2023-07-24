<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import CustomTagGroup from "../components/CustomTagGroup.svelte";

    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const defaultLanguages = Object.entries(CONFIG.A5E.languages);
</script>

<article>
    <CustomTagGroup
        heading="A5E.Languages"
        options={defaultLanguages}
        selected={$actor.system.proficiencies.languages}
        on:updateSelection={(event) =>
            updateDocumentDataFromField(
                $actor,
                "system.proficiencies.languages",
                event.detail
            )}
    />
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
        overflow: auto;
        background: rgba(246, 242, 235, 0.5);
    }
</style>
