<script lang="ts">
    import { getContext } from "svelte";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        reload?: boolean;
    };

    let { reload = $bindable() }: Props = $props();

    let settings: Record<string, { data: any; value: any }> = getContext("settings");
    let updates: Map<string, any> = getContext("updates");

    const isGM = game.user!.isGM;

    let skillListFlowDirectionChoices = settings.skillListFlowDirection.data.choices;

    // Stores
    let trackCurrency = $derived(settings["currencyWeight"].value);
    let randomHP = $derived(settings["randomizeNPCHitPoints"].value);
    let automateTokenSize = $derived(settings["automatePrototypeTokenSize"].value);
    let blindDeathSaves = $derived(settings["blindDeathSaves"].value);
    let hideActionList = $derived(settings["collapseActionList"].value);
    let hideDeleteDialog = $derived(settings["hideDeleteConfirmation"].value);
    let hideCompendiumSelection = $derived(
        settings["hideActorCompendiumSelectionDialog"].value,
    );
    let maxInspiration = $derived(settings["maxInspiration"].value);
    let rightClickConfig = $derived(settings["itemRightClickConfigure"].value);
    let reverseAlt = $derived(settings["reverseAltBehavior"].value);
    let reverseInitAlt = $derived(settings["reverseInitiativeAltBehavior"].value);
    let skillListFlowDirection = $derived(settings["skillListFlowDirection"].value);
    let useNPCPassive = $derived(
        settings["useNPCExpertisePassiveRulesForCharacters"].value,
    );

    let selectedSkillListFlowDirection = $derived(
        updates.get("skillListFlowDirection") ?? skillListFlowDirection,
    );
</script>

<section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    {#if isGM}
        <Section
            heading="A5E.settings.sectionHeader.actorBehavior"
            --a5e-section-body-gap="0.5rem"
        >
            {#if isGM}
                <FieldWrapper hint="A5E.settings.hints.automatePrototypeTokenSize">
                    <Checkbox
                        label="A5E.settings.automatePrototypeTokenSize"
                        checked={updates.get("automatePrototypeTokenSize") ??
                            automateTokenSize}
                        onUpdateSelection={(detail) => {
                            updates.set("automatePrototypeTokenSize", detail);
                        }}
                    />
                </FieldWrapper>
            {/if}

            {#if isGM}
                <FieldWrapper hint="A5E.settings.hints.blindDeathSaves">
                    <Checkbox
                        label="A5E.settings.blindDeathSaves"
                        checked={updates.get("blindDeathSaves") ?? blindDeathSaves}
                        onUpdateSelection={(detail) => {
                            updates.set("blindDeathSaves", detail);
                            reload = true;
                        }}
                    />
                </FieldWrapper>
            {/if}

            {#if isGM}
                <FieldWrapper hint="A5E.settings.hints.trackCurrencyWeight">
                    <Checkbox
                        label="A5E.settings.trackCurrencyWeight"
                        checked={updates.get("currencyWeight") ?? trackCurrency ?? false}
                        onUpdateSelection={(detail) => {
                            updates.set("currencyWeight", detail);
                        }}
                    />
                </FieldWrapper>
            {/if}

            {#if isGM}
                <FieldWrapper hint="A5E.settings.hints.randomizeNPCHitPoints">
                    <Checkbox
                        label="A5E.settings.randomizeNPCHitPoints"
                        checked={updates.get("randomizeNPCHitPoints") ??
                            randomHP ??
                            false}
                        onUpdateSelection={(detail) => {
                            updates.set("randomizeNPCHitPoints", detail);
                        }}
                    />
                </FieldWrapper>
            {/if}

            {#if isGM}
                <FieldWrapper
                    hint="A5E.settings.hints.useNPCExpertisePassiveRulesForCharacters"
                >
                    <Checkbox
                        label="A5E.settings.useNPCExpertisePassiveRulesForCharacters"
                        checked={updates.get(
                            "useNPCExpertisePassiveRulesForCharacters",
                        ) ??
                            useNPCPassive ??
                            false}
                        onUpdateSelection={(detail) => {
                            updates.set(
                                "useNPCExpertisePassiveRulesForCharacters",
                                detail,
                            );
                            reload = true;
                        }}
                    />
                </FieldWrapper>
            {/if}
        </Section>
    {/if}

    <Section
        heading="A5E.settings.sectionHeader.sheetSettings"
        --a5e-section-body-gap="0.5rem"
    >
        <FieldWrapper hint="A5E.settings.hints.collapseActionList">
            <Checkbox
                label="A5E.settings.collapseActionList"
                checked={updates.get("collapseActionList") ?? hideActionList ?? false}
                onUpdateSelection={(detail) => updates.set("collapseActionList", detail)}
            />
        </FieldWrapper>

        <FieldWrapper hint="A5E.settings.hints.hideDeletionConfirmationDialog">
            <Checkbox
                label="A5E.settings.hideDeletionConfirmationDialog"
                checked={updates.get("hideDeleteConfirmation") ??
                    hideDeleteDialog ??
                    false}
                onUpdateSelection={(detail) =>
                    updates.set("hideDeleteConfirmation", detail)}
            />
        </FieldWrapper>

        <FieldWrapper hint="A5E.settings.hints.hideActorCompendiumSelectionDialog">
            <Checkbox
                label="A5E.settings.hideActorCompendiumSelectionDialog"
                checked={updates.get("hideActorCompendiumSelectionDialog") ??
                    hideCompendiumSelection ??
                    false}
                onUpdateSelection={(detail) =>
                    updates.set("hideActorCompendiumSelectionDialog", detail)}
            />
        </FieldWrapper>

        <FieldWrapper hint="A5E.settings.hints.itemRightClickConfigure">
            <Checkbox
                label="A5E.settings.itemRightClickConfigure"
                checked={updates.get("itemRightClickConfigure") ??
                    rightClickConfig ??
                    false}
                onUpdateSelection={(detail) =>
                    updates.set("itemRightClickConfigure", detail)}
            />
        </FieldWrapper>

        <FieldWrapper hint="A5E.settings.hints.reverseAltBehavior">
            <Checkbox
                label="A5E.settings.reverseAltBehavior"
                checked={updates.get("reverseAltBehavior") ?? reverseAlt ?? false}
                onUpdateSelection={(detail) => updates.set("reverseAltBehavior", detail)}
            />
        </FieldWrapper>

        <FieldWrapper hint="A5E.settings.hints.reverseInitiativeAltBehavior">
            <Checkbox
                label="A5E.settings.reverseInitiativeAltBehavior"
                checked={updates.get("reverseInitiativeAltBehavior") ??
                    reverseInitAlt ??
                    false}
                onUpdateSelection={(detail) =>
                    updates.set("reverseInitiativeAltBehavior", detail)}
            />
        </FieldWrapper>

        <RadioGroup
            heading="A5E.settings.skillListFlowDirection"
            hint="A5E.settings.hints.skillListFlowDirection"
            options={Object.entries(skillListFlowDirectionChoices)}
            selected={selectedSkillListFlowDirection}
            onUpdateSelection={(detail) => {
                updates.set("skillListFlowDirection", detail);
                selectedSkillListFlowDirection = detail;
                reload = true;
            }}
        />

        <FieldWrapper
            heading="A5E.settings.maxInspiration"
            --a5e-field-wrapper-gap="0.375rem 1rem"
            --a5e-field-wrapper-direction="row"
            --a5e-field-wrapper-header-width="100%"
            hint="A5E.settings.hints.maxInspiration"
        >
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                value={maxInspiration}
                onchange={({ currentTarget }) => {
                    const { value } = currentTarget;
                    maxInspiration = Math.max(Number(value), 1);
                    updates.set("maxInspiration", maxInspiration);
                }}
            />
        </FieldWrapper>
    </Section>
</section>
