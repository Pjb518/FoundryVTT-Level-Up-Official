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

    const actionTypeOptions = [
        ["system", "System Defined"],
        ["action", "New Action"],
        ["item", "Item Name"],
    ];

    // Stores
    let actionNameType = settings.getStore("newActionNameType");
    let fancySheetsAutoApply = settings.getStore("autoApplyFancySheets");
    let gamemasterTitle = settings.getStore("gamemasterTitle");
    let showLimitedDesc = settings.getStore("showDescriptionOnLimitedPerms");

    let cascadingDamageAndHealingDelay = settings.getStore(
        "cascadingDamageAndHealingDelay",
    );

    let enableCascadingDamageAndHealing = settings.getStore(
        "enableCascadingDamageAndHealing",
    );

    let newCascadingDamageAndHealingDelay =
        updates.get("cascadingDamageAndHealingDelay") ??
        $cascadingDamageAndHealingDelay;

    let selectedNamingMode =
        updates.get("newActionNameType") ?? $actionNameType ?? "system";

    let selectedGamemasterTitle =
        updates.get("gamemasterTitle") ?? $gamemasterTitle;
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

    <Section heading="Cascading Damage Settings">
        <FieldWrapper hint="A5E.settings.hints.enableCascadingDamageAndHealing">
            <Checkbox
                label="A5E.settings.enableCascadingDamageAndHealing"
                checked={updates.get("enableCascadingDamageAndHealing") ??
                    $enableCascadingDamageAndHealing ??
                    false}
                on:updateSelection={({ detail }) => {
                    updates.set("enableCascadingDamageAndHealing", detail);
                    reload = true;
                }}
            />
        </FieldWrapper>

        <FieldWrapper
            heading="A5E.settings.cascadingDamageAndHealingDelay"
            hint="A5E.settings.hints.cascadingDamageAndHealingDelay"
        >
            <input
                type="number"
                value={newCascadingDamageAndHealingDelay}
                on:change={({ target }) => {
                    const { value } = target;

                    newCascadingDamageAndHealingDelay = Number(value);

                    updates.set(
                        "cascadingDamageAndHealingDelay",
                        Number(value),
                    );
                }}
            />
        </FieldWrapper>
    </Section>

    <Section heading="Other Settings">
        <FieldWrapper heading="Gamemaster Title">
            <input
                type="text"
                value={selectedGamemasterTitle}
                on:change={({ target }) => {
                    updates.set(
                        "gamemasterTitle",
                        target.value?.trim?.() ?? "",
                    );
                    reload = true;
                }}
            />
        </FieldWrapper>
    </Section>
{/if}
