<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import Checkbox from "../components/Checkbox.svelte";
    import FormSection from "../components/LegacyFormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    export let { document, appId } = getContext("#external").application;

    const actor = document;
    const { abilityAbbreviations, spellLevels } = CONFIG.A5E;

    $: flags = $actor.flags.a5e;
</script>

<article>
    <RadioGroup
        heading="A5E.SpellcastingAbilityScore"
        optionStyles="min-width:2rem; text-align: center;"
        options={Object.entries(abilityAbbreviations)}
        selected={$actor.system.attributes.spellcasting}
        on:updateSelection={(event) =>
            updateDocumentDataFromField(
                $actor,
                "system.attributes.spellcasting",
                event.detail,
            )}
    />

    <FormSection heading="A5E.SpellDCBonus">
        <div class="u-w-full">
            <input
                class="a5e-input"
                type="text"
                name="system.bonuses.spellDC"
                value={$actor.system.bonuses.spellDC}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value,
                    )}
            />
        </div>
    </FormSection>

    <FormSection --gap="0.5rem 1.25rem">
        <Checkbox
            label="A5E.SpellShowSpellSlots"
            checked={flags.showSpellSlots ?? true}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    "flags.a5e.showSpellSlots",
                    detail,
                );
            }}
        />

        <Checkbox
            label="A5E.SpellShowSpellPoints"
            checked={flags.showSpellPoints ?? false}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    "flags.a5e.showSpellPoints",
                    detail,
                );
            }}
        />
    </FormSection>

    {#if flags.showSpellPoints ?? false}
        <FormSection>
            <Checkbox
                label="A5E.settings.restoreSpellPointsOnShortRest"
                checked={flags.restoreSpellPointsOnShortRest ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.restoreSpellPointsOnShortRest",
                        detail,
                    );
                }}
            />
        </FormSection>
    {/if}

    <FormSection>
        <Checkbox
            label="A5E.settings.restoreSpellSlotsOnShortRest"
            checked={flags.restoreSpellSlotsOnShortRest ?? false}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    "flags.a5e.restoreSpellSlotsOnShortRest",
                    detail,
                );
            }}
        />
    </FormSection>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
        overflow: auto;
        background: $color-sheet-background;
    }
</style>
