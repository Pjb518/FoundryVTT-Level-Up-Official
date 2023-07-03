<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import FormSection from "../components/FormSection.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);

    $: ac = $actor.system.attributes.ac;

    $: acFormula = `${ac.base} + `;
</script>

<article>
    <div class="u-flex u-flex-col u-gap-md">
        <FormSection heading="A5E.armorClass.baseValue">
            <div class="u-w-full">
                <input
                    class="a5e-input"
                    type="number"
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

        <div class="u-w-full ac-formula-preview">
            {acFormula}
        </div>
    </div>
</article>

<style lang="scss">
    .ac-formula-preview {
        padding: 0.5rem;
        font-size: 0.833rem;
        border: 1px solid #7a7971;
        border-radius: 4px;
    }
</style>
