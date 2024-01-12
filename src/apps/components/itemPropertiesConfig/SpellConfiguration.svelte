<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import objectEntriesNumberKeyConverter from "../../../utils/objectEntriesNumberKeyConverter";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";
    import FormSection from "../LegacyFormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Section from "../Section.svelte";
    import Tag from "../Tag.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";

    function prepareSpellComponents(item) {
        return Object.entries(item.system.components)
            .filter(([_, state]) => state)
            .map(
                ([component]) =>
                    spellComponentAbbreviations[component] ?? component,
            )
            .join(", ");
    }

    function prepareSecondarySpellSchools(item) {
        const schools = item.system.schools.secondary.map(
            (school) => spellSchools.secondary[school] ?? school,
        );

        schools.sort((a, b) => a.localeCompare(b));

        return schools.join(", ");
    }

    const item = getContext("item");

    const {
        PREPARED_STATES,
        classSpellLists,
        spellComponents,
        spellComponentAbbreviations,
        spellLevels,
        spellSchools,
    } = CONFIG.A5E;

    let editMode = false;

    $: selectedSpellComponents = prepareSpellComponents($item);
    $: selectedSecondarySpellSchools = prepareSecondarySpellSchools($item);
</script>

<Section
    heading="A5E.TabSpellConfiguration"
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
        <CheckboxGroup
            heading="Classes"
            hint="Select the classes that are eligible to select this spell."
            options={Object.entries(classSpellLists)}
            selected={$item.system.classes}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $item,
                    "system.classes",
                    event.detail,
                )}
        />

        <RadioGroup
            heading="A5E.SpellLevel"
            options={objectEntriesNumberKeyConverter(spellLevels)}
            selected={$item.system.level}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $item,
                    "system.level",
                    event.detail,
                )}
        />

        <RadioGroup
            heading="A5E.SpellSchoolPrimary"
            options={Object.entries(spellSchools.primary)}
            selected={$item.system.schools.primary}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $item,
                    "system.schools.primary",
                    event.detail,
                )}
        />

        <CheckboxGroup
            heading="A5E.SpellSchoolSecondaryPlural"
            options={Object.entries(spellSchools.secondary)}
            selected={$item.system.schools.secondary}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $item,
                    "system.schools.secondary",
                    event.detail,
                )}
        />

        <FieldWrapper heading="A5E.SpellComponents">
            <ul
                class="u-flex u-flex-wrap u-gap-sm u-list-style-none u-m-0 u-p-0 u-text-xs u-w-full"
            >
                {#each Object.entries(spellComponents) as [value, label]}
                    <Tag
                        {label}
                        {value}
                        active={$item.system.components[value]}
                        on:tagToggle={() =>
                            updateDocumentDataFromField(
                                $item,
                                `system.components.${value}`,
                                !$item.system.components[value],
                            )}
                    />
                {/each}
            </ul>
        </FieldWrapper>

        {#if $item.system.components.material}
            <FieldWrapper heading="A5E.SpellMaterials">
                <input
                    class="a5e-input"
                    type="text"
                    name="system.materials"
                    value={$item.system.materials}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            target.name,
                            target.value,
                        )}
                />
            </FieldWrapper>
        {/if}

        <Section
            --a5e-section-body-direction="row"
            --a5e-section-body-gap="0.75rem"
        >
            <Checkbox
                label="A5E.SpellConcentration"
                checked={$item.system.concentration}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $item,
                        "system.concentration",
                        detail,
                    );
                }}
            />

            <Checkbox
                label="A5E.ItemPrepared"
                checked={$item.system.prepared}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $item,
                        "system.prepared",
                        detail,
                    );
                }}
            />

            {#if $item.system.prepared}
                <Checkbox
                    label="Always Prepared"
                    checked={Number($item.system.prepared ?? 0) ===
                        PREPARED_STATES.ALWAYS_PREPARED}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $item,
                            "system.prepared",
                            detail ? 2 : 1,
                        );
                    }}
                />
            {/if}

            {#if $item.system.level > 0}
                <Checkbox
                    label="A5E.SpellRitual"
                    checked={$item.system.ritual}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $item,
                            "system.ritual",
                            detail,
                        );
                    }}
                />
            {/if}

            <Checkbox
                label="A5E.SpellRare"
                checked={$item.system.rare}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField($item, "system.rare", detail);
                }}
            />
        </Section>
    {:else}
        <FormSection>
            <dl class="summary-list">
                <div class="summary-list__item">
                    <dt class="summary-list__label">
                        {localize("A5E.SpellLevel")}:
                    </dt>

                    <dd class="summary-list__value">
                        {spellLevels[$item.system.level]}
                    </dd>
                </div>

                <div class="summary-list__item">
                    <dt class="summary-list__label">
                        {localize("A5E.SpellSchoolPrimary")}:
                    </dt>

                    <dd class="summary-list__value">
                        {spellSchools.primary[$item.system.schools.primary]}
                    </dd>
                </div>

                <div class="summary-list__item">
                    <dt class="summary-list__label">
                        {localize("A5E.SpellSchoolSecondaryPlural")}:
                    </dt>

                    <dd class="summary-list__value">
                        {selectedSecondarySpellSchools || localize("A5E.None")}
                    </dd>
                </div>

                <hr class="a5e-rule u-my-sm" />

                <div class="summary-list__item">
                    <dt class="summary-list__label">
                        {localize("A5E.SpellComponents")}:
                    </dt>

                    <dd class="summary-list__value">
                        {selectedSpellComponents || localize("A5E.None")}
                    </dd>
                </div>

                {#if $item.system.components.material && $item.system.materials}
                    <div class="summary-list__item">
                        <dt class="summary-list__label">
                            {localize("A5E.SpellMaterials")}:
                        </dt>

                        <dd class="summary-list__value">
                            {$item.system.materials}
                        </dd>
                    </div>
                {/if}
            </dl>
        </FormSection>
    {/if}
</Section>

<style lang="scss">
    .summary-list {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        margin: 0;
        font-size: $font-size-sm;

        &__item {
            display: flex;
            align-items: flex-start;
        }

        &__label {
            font-weight: bold;
            white-space: nowrap;
        }

        &__value {
            margin: 0;
        }
    }
</style>
