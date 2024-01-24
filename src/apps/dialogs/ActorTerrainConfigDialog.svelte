<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import CustomTagGroup from "../components/CustomTagGroup.svelte";

    export let { document, appId } = getContext("#external").application;

    const actor = document;
    const defaultTerrains = Object.entries(CONFIG.A5E.terrainTypes);
</script>

<article>
    <CustomTagGroup
        heading="A5E.Languages"
        options={defaultTerrains}
        selected={$actor.system.details.terrain}
        on:updateSelection={(event) =>
            updateDocumentDataFromField(
                $actor,
                "system.details.terrain",
                event.detail,
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
        background: $color-sheet-background;
    }
</style>
