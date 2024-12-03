<script>
import { getContext } from 'svelte';

import updateDocumentDataFromField from '../../../utils/updateDocumentDataFromField';

import Section from '../Section.svelte';
import FieldWrapper from '../FieldWrapper.svelte';
import RadioGroup from '../RadioGroup.svelte';
import CheckboxGroup from '../CheckboxGroup.svelte';

const item = getContext('item');
const abilities = { none: 'None', ...CONFIG.A5E.abilities };
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
                    value={$item.system.slug || $item.slug || ""}
                    type="text"
                    on:change={({ target }) => {
                        updateDocumentDataFromField(
                            $item,
                            "system.slug",
                            target.value.slugify({ strict: true }),
                        );
                    }}
                />

                <button
                    class="slug-reset-button"
                    on:click={() => updateDocumentDataFromField($item, "system.slug", "")}
                >
                    <i class="fas fa-solid fa-rotate-left" />
                </button>
            </div>
        </FieldWrapper>

        <RadioGroup
            heading="A5E Classes"
            options={Object.entries(classes)}
            selected={$item.system.class}
            allowDeselect={true}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField($item, "system.class", detail);
            }}
        />

        <RadioGroup
            heading="5E Classes"
            options={Object.entries(classes5e)}
            selected={$item.system.class}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField($item, "system.class", detail);
            }}
        />

        <FieldWrapper
            heading="Custom Class"
            hint="Enter the identifier for a custom class."
        >
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                value={$item.system.class || ""}
                on:change={({ target }) =>
                    updateDocumentDataFromField($item, "system.class", target.value)}
            />
        </FieldWrapper>
    </Section>

    <Section heading="Spell Casting" --a5e-section-body-gap="0.75rem">
        {#if !$item.parent}
            <RadioGroup
                heading="Default Spellcasting Ability"
                options={Object.entries(abilities)}
                selected={$item.system.spellcasting.ability.base}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $item,
                        "system.spellcasting.ability.options",
                        [],
                    );

                    updateDocumentDataFromField(
                        $item,
                        "system.spellcasting.ability.base",
                        detail,
                    );
                }}
            />

            <CheckboxGroup
                heading="Optional Spellcasting Abilities"
                options={Object.entries(abilitiesWithoutNone)}
                selected={$item.system.spellcasting.ability.options}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $item,
                        "system.spellcasting.ability.base",
                        "none",
                    );

                    updateDocumentDataFromField(
                        $item,
                        "system.spellcasting.ability.options",
                        detail,
                    );
                }}
            />
        {/if}

        {#if $item.parent}
            <RadioGroup
                heading="Spellcasting Ability"
                options={Object.entries(abilities)}
                selected={$item.system.spellcasting.ability.value}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.spellcasting.ability.value",
                        detail,
                    )}
            />
        {/if}

        <RadioGroup
            heading="Caster Type"
            options={Object.entries(casterTypes)}
            selected={$item.system.spellcasting.casterType}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField(
                    $item,
                    "system.spellcasting.casterType",
                    detail,
                )}
        />
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
