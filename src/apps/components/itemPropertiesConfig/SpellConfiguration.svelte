<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import objectEntriesNumberKeyConverter from "../../../utils/objectEntriesNumberKeyConverter";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";
    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Tag from "../Tag.svelte";

    function prepareSpellComponents(item) {
        return Object.entries(item.system.components)
            .filter(([_, state]) => state)
            .map(
                ([component]) =>
                    spellComponentAbbreviations[component] ?? component
            )
            .join(", ");
    }

    function prepareSecondarySpellSchools(item) {
        const schools = item.system.schools.secondary.map(
            (school) => spellSchools.secondary[school] ?? school
        );

        schools.sort((a, b) => a.localeCompare(b));

        return schools.join(", ");
    }

    const item = getContext("item");

    const {
        PREPARED_STATES,
        spellcastingCharacterClasses,
        spellComponents,
        spellComponentAbbreviations,
        spellLevels,
        spellSchools,
    } = CONFIG.A5E;

    let editMode = false;

    $: selectedSpellComponents = prepareSpellComponents($item);
    $: selectedSecondarySpellSchools = prepareSecondarySpellSchools($item);
</script>

<section>
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <header
        class="
            u-align-center
            u-flex
            u-font-serif
            u-gap-md
            u-mb-lg
            u-ml-xs
            u-pointer
            u-text-lg
            u-w-fit
        "
        on:click={() => (editMode = !editMode)}
    >
        <h3>{localize("A5E.TabSpellConfiguration")}</h3>

        <i
            class="u-text-sm fas"
            class:fa-chevron-up={editMode}
            class:fa-edit={!editMode}
        />
    </header>

    {#if editMode}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection
                heading="Classes"
                hint="Select the classes that are eligible to select this spell."
            >
                <CheckboxGroup
                    options={Object.entries(spellcastingCharacterClasses)}
                    selected={$item.system.classes}
                    on:updateSelection={(event) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.classes",
                            event.detail
                        )}
                />
            </FormSection>

            <FormSection heading="A5E.SpellLevel">
                <RadioGroup
                    options={objectEntriesNumberKeyConverter(spellLevels)}
                    selected={$item.system.level}
                    on:updateSelection={(event) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.level",
                            event.detail
                        )}
                />
            </FormSection>

            <FormSection heading="A5E.SpellSchoolPrimary">
                <RadioGroup
                    options={Object.entries(spellSchools.primary)}
                    selected={$item.system.schools.primary}
                    on:updateSelection={(event) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.schools.primary",
                            event.detail
                        )}
                />
            </FormSection>

            <FormSection heading="A5E.SpellSchoolSecondaryPlural">
                <CheckboxGroup
                    options={Object.entries(spellSchools.secondary)}
                    selected={$item.system.schools.secondary}
                    on:updateSelection={(event) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.schools.secondary",
                            event.detail
                        )}
                />
            </FormSection>

            <FormSection heading="A5E.SpellComponents">
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
                                    !$item.system.components[value]
                                )}
                        />
                    {/each}
                </ul>
            </FormSection>

            {#if $item.system.components.material}
                <FormSection heading="A5E.SpellMaterials">
                    <div class="u-w-full">
                        <input
                            class="a5e-input"
                            type="text"
                            name="system.materials"
                            value={$item.system.materials}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    target.value
                                )}
                        />
                    </div>
                </FormSection>
            {/if}

            <FormSection --gap="0.5rem 1.25rem">
                <Checkbox
                    label="A5E.SpellConcentration"
                    checked={$item.system.concentration}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $item,
                            "system.concentration",
                            detail
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
                            detail
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
                                detail ? 2 : 1
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
                                detail
                            );
                        }}
                    />
                {/if}
            </FormSection>
        </div>
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
</section>

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
