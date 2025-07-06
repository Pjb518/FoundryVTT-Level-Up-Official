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

    let settings: Record<string, { data: any; value: any }> =
        getContext("settings");
    let updates: Map<string, any> = getContext("updates");

    const isGM = game.user!.isGM;

    const actionTypeOptions = [
        ["system", "System Defined"],
        ["action", "New Action"],
        ["item", "Item Name"],
    ];

    // Stores
    let actionNameType = $derived(settings["newActionNameType"].value);
    let fancySheetsAutoApply = $derived(settings["autoApplyFancySheets"].value);
    let gamemasterTitle = $derived(settings["gamemasterTitle"].value);
    let showLimitedDesc = $derived(
        settings["showDescriptionOnLimitedPerms"].value,
    );
    let cascadingDamageAndHealingDelay = $derived(
        settings["cascadingDamageAndHealingDelay"].value,
    );
    let enableCascadingDamageAndHealing = $derived(
        settings["enableCascadingDamageAndHealing"].value,
    );

    let newCascadingDamageAndHealingDelay = $derived(
        updates.get("cascadingDamageAndHealingDelay") ??
            cascadingDamageAndHealingDelay,
    );

    let selectedNamingMode = $derived(
        updates.get("newActionNameType") ?? actionNameType ?? "system",
    );

    let selectedGamemasterTitle = $derived(
        updates.get("gamemasterTitle") ?? gamemasterTitle,
    );
</script>

{#if isGM}
    <Section heading="Sheet Settings" --a5e-section-body-gap="0.5rem">
        <FieldWrapper hint="A5E.settings.hints.showDescriptionOnLimitedPerms">
            <Checkbox
                label="A5E.settings.showDescriptionOnLimitedPerms"
                checked={updates.get("showDescriptionOnLimitedPerms") ??
                    showLimitedDesc ??
                    false}
                onUpdateSelection={(detail) => {
                    updates.set("showDescriptionOnLimitedPerms", detail);
                    reload = true;
                }}
            />
        </FieldWrapper>

        <RadioGroup
            hint="A5E.settings.hints.newActionNameType"
            options={actionTypeOptions}
            selected={selectedNamingMode}
            onUpdateSelection={(detail) => {
                updates.set("newActionNameType", detail);
                selectedNamingMode = detail;
            }}
        />

        <FieldWrapper hint="A5E.settings.hints.autoApplyFancySheets">
            <Checkbox
                label="A5E.settings.autoApplyFancySheets"
                checked={updates.get("autoApplyFancySheets") ??
                    fancySheetsAutoApply ??
                    false}
                onUpdateSelection={(detail) => {
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
                    enableCascadingDamageAndHealing ??
                    false}
                onUpdateSelection={(detail) => {
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
                class="a5e-input a5e-input--small 5ae-input--slim"
                type="number"
                value={newCascadingDamageAndHealingDelay}
                onchange={({ currentTarget }) => {
                    const { value } = currentTarget;

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
                class="a5e-input 5ae-input--slim"
                type="text"
                value={selectedGamemasterTitle}
                onchange={({ currentTarget }) => {
                    updates.set(
                        "gamemasterTitle",
                        currentTarget.value?.trim?.() ?? "",
                    );
                    reload = true;
                }}
            />
        </FieldWrapper>
    </Section>
{/if}
