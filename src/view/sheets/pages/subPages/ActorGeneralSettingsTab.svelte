<script lang="ts">
    import { getContext } from "svelte";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let actor: any = getContext("actor");

    let automateTokenSize = game.settings.get(
        "a5e",
        "automatePrototypeTokenSize",
    ) as boolean;

    let flags = $derived(actor.reactive.flags?.a5e ?? {});
</script>

<Section heading="Sheet Customization" --a5e-section-body-gap="0.75rem">
    <FieldWrapper>
        <Checkbox
            label="A5E.settings.automatePrototypeTokenSize"
            checked={flags?.automatePrototypeTokenSize ?? automateTokenSize ?? true}
            onUpdateSelection={(checked) => {
                updateDocumentDataFromField(
                    actor,
                    "flags.a5e.automatePrototypeTokenSize",
                    checked,
                );
            }}
        />
    </FieldWrapper>

    <FieldWrapper>
        <Checkbox
            label="A5E.genericResources.hideGenericResources"
            checked={flags?.hideGenericResources ?? actor.type === "npc"}
            onUpdateSelection={(checked) => {
                updateDocumentDataFromField(
                    actor,
                    "flags.a5e.hideGenericResources",
                    checked,
                );
            }}
        />
    </FieldWrapper>

    <FieldWrapper>
        <Checkbox
            label="A5E.settings.includeAbilityModifiersForSkills"
            checked={flags?.includeAbilityModifiersForSkills ?? true}
            onUpdateSelection={(checked) => {
                updateDocumentDataFromField(
                    $actor,
                    "flags.a5e.includeAbilityModifiersForSkills",
                    checked,
                );
            }}
        />
    </FieldWrapper>

    <FieldWrapper>
        <Checkbox
            label="A5E.settings.showFavoritesSection"
            checked={flags?.showFavoritesSection ?? true}
            onUpdateSelection={(checked) => {
                updateDocumentDataFromField(
                    actor,
                    "flags.a5e.showFavoritesSection",
                    checked,
                );
            }}
        />
    </FieldWrapper>

    <FieldWrapper>
        <Checkbox
            label="A5E.settings.showManeuverTab"
            checked={flags?.showManeuverTab ?? true}
            onUpdateSelection={(checked) => {
                updateDocumentDataFromField(actor, "flags.a5e.showManeuverTab", checked);
            }}
        />
    </FieldWrapper>

    <FieldWrapper>
        <Checkbox
            label="A5E.settings.showPassiveScores"
            checked={flags?.showPassiveScores ?? true}
            onUpdateSelection={(checked) => {
                updateDocumentDataFromField(
                    actor,
                    "flags.a5e.showPassiveScores",
                    checked,
                );
            }}
        />
    </FieldWrapper>

    <FieldWrapper>
        <Checkbox
            label="A5E.settings.showSpellTab"
            checked={flags?.showSpellTab ?? true}
            onUpdateSelection={(checked) => {
                updateDocumentDataFromField(actor, "flags.a5e.showSpellTab", checked);
            }}
        />
    </FieldWrapper>

    {#if actor.type === "character"}
        <FieldWrapper>
            <Checkbox
                label="A5E.settings.showXP"
                checked={flags?.showXP ?? true}
                onUpdateSelection={(checked) => {
                    updateDocumentDataFromField(actor, "flags.a5e.showXP", checked);
                }}
            />
        </FieldWrapper>
    {/if}
</Section>

{#if actor.type === "character"}
    <Section heading="Automation Customization" --a5e-section-body-gap="0.75rem">
        <FieldWrapper>
            <Checkbox
                label="A5E.settings.automateHitDice"
                checked={flags?.automateHitDice ?? true}
                onUpdateSelection={(checked) => {
                    updateDocumentDataFromField(
                        actor,
                        "flags.a5e.automateHitDice",
                        checked,
                    );
                }}
            />
        </FieldWrapper>

        <FieldWrapper>
            <Checkbox
                label="A5E.settings.automateSpellResources"
                checked={flags?.automateSpellResources ?? true}
                onUpdateSelection={(checked) => {
                    updateDocumentDataFromField(
                        actor,
                        "flags.a5e.automateSpellResources",
                        checked,
                    );
                }}
            />
        </FieldWrapper>

        <FieldWrapper>
            <Checkbox
                label="A5E.settings.automaticallyExecuteAvailableMacros"
                checked={flags?.automaticallyExecuteAvailableMacros ?? true}
                onUpdateSelection={(checked) => {
                    updateDocumentDataFromField(
                        actor,
                        "flags.a5e.automaticallyExecuteAvailableMacros",
                        checked,
                    );
                }}
            />
        </FieldWrapper>
    </Section>
{/if}
