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

    function getOptions(configObject) {
	let proficiencyOptions = configObject;

	if (game.settings.get("a5e", "showVRCProficiencies")) {
		if (type === "tools") {
			delete proficiencyOptions.vehicles.spaceVehicles;
			delete proficiencyOptions.miscellaneous.computers;
		} else if (type === "weapons") {
			delete proficiencyOptions.miscellaneous.starship;
		} else if (type === "languages") {
			delete proficiencyOptions.machine;
		}
	}

	return proficiencyOptions;
    }

    const actor = document;
    let options = Object.entries(configObject);
    configObject = getOptions(configObject);
    const isRadioGroup = ["size"].includes(type);
    const { weaponCategories, toolCategories } = CONFIG.A5E;

    $: selected = foundry.utils.getProperty($actor, propertyKey);
    $: tooltipData = getTooltipData($actor);
    $: options = Object.entries(configObject);
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
            headings={weaponCategories}
            {configObject}
            on:updateSelection={(event) =>
                updateDocumentDataFromField($actor, propertyKey, event.detail)}
        />
    {:else if type === "tools"}
        <ComplexDetailEmbed
            existingProperties={$actor.system.proficiencies.tools}
            headings={toolCategories}
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
            {#if $actor.type === "npc"}
                <Checkbox
                    label="Squad"
                    checked={$actor.system.details.isSquad}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            "system.details.isSquad",
                            detail,
                        );
                    }}
                />
            {/if}

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
