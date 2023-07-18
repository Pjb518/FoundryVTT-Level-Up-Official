<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import FormSection from "../components/FormSection.svelte";

    import getACComponents from "../../utils/getACComponents";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);

    $: acFormula = getACComponents($actor);
</script>

<article>
    <div class="u-flex u-flex-col u-gap-md">
        <FormSection
            heading="A5E.armorClass.base"
            hint="For NPCs this value states their Natural Armor."
        >
            <div class="u-w-full">
                <input
                    class="a5e-input"
                    type="text"
                    name="system.attributes.ac.base"
                    value={$actor.system.attributes.ac.base}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </div>
        </FormSection>

        <div class="u-flex u-flex-col u-gap-sm">
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.armorClass.formula")}
            </h3>

            <div class="u-w-full ac-formula-preview">
                {acFormula}
            </div>
        </div>
    </div>
</article>

<style lang="scss">
    article {
        padding: 0.75rem;
    }

    .ac-formula-preview {
        padding: 0.5rem;
        font-size: 0.833rem;
        border: 1px solid #7a7971;
        border-radius: 4px;
    }
</style>
