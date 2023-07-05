<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import FormSection from "../components/FormSection.svelte";

    import getACComponents from "../../utils/getACComponents";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";
    import RadioGroup from "../components/RadioGroup.svelte";

    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const { A5E } = CONFIG;

    $: acFormula = getACComponents($actor);

    $: ac = $actor.system.attributes.ac;
    $: availableShields = ac.wornShield.shields.map((shield) => {
        const item = fromUuidSync(shield);
        return [item.uuid, item.name];
    });
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

        <FormSection heading="A5E.armorClass.appliedArmorTypes.label">
            <RadioGroup
                options={Object.entries(A5E.appliedArmorTypes)}
                selected={$actor.system.attributes.ac.wornArmor.applied}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $actor,
                        "system.attributes.ac.wornArmor.applied",
                        detail
                    )}
            />
        </FormSection>

        {#if availableShields.length}
            <FormSection heading="A5E.armorClass.shield">
                <RadioGroup
                    options={availableShields}
                    selected={$actor.system.attributes.ac.wornShield.applied}
                    on:updateSelection={({ detail }) =>
                        updateDocumentDataFromField(
                            $actor,
                            "system.attributes.ac.wornShield.applied",
                            detail
                        )}
                />
            </FormSection>
        {/if}

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
