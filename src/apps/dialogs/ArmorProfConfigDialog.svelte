<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import CustomTagGroup from "../components/CustomTagGroup.svelte";

    export let { document, appId } = getContext("#external").application;

    const actor = new TJSDocument(document);
    const defaultProficiencies = Object.entries(CONFIG.A5E.armorPlural);
</script>

<article>
    <CustomTagGroup
        heading="A5E.ArmorProficiencies"
        options={defaultProficiencies}
        selected={$actor.system.proficiencies.armor}
        on:updateSelection={(event) =>
            updateDocumentDataFromField(
                $actor,
                "system.proficiencies.armor",
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
