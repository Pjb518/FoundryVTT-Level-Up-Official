<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import Checkbox from "../components/Checkbox.svelte";
    import CustomTagGroup from "../components/CustomTagGroup.svelte";
    import FormSection from "../components/FormSection.svelte";

    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const systemTypes = Object.entries(CONFIG.A5E.creatureTypes);
</script>

<article>
    <FormSection>
        <CustomTagGroup
            heading="A5E.CreatureTypePlural"
            options={systemTypes}
            selected={$actor.system.details.creatureTypes}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $actor,
                    "system.details.creatureTypes",
                    event.detail
                )}
        />
    </FormSection>

    <FormSection>
        <Checkbox
            label="A5E.CreatureSwarm"
            checked={$actor.system.details.isSwarm}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    "system.details.isSwarm",
                    detail
                );
            }}
        />
    </FormSection>
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
