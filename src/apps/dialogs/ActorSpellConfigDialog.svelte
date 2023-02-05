<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";
    import CustomTagGroup from "../components/CustomTagGroup.svelte";

    import A5E from "../../modules/config";

    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let { actor, appId } = getContext("external").application;

    const flags = $actor.flags.a5e;
</script>

<main>
    <FormSection>
        <CustomTagGroup
            heading="A5E.AvailableSpellLevels"
            options={Object.entries(A5E.spellLevels)}
            selected={flags?.availableSpellLevels ||
                [...Array(10).keys()].map((x) => x.toString())}
            showCustomInput={false}
            name="flags.a5e.availableSpellLevels"
            document={actor}
        />
    </FormSection>

    <FormSection heading="A5E.SpellcastingAbilityScore">
        <RadioGroup
            listClasses="u-gap-md u-mb-md u-text-sm"
            optionClasses="u-p-md u-text-center u-w-12"
            options={Object.entries(A5E.abilityAbbreviations)}
            selected={$actor.system.attributes.spellcasting}
            document={actor}
            name="system.attributes.spellcasting"
        />
    </FormSection>

    <FormSection heading="A5E.SpellDCBonus">
        <div class="u-w-full">
            <div class="u-w-20">
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.spell.dc"
                    value={$actor.system.bonuses.spell.dc}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </div>
        </div>
    </FormSection>

    <FormSection>
        <div class="u-align-center u-flex u-gap-xxl">
            <div class="u-align-center u-flex u-gap-md">
                <input
                    class="u-pointer"
                    type="checkbox"
                    name="flags.a5e.showSpellSlots"
                    id={`${appId}-show-spell-slots`}
                    checked={$actor.flags.a5e?.showSpellSlots ?? true}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.checked
                        )}
                />

                <label class="u-pointer" for={`${appId}-show-spell-slots`}>
                    {localize("A5E.SpellShowSpellSlots")}
                </label>
            </div>

            <div class="u-align-center u-flex u-gap-md">
                <input
                    class="u-pointer"
                    type="checkbox"
                    name="flags.a5e.showSpellPoints"
                    id={`${appId}-show-spell-points`}
                    checked={$actor.flags.a5e?.showSpellPoints ?? true}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.checked
                        )}
                />

                <label class="u-pointer" for={`${appId}-show-spell-points`}>
                    {localize("A5E.SpellShowSpellPoints")}
                </label>
            </div>
        </div>
    </FormSection>
</main>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
        overflow: auto;
        background: rgba(246, 242, 235, 0.5);
    }
</style>
