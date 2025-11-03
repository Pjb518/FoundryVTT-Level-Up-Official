<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { objectEntriesNumberKeyConverter } from "#utils/objectEntriesNumberKeyConverter.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    function getRawSpellComponents() {
        return Object.entries(itemStore.components)
            .filter(([, state]) => state)
            .map(([component]) => component);
    }

    function prepareSpellComponents() {
        return Object.entries(itemStore.components)
            .filter(([, state]) => state)
            .map(([component]) => spellComponentAbbreviations[component] ?? component)
            .join(", ");
    }

    function prepareSecondarySpellSchools() {
        const schools = itemStore.schools.secondary.map(
            (school: string) => spellSchools.secondary[school] ?? school,
        );

        schools.sort((a: string, b: string) => a.localeCompare(b));
        return schools.join(", ");
    }

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);
    const {
        PREPARED_STATES,
        classSpellLists,
        psionicDisciplines,
        spellComponents,
        spellComponentAbbreviations,
        spellLevels,
        spellSchools,
    } = CONFIG.A5E;

    let editMode = $state(false);
    let showVRCPsionicDisciplines = game.settings.get(
        "a5e",
        "showVRCPsionicDisciplines",
    ) as boolean;

    let selectedSpellComponentsList = $derived(getRawSpellComponents());
    let selectedSpellComponents = $derived(prepareSpellComponents());
    let selectedSpellSchools = $derived(prepareSecondarySpellSchools());
</script>

<Section
    heading="A5E.tabs.spellConfiguration"
    headerButtons={[
        {
            classes: `icon fa-solid ${editMode ? "fa-chevron-up" : "fa-edit"}`,
            handler: () => (editMode = !editMode),
        },
    ]}
    --a5e-section-body-gap="0.75rem"
    --a5e-section-heading-gap="0.5rem"
    --a5e-section-heading-template-columns="max-content max-content"
>
    {#if editMode}
        <CheckboxGroup
            heading="Classes"
            hint="Select the classes that are eligible to select this spell."
            options={Object.entries(classSpellLists)}
            selected={itemStore.classes}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(item, "system.classes", value)}
        />

        <RadioGroup
            heading="A5E.spells.level"
            options={objectEntriesNumberKeyConverter(spellLevels)}
            selected={itemStore.level}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(item, "system.level", value)}
        />

        <RadioGroup
            heading="A5E.spells.schoolPrimary"
            options={Object.entries(spellSchools.primary)}
            selected={itemStore.schools.primary}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(item, "system.schools.primary", value)}
        />

        {#if showVRCPsionicDisciplines}
            <RadioGroup
                heading="A5E.psionicDisciplines.title"
                options={Object.entries(psionicDisciplines)}
                selected={itemStore.discipline}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(item, "system.discipline", value)}
            />
        {/if}

        <CheckboxGroup
            heading="A5E.spells.schoolSecondaryPlural"
            options={Object.entries(spellSchools.secondary)}
            selected={itemStore.schools.secondary}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(item, "system.schools.secondary", value)}
        />

        <CheckboxGroup
            heading="A5E.spells.components.title"
            options={Object.entries(spellComponents)}
            selected={selectedSpellComponentsList}
            onUpdateSelection={(value) => {
                const updates = {};
                Object.entries(itemStore.components ?? {}).forEach(([key]) => {
                    if (value.includes(key)) updates[key] = true;
                    else updates[key] = false;
                });

                updateDocumentDataFromField(item, "system.components", updates);
            }}
        />

        {#if itemStore.components.material}
            <FieldWrapper heading="A5E.spells.materials">
                <input
                    class="a5e-input a5e-input--slim"
                    type="text"
                    value={itemStore.materials}
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            item,
                            "system.materials",
                            currentTarget.value,
                        )}
                />
            </FieldWrapper>
        {/if}

        <Section --a5e-section-body-direction="row" --a5e-section-body-gap="0.75rem">
            <Checkbox
                label="A5E.SpellConcentration"
                checked={itemStore.concentration}
                onUpdateSelection={(value) => {
                    updateDocumentDataFromField(item, "system.concentration", value);
                }}
            />

            <Checkbox
                label="A5E.ItemPrepared"
                checked={itemStore.prepared}
                onUpdateSelection={(value) => {
                    updateDocumentDataFromField(item, "system.prepared", value);
                }}
            />

            {#if itemStore.prepared}
                <Checkbox
                    label="Always Prepared"
                    checked={Number(itemStore.prepared ?? 0) ===
                        PREPARED_STATES.ALWAYS_PREPARED}
                    onUpdateSelection={(checked) => {
                        updateDocumentDataFromField(
                            item,
                            "system.prepared",
                            checked ? 2 : 1,
                        );
                    }}
                />
            {/if}

            {#if itemStore.level > 0}
                <Checkbox
                    label="A5E.SpellRitual"
                    checked={itemStore.ritual}
                    onUpdateSelection={(value) => {
                        updateDocumentDataFromField(item, "system.ritual", value);
                    }}
                />
            {/if}

            <Checkbox
                label="A5E.spells.rare"
                checked={itemStore.rare}
                onUpdateSelection={(value) => {
                    updateDocumentDataFromField(item, "system.rare", value);
                }}
            />
        </Section>

        <Section --a5e-section-body-direction="row" --a5e-section-body-gap="0.75rem">
            <FieldWrapper>
                <Checkbox
                    label="A5E.items.requiresBloodied"
                    checked={itemStore.requiresBloodied}
                    onUpdateSelection={(value) => {
                        updateDocumentDataFromField(
                            item,
                            "system.requiresBloodied",
                            value,
                        );
                    }}
                />
            </FieldWrapper>
        </Section>
    {:else}
        <dl class="a5e-dl-box">
            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.spells.level")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {spellLevels[itemStore.level] ?? itemStore.level}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.spells.schoolPrimary")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {spellSchools.primary[itemStore.schools.primary] ||
                        localize("A5E.None")}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.spells.schoolSecondaryPlural")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {selectedSpellSchools || localize("A5E.None")}
                </dd>
            </div>

            {#if showVRCPsionicDisciplines}
                <div class="a5e-dl-box__section">
                    <dt class="a5e-dl-box__header">
                        {localize("A5E.psionicDisciplines.title")}:
                    </dt>

                    <dd class="a5e-dl-box__content">
                        {localize(psionicDisciplines[itemStore.diiscipline]) ||
                            localize("A5E.None")}
                    </dd>
                </div>
            {/if}

            <hr class="a5e-rule" />

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.spells.components.title")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {selectedSpellComponents || localize("A5E.None")}
                </dd>
            </div>

            {#if itemStore.components.material && itemStore.materials}
                <div class="a5e-dl-box__section">
                    <dt class="a5e-dl-box__header">
                        {localize("A5E.spells.materials")}:
                    </dt>

                    <dd class="a5e-dl-box__content">
                        {itemStore.materials}
                    </dd>
                </div>
            {/if}
        </dl>
    {/if}
</Section>
