<script>
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    $: flags = $actor.flags?.a5e ?? {};
</script>

<section class="a5e-page-wrapper a5e-page-wrapper--settings">
    <div class="a5e-section a5e-section--settings">
        <header class="a5e-section-header">
            <h3 class="a5e-section-header__heading">Sheet Customization</h3>
        </header>

        <FormSection --background="transparent" --padding="0.25rem">
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
        </FormSection>

        <FormSection --background="transparent" --padding="0.25rem">
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
        </FormSection>

        <FormSection --background="transparent" --padding="0.25rem">
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
        </FormSection>

        <FormSection --background="transparent" --padding="0.25rem">
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
        </FormSection>

        <FormSection --background="transparent" --padding="0.25rem">
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
        </FormSection>

        <FormSection --background="transparent" --padding="0.25rem">
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
        </FormSection>

        {#if $actor.type === "character"}
            <FormSection --background="transparent" --padding="0.25rem">
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
            </FormSection>
        {/if}
    </div>
</section>
