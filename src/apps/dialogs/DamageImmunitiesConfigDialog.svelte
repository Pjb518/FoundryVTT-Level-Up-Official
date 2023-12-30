<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import CustomTagGroup from "../components/CustomTagGroup.svelte";

    export let { document, appId } = getContext("#external").application;

    const actor = document;
    const systemDamageTypes = Object.entries(CONFIG.A5E.damageTypes);
</script>

<article>
    <CustomTagGroup
        heading="A5E.DamageTypePlural"
        options={systemDamageTypes}
        selected={$actor.system.traits.damageImmunities}
        on:updateSelection={(event) =>
            updateDocumentDataFromField(
                $actor,
                "system.traits.damageImmunities",
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
