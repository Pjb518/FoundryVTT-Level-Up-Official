<script>
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    $: flags = $actor.flags?.a5e ?? {};
</script>

<Section heading="Sheet Customization" --a5e-section-body-gap="0.75rem">
    <FieldWrapper>
        <Checkbox
            label="A5E.HideGenericResources"
            checked={flags?.hideGenericResources ?? $actor.type === "npc"}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    "flags.a5e.hideGenericResources",
                    detail,
                );
            }}
        />
    </FieldWrapper>

    <FieldWrapper>
        <Checkbox
            label="A5E.settings.includeAbilityModifiersForSkills"
            checked={flags?.includeAbilityModifiersForSkills ??
                $actor.type === "npc"}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    "flags.a5e.includeAbilityModifiersForSkills",
                    detail,
                );
            }}
        />
    </FieldWrapper>

    <FieldWrapper>
        <Checkbox
            label="A5E.settings.showFavoritesSection"
            checked={flags?.showFavoritesSection ?? true}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    "flags.a5e.showFavoritesSection",
                    detail,
                );
            }}
        />
    </FieldWrapper>

    <FieldWrapper>
        <Checkbox
            label="A5E.settings.showManeuverTab"
            checked={flags?.showManeuverTab ?? true}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    "flags.a5e.showManeuverTab",
                    detail,
                );
            }}
        />
    </FieldWrapper>

    <FieldWrapper>
        <Checkbox
            label="A5E.settings.showPassiveScores"
            checked={flags?.showPassiveScores ?? true}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    "flags.a5e.showPassiveScores",
                    detail,
                );
            }}
        />
    </FieldWrapper>

    <FieldWrapper>
        <Checkbox
            label="A5E.settings.showSpellTab"
            checked={flags?.showSpellTab ?? true}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    "flags.a5e.showSpellTab",
                    detail,
                );
            }}
        />
    </FieldWrapper>

    {#if $actor.type === "character"}
        <FieldWrapper>
            <Checkbox
                label="A5E.settings.showXP"
                checked={flags?.showXP ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.showXP",
                        detail,
                    );
                }}
            />
        </FieldWrapper>
    {/if}
</Section>
