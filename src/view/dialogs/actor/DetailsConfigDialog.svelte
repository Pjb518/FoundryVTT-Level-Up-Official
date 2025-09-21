<script lang="ts">
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import CustomTagGroup from "#view/snippets/CustomTagGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";
    import ComplexDetailEmbed from "#view/snippets/ComplexDetailEmbed.svelte";

    type Props = {
        document: any;
        propertyKey: string;
        configObject: any;
        heading: string;
        type: string;
    };

    function getTooltipData(actor: Actor) {
        const grantData = actor.grants.getGrantedTraits(type);

        const data = {};
        for (const value of Object.values(grantData)) {
            value.traits.forEach((trait) => {
                const docName = fromUuidSync(value.itemId)?.name;
                data[trait] = `Granted by ${docName}`;
            });
        }

        return data;
    }

    let { document, propertyKey, configObject, heading, type }: Props =
        $props();

    let actor = document;
    let actorStore = $derived(actor.reactive.system);
    const isRadioGroup = ["size"].includes(type);
    const { weaponCategories, toolCategories } = CONFIG.A5E;

    let selected = $derived(
        foundry.utils.getProperty(actor.reactive, propertyKey),
    );
    let tooltipData = $derived(getTooltipData(actor.reactive));

    let options = $derived(Object.entries(configObject)) as string[][];
</script>

<Section --a5e-section-body-padding="0.75rem" --a5e-section-body-gap="0.75rem">
    {#if isRadioGroup}
        <FieldWrapper>
            <RadioGroup
                {heading}
                {options}
                {selected}
                allowDeselect={false}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(actor, propertyKey, value)}
            />
        </FieldWrapper>
    {:else if type === "weapons"}
        <ComplexDetailEmbed
            existingProperties={actorStore.proficiencies.weapons}
            headings={weaponCategories}
            {configObject}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(actor, propertyKey, value)}
        />
    {:else if type === "tools"}
        <ComplexDetailEmbed
            existingProperties={actorStore.proficiencies.tools}
            headings={toolCategories}
            {configObject}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(actor, propertyKey, value)}
        />
    {:else}
        <FieldWrapper>
            <CustomTagGroup
                {heading}
                {options}
                {selected}
                {tooltipData}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(actor, propertyKey, value)}
            />
        </FieldWrapper>
    {/if}

    {#if type === "creatureTypes"}
        <FieldWrapper>
            {#if actor.type === "npc"}
                <Checkbox
                    label="Squad"
                    checked={actorStore.details.isSquad}
                    onUpdateSelection={(value) => {
                        updateDocumentDataFromField(
                            actor,
                            "system.details.isSquad",
                            value,
                        );
                    }}
                />
            {/if}

            <Checkbox
                label="A5E.values.creature.labels.swarm"
                checked={actorStore.details.isSwarm}
                onUpdateSelection={(value) => {
                    updateDocumentDataFromField(
                        actor,
                        "system.details.isSwarm",
                        value,
                    );
                }}
            />
        </FieldWrapper>
    {/if}
</Section>
