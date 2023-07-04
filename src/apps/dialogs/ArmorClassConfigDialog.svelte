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
    $: wornArmor = fromUuidSync($actor.system.attributes.ac.wornArmor);
    $: wornShield = fromUuidSync($actor.system.attributes.ac.wornShield);
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
                    type="number"
                    name="system.attributes.ac.base"
                    value={$actor.system.attributes.ac.base}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            Number(target.value)
                        )}
                />
            </div>
        </FormSection>

        <FormSection>
            <div class="u-flex u-flex-col u-gap-md">
                <div>
                    <label class="u-text-bold u-text-sm" for="">
                        Worn Armor:
                    </label>
                    <p>
                        {wornArmor?.name ?? localize("A5E.None")}
                        {wornArmor ? `[ ${wornArmor.system.ac.formula} ]` : ""}
                    </p>
                </div>

                <div>
                    <label class="u-text-bold u-text-sm" for="">
                        Worn Shield:
                    </label>
                    <p>
                        {wornShield?.name ?? localize("A5E.None")}
                        {wornShield
                            ? `[ ${wornShield.system.ac.formula} ]`
                            : ""}
                    </p>
                </div>
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
