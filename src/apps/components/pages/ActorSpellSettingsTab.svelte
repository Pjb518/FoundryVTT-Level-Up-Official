<script>
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    import determineIfPropertyModifiedByEffect from "../../../utils/determineIfPropertyModifiedByEffect ";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");
    const { abilityAbbreviations } = CONFIG.A5E;

    $: flags = $actor.flags?.a5e;

    $: disableSpellDC = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.spellDC",
    );
</script>

<section class="a5e-page-wrapper a5e-page-wrapper--settings">
    <div class="a5e-section a5e-section--settings">
        <header class="a5e-section-header a5e-section-header--rounded">
            <h3 class="a5e-section-header__heading">Spell Resource Settings</h3>
        </header>

        <FormSection --background="transparent" --padding="0.25rem">
            <Checkbox
                label="A5E.SpellShowSpellSlots"
                checked={flags.showSpellSlots ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.showSpellSlots",
                        detail,
                    );
                }}
            />
        </FormSection>

        {#if flags.showSpellSlots ?? true}
            <FormSection --background="transparent" --padding="0.25rem">
                <Checkbox
                    label="A5E.settings.restoreSpellSlotsOnShortRest"
                    checked={flags.restoreSpellSlotsOnShortRest ?? false}
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
                checked={flags.showSpellPoints ?? false}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.showSpellPoints",
                        detail,
                    );
                }}
            />
        </FormSection>

        {#if flags.showSpellPoints ?? false}
            <FormSection --background="transparent" --padding="0.25rem">
                <Checkbox
                    label="A5E.settings.restoreSpellPointsOnShortRest"
                    checked={flags.restoreSpellPointsOnShortRest ?? true}
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
        <header class="a5e-section-header a5e-section-header--rounded">
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

        <FormSection
            heading="A5E.SpellDCBonus"
            hint="This field accepts any values valid in roll formulae."
            showWarning={disableSpellDC}
            warning="A5E.validations.warnings.modifiedByEffect"
            --background="transparent"
            --padding="0.25rem"
        >
            <div class="u-w-full">
                <input
                    class="a5e-input"
                    type="text"
                    name="system.bonuses.spellDC"
                    value={$actor.system.bonuses.spellDC}
                    disabled={disableSpellDC}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value,
                        )}
                />
            </div>
        </FormSection>
    </div>
</section>
