<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    import CustomTagGroup from "../components/CustomTagGroup.svelte";

    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const systemImmunities = Object.entries(CONFIG.A5E.conditions);
</script>

<article>
    <CustomTagGroup
        heading="A5E.ConditionImmunities"
        options={systemImmunities}
        selected={$actor.system.traits.conditionImmunities}
        on:updateSelection={(event) =>
            updateDocumentDataFromField(
                $actor,
                "system.traits.conditionImmunities",
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
