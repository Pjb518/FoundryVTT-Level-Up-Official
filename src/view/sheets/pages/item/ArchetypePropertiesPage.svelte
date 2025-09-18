<script lang="ts">
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Section from "#view/snippets/Section.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";

    const item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);

    const abilities = { none: "None", ...CONFIG.A5E.abilities };
    const abilitiesWithoutNone = CONFIG.A5E.abilities;
    const { casterTypes, classes, classes5e } = CONFIG.A5E;
</script>

<article class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <Section heading="Metadata" --a5e-section-body-gap="0.75rem">
        <FieldWrapper
            heading="Sub Class Identifier"
            --a5e-field-wrapper-header-item-justification="flex-start"
            --a5e-field-wrapper-header-gap="0.5rem"
        >
            <div style="display: flex; gap: 0.5rem">
                <input
                    class="a5e-input a5e-input--slim slug-input"
                    value={itemStore.slug || item.slug || ""}
                    type="text"
                    onchange={({ currentTarget }) => {
                        updateDocumentDataFromField(
                            item,
                            "system.slug",
                            currentTarget.value.slugify({ strict: true }),
                        );
                    }}
                />

                <button
                    class="slug-reset-button"
                    data-tooltoip="Reset Identifier"
                    aria-label="Reset Identifier"
                    onclick={() =>
                        updateDocumentDataFromField(item, "system.slug", "")}
                >
                    <i class="icon fas fa-solid fa-rotate-left"></i>
                </button>
            </div>
        </FieldWrapper>

        <RadioGroup
            heading="A5E Classes"
            options={Object.entries(classes)}
            selected={itemStore.class}
            allowDeselect={true}
            onUpdateSelection={(detail) => {
                updateDocumentDataFromField(item, "system.class", detail);
            }}
        />

        <RadioGroup
            heading="5E Classes"
            options={Object.entries(classes5e)}
            selected={itemStore.class}
            onUpdateSelection={(detail) => {
                updateDocumentDataFromField(item, "system.class", detail);
            }}
        />

        <FieldWrapper
            heading="Custom Class"
            hint="Enter the identifier for a custom class."
        >
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                value={itemStore.class || ""}
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        item,
                        "system.class",
                        currentTarget.value,
                    )}
            />
        </FieldWrapper>
    </Section>

    <Section heading="Spell Casting" --a5e-section-body-gap="0.75rem">
        {#if !item.parent}
            <RadioGroup
                heading="Default Spellcasting Ability"
                options={Object.entries(abilities)}
                selected={itemStore.spellcasting.ability.base}
                onUpdateSelection={(detail) => {
                    updateDocumentDataFromField(
                        item,
                        "system.spellcasting.ability.options",
                        [],
                    );

                    updateDocumentDataFromField(
                        item,
                        "system.spellcasting.ability.base",
                        detail,
                    );
                }}
            />

            <CheckboxGroup
                heading="Optional Spellcasting Abilities"
                options={Object.entries(abilitiesWithoutNone)}
                selected={itemStore.spellcasting.ability.options}
                onUpdateSelection={(detail) => {
                    updateDocumentDataFromField(
                        item,
                        "system.spellcasting.ability.base",
                        "none",
                    );

                    updateDocumentDataFromField(
                        item,
                        "system.spellcasting.ability.options",
                        detail,
                    );
                }}
            />
        {/if}

        {#if item.parent}
            <RadioGroup
                heading="Spellcasting Ability"
                options={Object.entries(abilities)}
                selected={itemStore.spellcasting.ability.value}
                onUpdateSelection={(detail) =>
                    updateDocumentDataFromField(
                        item,
                        "system.spellcasting.ability.value",
                        detail,
                    )}
            />
        {/if}

        <RadioGroup
            heading="Caster Type"
            options={Object.entries(casterTypes)}
            selected={itemStore.spellcasting.casterType}
            onUpdateSelection={(detail) =>
                updateDocumentDataFromField(
                    item,
                    "system.spellcasting.casterType",
                    detail,
                )}
        />

        {#if itemStore.spellcasting.casterType !== "none"}
            <FieldWrapper
                heading="Spell Prepared Max Formula"
                hint="If this class does not have a maximum to prepared spells, leave at 0."
                --a5e-field-wrapper-header-gap="0.5rem"
            >
                <input
                    type="text"
                    value={itemStore.spellcasting.maxPreparedFormula}
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            item,
                            "system.spellcasting.maxPreparedFormula",
                            currentTarget.value,
                        )}
                />
            </FieldWrapper>
        {/if}
    </Section>
</article>

<style lang="scss">
    .slug-reset-button {
        background: none;
        border: 0;
        padding: 0;
        width: fit-content;
        height: fit-content;
        color: rgba(0 0 0 / 0.2);
        transition: var(--a5e-transition-standard);

        &:hover,
        &:focus {
            box-shadow: none;
            transform: scale(1.2);
            color: rgba(0 0 0 / 1);
        }
    }

    .slug-input {
        width: 95%;
    }
</style>
