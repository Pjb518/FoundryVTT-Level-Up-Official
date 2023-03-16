<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    import CustomTagGroup from "../components/CustomTagGroup.svelte";
    import FormSection from "../components/FormSection.svelte";

    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const systemTypes = Object.entries(CONFIG.A5E.creatureTypes);
</script>

<article>
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

    <FormSection>
        <div class="u-align-center u-flex u-gap-md">
            <input
                class="u-pointer"
                type="checkbox"
                id="{appId}-is-swarm"
                name="system.details.isSwarm"
                checked={$actor.system.details.isSwarm}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.checked
                    )}
            />

            <label class="u-pointer" for="{appId}-is-swarm">
                {localize("A5E.CreatureSwarm")}
            </label>
        </div>
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
