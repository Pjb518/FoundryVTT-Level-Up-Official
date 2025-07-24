<script>
import { getContext } from 'svelte';
import { localize } from '#runtime/util/i18n';

import updateDocumentDataFromField from '../../../utils/updateDocumentDataFromField';

import Checkbox from '../Checkbox.svelte';
import FieldWrapper from '../FieldWrapper.svelte';
import Section from '../Section.svelte';
import RadioGroup from '../RadioGroup.svelte';

const item = getContext('item');
const grantId = getContext('grantId');

const levelTypes = CONFIG.A5E.classLevelTypes;

function onUpdateValue(key, value) {
	key = `system.grants.${grantId}.${key}`;
	updateDocumentDataFromField($item, key, value);
}

$: grant = $item.system.grants[grantId];
</script>

<Section heading="Grant Config" --a5e-section-body-gap="0.75rem">
    <slot />

    <FieldWrapper heading="A5E.grants.headings.level">
        <input
            type="number"
            value={grant.level ?? 1}
            min="1"
            on:change={({ target }) => {
                onUpdateValue("level", Math.max(Number(target.value), 1));
            }}
        />
    </FieldWrapper>

    <RadioGroup
        heading="A5E.classes.levelType"
        options={Object.entries(levelTypes)}
        selected={grant.levelType}
        allowDeselect={false}
        on:updateSelection={({ detail }) => onUpdateValue("levelType", detail)}
    />

    <Checkbox
        label="Mark grant as optional"
        checked={grant.optional ?? false}
        on:updateSelection={({ detail }) => onUpdateValue("optional", detail)}
    />
</Section>
