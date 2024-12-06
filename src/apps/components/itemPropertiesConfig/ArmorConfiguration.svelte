<script>
import { getContext } from 'svelte';
import { localize } from '#runtime/util/i18n';

import updateDocumentDataFromField from '../../../utils/updateDocumentDataFromField';

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Section from "../Section.svelte";

    function prepareArmorMods(item) {
        let properties = item.system.armorMods.map(
            (property) => armorMods[property] ?? property,
        );
        properties.sort((a, b) => a.localeCompare(b));

        properties = properties.map(
            (property) => localize(property),
        );

        return properties.join(", ");
    }
    
    function prepareArmorProperties(item) {
        const properties = item.system.armorProperties.map(
            (property) => armorProperties[property] ?? property,
        );
        properties.sort((a, b) => a.localeCompare(b));

        return properties.join(", ");
    }

    function prepareRepairabilityProperties(item) {
        let properties = item.system.repairTools.map(
            (property) => repairTools[property] ?? property,
        );

        properties = properties.map(
            (property) => localize(property),
        );

	properties.sort((a, b) => a.localeCompare(b));

	return properties.join(', ');
}

    function getRepairabilityDC(item) {
        return item.system.repairabilityDC;
    }

    const item = getContext("item");
    const appId = getContext("appId");
    const { armor: armorTypes, armorProperties, armorMods, repairTools } = CONFIG.A5E;

let editMode = false;

    $: selectedArmorMods = prepareArmorMods($item);
    $: selectedArmorProperties = prepareArmorProperties($item);
    $: selectedRepairabilityProperties = prepareRepairabilityProperties($item);
    $: dc = getRepairabilityDC($item);
</script>

<Section
    heading="Armor Configuration"
    headerButtons={[
        {
            classes: `fa-solid ${editMode ? "fa-chevron-up" : "fa-edit"}`,
            handler: () => (editMode = !editMode),
        },
    ]}
    --a5e-section-body-gap="0.75rem"
    --a5e-section-heading-gap="0.5rem"
    --a5e-section-heading-template-columns="max-content max-content"
>
    {#if editMode}
        <RadioGroup
            heading="A5E.ArmorCategory"
            options={Object.entries(armorTypes)}
            selected={$item.system.armorCategory}
            on:updateSelection={(event) =>
                updateDocumentDataFromField($item, "system.armorCategory", event.detail)}
        />

        <CheckboxGroup
            heading="A5E.ArmorProperties"
            options={Object.entries(armorProperties)}
            selected={$item.system.armorProperties}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $item,
                    "system.armorProperties",
                    event.detail,
                )}
        />

        <CheckboxGroup
            heading="A5E.ArmorMods"
            options={Object.entries(armorMods)}
            selected={$item.system.armorMods}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $item,
                    "system.armorMods",
                    event.detail,
                )}
        />

        <Section --a5e-section-body-direction="row">
            <FieldWrapper heading="A5E.RepairabilityDC">
                <input
                    type="number"
                    data-dtype="Number"
                    name="system.repairabilityDC"
                    id="{appId}-repairabilityDC"
                    value={$item.system.repairabilityDC ?? 0}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            target.name,
                            Number(target.value),
                        )}
                />
            </FieldWrapper>

            <CheckboxGroup
                heading="A5E.RepairabilityTools"
                options={Object.entries(repairTools)}
                selected={$item.system.repairTools}
                on:updateSelection={(event) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.repairTools",
                        event.detail,
                    )}
            />
        </Section>
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.ArmorCategory")}:</dt>
                <dd class="u-m-0 u-p-0">
                    {#if $item.system.armorCategory}
                        {armorTypes[$item.system.armorCategory] ??
                            $item.system.armorCategory}
                    {:else}
                        {localize("A5E.Unknown")}
                    {/if}
                </dd>
            </div>

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.ArmorProperties")}:</dt>

                <dd class="u-m-0 u-p-0">
                    {selectedArmorProperties || localize("A5E.None")}
                </dd>
            </div>

            {#if selectedArmorMods}
                <div class="u-flex u-gap-md">
                    <dt class="u-text-bold">{localize("A5E.ArmorMods")}:</dt>

                    <dd class="u-m-0 u-p-0">
                        {selectedArmorMods}
                    </dd>
                </div>
            {/if}

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.Repairability")}:</dt>

                <dd class="u-m-0 u-p-0">
                    {#if dc != "0"}DC {dc}, {/if}{selectedRepairabilityProperties}
                </dd>
            </div>
        </dl>
    {/if}
</Section>
