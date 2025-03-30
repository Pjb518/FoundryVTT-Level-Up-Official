<script>
    import { getContext } from "svelte";

    import prepareAbilityOptions from "../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import Checkbox from "../components/Checkbox.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import Section from "../components/Section.svelte";

    export let document;
    export let appId;
    export let spellBookId;

    const abilityOptions = [
        ["default", "A5E.abilities.default"],
        ...prepareAbilityOptions(),
    ];

    $: book = $document.spellBooks?.get(spellBookId);
</script>

<form>
    <Section --a5e-section-body-gap="0.75rem">
        <FieldWrapper heading="Spell Book Name">
            <input
                type="text"
                spellcheck="false"
                value={book?.name || ""}
                on:change={({ target }) => {
                    updateDocumentDataFromField(
                        $document,
                        `system.spellBooks.${spellBookId}.name`,
                        target.value,
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
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $document,
                        `system.spellBooks.${spellBookId}.ability`,
                        detail,
                    )}
            />
        </FieldWrapper>

        <FieldWrapper>
            <Checkbox
                label="Show Artifact Charges"
                checked={book?.showArtifactCharges ?? false}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $document,
                        `system.spellBooks.${spellBookId}.showArtifactCharges`,
                        detail,
                    );
                }}
            />
        </FieldWrapper>

        <FieldWrapper>
            <Checkbox
                label="Show Spell Inventions"
                checked={book?.showSpellInventions ?? false}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $document,
                        `system.spellBooks.${spellBookId}.showSpellInventions`,
                        detail,
                    );
                }}
            />
        </FieldWrapper>

        <FieldWrapper>
            <Checkbox
                label="Show Spell Points"
                checked={book?.showSpellPoints ?? false}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $document,
                        `system.spellBooks.${spellBookId}.showSpellPoints`,
                        detail,
                    );
                }}
            />
        </FieldWrapper>

        <FieldWrapper>
            <Checkbox
                label="Show Spell Slots"
                checked={book?.showSpellSlots ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $document,
                        `system.spellBooks.${spellBookId}.showSpellSlots`,
                        detail,
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
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $document,
                        `system.spellBooks.${spellBookId}.disableSpellConsumers`,
                        detail,
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
