<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import Section from "../components/Section.svelte";

    export let reload;

    const settings = getContext("settings");
    const updates = getContext("updates");

    const isGM = game.user.isGM;

    const skillListFlowDirectionChoices = game.settings.settings.get(
        "a5e.skillListFlowDirection",
    ).choices;

    // Stores
    let trackCurrency = settings.getStore("currencyWeight");
    let randomHP = settings.getStore("randomizeNPCHitPoints");

    let automateTokenSize = settings.getStore("automatePrototypeTokenSize");
    let blindDeathSaves = settings.getStore("blindDeathSaves");
    let hideActionList = settings.getStore("collapseActionList");
    let hideDeleteDialog = settings.getStore("hideDeleteConfirmation");
    let rightClickConfig = settings.getStore("itemRightClickConfigure");
    let reverseAlt = settings.getStore("reverseAltBehavior");
    let reverseInitAlt = settings.getStore("reverseInitiativeAltBehavior");
    let skillListFlowDirection = settings.getStore("skillListFlowDirection");

    let selectedSkillListFlowDirection =
        updates.get("skillListFlowDirection") ?? $skillListFlowDirection;
</script>

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
                        $automateTokenSize}
                    on:updateSelection={({ detail }) => {
                        updates.set("automatePrototypeTokenSize", detail);
                    }}
                />
            </FieldWrapper>
        {/if}

        {#if isGM}
            <FieldWrapper hint="A5E.settings.hints.blindDeathSaves">
                <Checkbox
                    label="A5E.settings.blindDeathSaves"
                    checked={updates.get("blindDeathSaves") ?? $blindDeathSaves}
                    on:updateSelection={({ detail }) => {
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
                    checked={updates.get("currencyWeight") ??
                        $trackCurrency ??
                        false}
                    on:updateSelection={({ detail }) => {
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
                        $randomHP ??
                        false}
                    on:updateSelection={({ detail }) => {
                        updates.set("randomizeNPCHitPoints", detail);
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
            checked={updates.get("collapseActionList") ??
                $hideActionList ??
                false}
            on:updateSelection={({ detail }) =>
                updates.set("collapseActionList", detail)}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.hideDeletionConfirmationDialog">
        <Checkbox
            label="A5E.settings.hideDeletionConfirmationDialog"
            checked={updates.get("hideDeleteConfirmation") ??
                $hideDeleteDialog ??
                false}
            on:updateSelection={({ detail }) =>
                updates.set("hideDeleteConfirmation", detail)}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.itemRightClickConfigure">
        <Checkbox
            label="A5E.settings.itemRightClickConfigure"
            checked={updates.get("itemRightClickConfigure") ??
                $rightClickConfig ??
                false}
            on:updateSelection={({ detail }) =>
                updates.set("itemRightClickConfigure", detail)}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.reverseAltBehavior">
        <Checkbox
            label="A5E.settings.reverseAltBehavior"
            checked={updates.get("reverseAltBehavior") ?? $reverseAlt ?? false}
            on:updateSelection={({ detail }) =>
                updates.set("reverseAltBehavior", detail)}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.reverseInitiativeAltBehavior">
        <Checkbox
            label="A5E.settings.reverseInitiativeAltBehavior"
            checked={updates.get("reverseInitiativeAltBehavior") ??
                $reverseInitAlt ??
                false}
            on:updateSelection={({ detail }) =>
                updates.set("reverseInitiativeAltBehavior", detail)}
        />
    </FieldWrapper>

    <!-- svelte-ignore missing-declaration -->
    <RadioGroup
        heading="Skill List Flow Direction"
        hint={game.settings.settings.get("a5e.skillListFlowDirection").hint}
        options={Object.entries(skillListFlowDirectionChoices)}
        selected={selectedSkillListFlowDirection}
        on:updateSelection={({ detail }) => {
            updates.set("skillListFlowDirection", detail);
            selectedSkillListFlowDirection = detail;
            reload = true;
        }}
    />
</Section>
