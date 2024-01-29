<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import FormSection from "../components/LegacyFormSection.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import Section from "../components/Section.svelte";

    export let reload;

    const settings = getContext("settings");
    const updates = getContext("updates");

    const isGM = game.user.isGM;

    const actionTypeOptions = [
        ["system", "System Defined"],
        ["action", "New Action"],
        ["item", "Item Name"],
    ];

    // Stores
    let actionNameType = settings.getStore("newActionNameType");
    let showLimitedDesc = settings.getStore("showDescriptionOnLimitedPerms");
    let fancySheetsAutoApply = settings.getStore("autoApplyFancySheets");

    let selectedNamingMode =
        updates.get("newActionNameType") ?? $actionNameType ?? "system";
</script>

{#if isGM}
    <Section heading="Sheet Settings" --a5e-section-body-gap="0.5rem">
        <FieldWrapper hint="A5E.settings.hints.showDescriptionOnLimitedPerms">
            <Checkbox
                label="A5E.settings.showDescriptionOnLimitedPerms"
                checked={updates.get("showDescriptionOnLimitedPerms") ??
                    $showLimitedDesc ??
                    false}
                on:updateSelection={({ detail }) => {
                    updates.set("showDescriptionOnLimitedPerms", detail);
                    reload = true;
                }}
            />
        </FieldWrapper>

        <RadioGroup
            hint="A5E.settings.hints.newActionNameType"
            options={actionTypeOptions}
            selected={selectedNamingMode}
            on:updateSelection={({ detail }) => {
                updates.set("newActionNameType", detail);
                selectedNamingMode = detail;
            }}
        />

        <FieldWrapper hint="A5E.settings.hints.autoApplyFancySheets">
            <Checkbox
                label="A5E.settings.autoApplyFancySheets"
                checked={updates.get("autoApplyFancySheets") ??
                    $fancySheetsAutoApply ??
                    false}
                on:updateSelection={({ detail }) => {
                    updates.set("autoApplyFancySheets", detail);
                    reload = true;
                }}
            />
        </FieldWrapper>
    </Section>
{/if}
