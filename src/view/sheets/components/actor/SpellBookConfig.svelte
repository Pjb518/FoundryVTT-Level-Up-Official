<script lang="ts">
    import { prepareAbilityOptions } from "#utils/view/helpers/prepareAbilityOptions.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        document: any;
        spellBookId: string;
    };

    let { document, spellBookId }: Props = $props();

    const abilityOptions = [
        ["default", "A5E.abilities.default"],
        ...prepareAbilityOptions(),
    ];

    let book = document.reactive.spellBooks.get(spellBookId);
</script>

<form>
    <Section --a5e-section-body-gap="0.75rem">
        <FieldWrapper heading="Spell Book Name">
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                spellcheck="false"
                value={book?.name || ""}
                onchange={({ currentTarget }) => {
                    updateDocumentDataFromField(
                        document,
                        `system.spellBooks.${spellBookId}.name`,
                        currentTarget.value,
                    );
                }}
            />
        </FieldWrapper>

        <FieldWrapper
            heading="Spellcasting Ability"
            hint="Spells in this spellbook will use this spellcasting ability for the purposes of spell attack roll and spell save DCs in place of the sheet default."
        >
            <RadioGroup
                allowDeselect={false}
                options={abilityOptions}
                selected={book?.ability ?? "default"}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(
                        document,
                        `system.spellBooks.${spellBookId}.ability`,
                        value,
                    )}
            />
        </FieldWrapper>

        <FieldWrapper>
            <Checkbox
                label="Show Artifact Charges"
                checked={book?.showArtifactCharges ?? false}
                onUpdateSelection={(value) => {
                    updateDocumentDataFromField(
                        document,
                        `system.spellBooks.${spellBookId}.showArtifactCharges`,
                        value,
                    );
                }}
            />
        </FieldWrapper>

        <FieldWrapper>
            <Checkbox
                label="Show Spell Inventions"
                checked={book?.showSpellInventions ?? false}
                onUpdateSelection={(value) => {
                    updateDocumentDataFromField(
                        document,
                        `system.spellBooks.${spellBookId}.showSpellInventions`,
                        value,
                    );
                }}
            />
        </FieldWrapper>

        <FieldWrapper>
            <Checkbox
                label="Show Spell Points"
                checked={book?.showSpellPoints ?? false}
                onUpdateSelection={(value) => {
                    updateDocumentDataFromField(
                        document,
                        `system.spellBooks.${spellBookId}.showSpellPoints`,
                        value,
                    );
                }}
            />
        </FieldWrapper>

        <FieldWrapper>
            <Checkbox
                label="Show Spell Slots"
                checked={book?.showSpellSlots ?? true}
                onUpdateSelection={(value) => {
                    updateDocumentDataFromField(
                        document,
                        `system.spellBooks.${spellBookId}.showSpellSlots`,
                        value,
                    );
                }}
            />
        </FieldWrapper>

        <FieldWrapper
            hint="When enabled, resource consumers for spell slots and points will be ignored by default. This is useful for things like ritual books, where you're rarely if ever going to want to consume a spell slot."
        >
            <Checkbox
                label="Disable Spell Consumers"
                checked={book?.disableSpellConsumers ?? false}
                onUpdateSelection={(value) => {
                    updateDocumentDataFromField(
                        document,
                        `system.spellBooks.${spellBookId}.disableSpellConsumers`,
                        value,
                    );
                }}
            />
        </FieldWrapper>
    </Section>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
    }
</style>
