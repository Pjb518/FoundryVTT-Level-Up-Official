<script>
import { getContext } from 'svelte';

import Checkbox from '../components/Checkbox.svelte';
import FieldWrapper from '../components/FieldWrapper.svelte';
import RadioGroup from '../components/RadioGroup.svelte';
import Section from '../components/Section.svelte';

export let reload;

const settings = getContext('settings');
const updates = getContext('updates');

let visionRules = settings.getStore('automateVisionRules');
let charOnlyVisionRules = settings.getStore('visionRulesApplyToCharactersOnly');
let placeTemplate = settings.getStore('placeItemTemplateDefault');
</script>

<Section heading="VIsion Settings" --a5e-section-body-gap="0.5rem">
    <FieldWrapper hint="A5E.settings.hints.automateVisionRules">
        <Checkbox
            label="A5E.settings.automateVisionRules"
            checked={updates.get("automateVisionRules") ?? $visionRules ?? false}
            on:updateSelection={({ detail }) => {
                updates.set("automateVisionRules", detail);
                visionRules.set(detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    {#if $visionRules}
        <FieldWrapper hint="A5E.settings.hints.visionRulesApplyToCharactersOnly">
            <Checkbox
                label="A5E.settings.visionRulesApplyToCharactersOnly"
                checked={updates.get("visionRulesApplyToCharactersOnly") ??
                    $charOnlyVisionRules ??
                    true}
                on:updateSelection={({ detail }) => {
                    updates.set("visionRulesApplyToCharactersOnly", detail);
                    reload = true;
                }}
            />
        </FieldWrapper>
    {/if}
</Section>

<Section heading="Template Settings" --a5e-section-body-gap="0.5rem">
    <FieldWrapper hint="A5E.settings.hints.placeItemTemplateDefault">
        <Checkbox
            label="A5E.settings.placeItemTemplateDefault"
            checked={updates.get("placeItemTemplateDefault") ?? $placeTemplate ?? false}
            on:updateSelection={({ detail }) => {
                updates.set("placeItemTemplateDefault", detail);
            }}
        />
    </FieldWrapper>
</Section>
