<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import Checkbox from "../components/Checkbox.svelte";
    import CustomTagGroup from "../components/CustomTagGroup.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import Section from "../components/Section.svelte";
    import ComplexDetailEmbed from "../components/ComplexDetailEmbed.svelte";

    export let { document, appId, propertyKey, configObject, heading, type } =
        getContext("#external").application;

    function getTooltipData() {
        const grantData = $actor.grants.getGrantedTraits(type);

        const data = {};
        for (const value of Object.values(grantData)) {
            value.traits.forEach((trait) => {
                const docName = fromUuidSync(value.itemId)?.name;
                data[trait] = `Granted by ${docName}`;
            });
        }

        return data;
    }

    const actor = document;
    const options = Object.entries(configObject);
    const isRadioGroup = ["size"].includes(type);

    $: selected = foundry.utils.getProperty($actor, propertyKey);
    $: tooltipData = getTooltipData($actor);
</script>

<Section --a5e-section-body-padding="0.75rem" --a5e-section-body-gap="0.75rem">
    {#if isRadioGroup}
        <FieldWrapper>
            <RadioGroup
                {heading}
                {options}
                {selected}
                allowDeselect={false}
                on:updateSelection={(event) =>
                    updateDocumentDataFromField(
                        $actor,
                        propertyKey,
                        event.detail,
                    )}
            />
        </FieldWrapper>
    {:else if type === "weapons"}
        <ComplexDetailEmbed
            existingProperties={$actor.system.proficiencies.weapons}
            headings={{
                simple: "A5E.WeaponsSimple",
                martial: "A5E.WeaponsMartial",
                rare: "A5E.WeaponsRare",
                other: "A5E.WeaponsOther",
            }}
            {configObject}
            on:updateSelection={(event) =>
                updateDocumentDataFromField($actor, propertyKey, event.detail)}
        />
    {:else if type === "tools"}
        <ComplexDetailEmbed
            existingProperties={$actor.system.proficiencies.tools}
            headings={{
                artisansTools: "A5E.ToolsArtisanTools",
                gamingSets: "A5E.ToolsGamingSets",
                musicalInstruments: "A5E.MusicalInstruments",
                miscellaneous: "A5E.ToolsMiscellaneous",
                vehicles: "A5E.ToolsVehicles",
                other: "A5E.ToolsOther",
            }}
            {configObject}
            on:updateSelection={(event) =>
                updateDocumentDataFromField($actor, propertyKey, event.detail)}
        />
    {:else}
        <FieldWrapper>
            <CustomTagGroup
                {heading}
                {options}
                {selected}
                {tooltipData}
                on:updateSelection={(event) =>
                    updateDocumentDataFromField(
                        $actor,
                        propertyKey,
                        event.detail,
                    )}
            />
        </FieldWrapper>
    {/if}

    {#if type === "creatureTypes"}
        <FieldWrapper>
            <Checkbox
                label="A5E.CreatureSwarm"
                checked={$actor.system.details.isSwarm}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "system.details.isSwarm",
                        detail,
                    );
                }}
            />
        </FieldWrapper>
    {/if}
</Section>
