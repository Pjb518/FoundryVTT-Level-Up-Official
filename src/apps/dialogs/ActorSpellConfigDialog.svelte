<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    import CustomTagGroup from "../components/CustomTagGroup.svelte";
    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const { abilityAbbreviations, spellLevels } = CONFIG.A5E;

    $: flags = $actor.flags.a5e;
</script>

<article>
    <FormSection>
        <CustomTagGroup
            heading="A5E.AvailableSpellLevels"
            options={Object.entries(spellLevels)}
            selected={flags?.availableSpellLevels ||
                [...Array(10).keys()].map((x) => x.toString())}
            showCustomInput={false}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $actor,
                    "flags.a5e.availableSpellLevels",
                    event.detail
                )}
        />
    </FormSection>

    <FormSection heading="A5E.SpellcastingAbilityScore">
        <RadioGroup
            listClasses="u-gap-md u-mb-md u-text-sm"
            optionStyles="padding:0.5rem; text-align: center; width: 1.85rem"
            options={Object.entries(abilityAbbreviations)}
            selected={$actor.system.attributes.spellcasting}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $actor,
                    "system.attributes.spellcasting",
                    event.detail
                )}
        />
    </FormSection>

    <FormSection heading="A5E.SpellDCBonus">
        <div class="u-w-full">
            <input
                class="a5e-input"
                type="text"
                name="system.bonuses.spellDC"
                value={$actor.system.bonuses.spellDC}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value
                    )}
            />
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
                    checked={flags.showSpellSlots ?? true}
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
                    checked={flags.showSpellPoints ?? false}
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
