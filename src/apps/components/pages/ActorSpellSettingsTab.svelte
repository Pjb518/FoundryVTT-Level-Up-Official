<script>
import { getContext } from 'svelte';

import Checkbox from '../Checkbox.svelte';
import FieldWrapper from '../FieldWrapper.svelte';
import RadioGroup from '../RadioGroup.svelte';
import Section from '../Section.svelte';

import updateDocumentDataFromField from '../../../utils/updateDocumentDataFromField';

const actor = getContext('actor');
const { abilityAbbreviations } = CONFIG.A5E;

$: flags = $actor.flags?.a5e ?? {};
</script>

<Section heading="Spell Resource Settings" --a5e-section-body-gap="0.75rem">
    <FieldWrapper>
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
    </FieldWrapper>

    <FieldWrapper>
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
    </FieldWrapper>
</Section>

<Section
    heading="Miscellaneous Spell Settings"
    --a5e-section-body-gap="0.75rem"
>
    <RadioGroup
        heading="A5E.DefaultSpellcastingAbilityScore"
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
</Section>
