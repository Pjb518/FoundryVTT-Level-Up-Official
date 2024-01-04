<script>
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../LegacyFormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");
    const { abilityAbbreviations } = CONFIG.A5E;

    $: flags = $actor.flags?.a5e ?? {};
</script>

<section class="a5e-page-wrapper a5e-page-wrapper--settings">
    <div class="a5e-section a5e-section--settings">
        <header class="a5e-section-header">
            <h3 class="a5e-section-header__heading">Spell Resource Settings</h3>
        </header>

        <FormSection --background="transparent" --padding="0.25rem">
            <Checkbox
                label="A5E.SpellShowSpellSlots"
                checked={flags?.showSpellSlots ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.showSpellSlots",
                        detail,
                    );
                }}
            />
        </FormSection>

        {#if flags?.showSpellSlots ?? true}
            <FormSection --background="transparent" --padding="0.25rem">
                <Checkbox
                    label="A5E.settings.restoreSpellSlotsOnShortRest"
                    checked={flags?.restoreSpellSlotsOnShortRest ?? false}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            "flags.a5e.restoreSpellSlotsOnShortRest",
                            detail,
                        );
                    }}
                />
            </FormSection>
        {/if}

        <FormSection --background="transparent" --padding="0.25rem">
            <Checkbox
                label="A5E.SpellShowSpellPoints"
                checked={flags?.showSpellPoints ?? false}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.showSpellPoints",
                        detail,
                    );
                }}
            />
        </FormSection>

        {#if flags?.showSpellPoints ?? false}
            <FormSection --background="transparent" --padding="0.25rem">
                <Checkbox
                    label="A5E.settings.restoreSpellPointsOnShortRest"
                    checked={flags?.restoreSpellPointsOnShortRest ?? true}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            "flags.a5e.restoreSpellPointsOnShortRest",
                            detail,
                        );
                    }}
                />
            </FormSection>
        {/if}
    </div>

    <div class="a5e-section a5e-section--settings">
        <header class="a5e-section-header">
            <h3 class="a5e-section-header__heading">
                Miscellaneous Spell Settings
            </h3>
        </header>

        <FormSection
            heading="A5E.SpellcastingAbilityScore"
            --background="transparent"
            --padding="0.25rem"
        >
            <RadioGroup
                optionStyles="min-width:2rem; text-align: center;"
                options={Object.entries(abilityAbbreviations)}
                selected={$actor.system.attributes.spellcasting}
                on:updateSelection={(event) =>
                    updateDocumentDataFromField(
                        $actor,
                        "system.attributes.spellcasting",
                        event.detail,
                    )}
            />
        </FormSection>
    </div>
</section>
