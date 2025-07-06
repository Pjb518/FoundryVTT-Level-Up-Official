<script lang="ts">
    import { getContext } from "svelte";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        reload?: boolean;
    };

    let { reload = $bindable() }: Props = $props();

    let settings: Record<string, { data: any; value: any }> =
        getContext("settings");
    let updates: Map<string, any> = getContext("updates");

    let deathSaves = $derived(settings["5eStyleDeathSaves"].value);
    let exhaustion = $derived(settings["replaceFatigueAndStrife"].value);
    let expertise = $derived(settings["5eStyleExpertise"].value);
    let jackOfAllTrades = $derived(settings["5eStyleJackOfAllTrades"].value);
    let hideA5eSkills = $derived(settings["hideA5eSkills"].value);
    let hideBrokenAndDamaged = $derived(settings["hideBrokenAndDamaged"].value);
    let hideExpertiseDice = $derived(settings["hideExpertiseDice"].value);
    let hideSkillCriticalPrompt = $derived(
        settings["hideSkillCriticalPrompt"].value,
    );
    let hideSkillSpecialties = $derived(settings["hideSkillSpecialties"].value);
    let simpleInitiative = $derived(settings["simpleInitiative"].value);
    let simpleRests = $derived(settings["simpleRests"].value);
</script>

<Section
    heading="A5E.settings.sectionHeader.actorBehavior"
    --a5e-section-body-gap="0.5rem"
>
    <FieldWrapper hint="A5E.settings.hints.5eStyleDeathSaves">
        <Checkbox
            label="A5E.settings.5eStyleDeathSaves"
            checked={updates.get("5eStyleDeathSaves") ?? deathSaves ?? false}
            onUpdateSelection={(detail) => {
                updates.set("5eStyleDeathSaves", detail);
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.5eStyleExpertise">
        <Checkbox
            label="A5E.settings.5eStyleExpertise"
            checked={updates.get("5eStyleExpertise") ?? expertise ?? false}
            onUpdateSelection={(detail) => {
                updates.set("5eStyleExpertise", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.5eStyleJackOfAllTrades">
        <Checkbox
            label="A5E.settings.5eStyleJackOfAllTrades"
            checked={updates.get("5eStyleJackOfAllTrades") ??
                jackOfAllTrades ??
                false}
            onUpdateSelection={(detail) => {
                updates.set("5eStyleJackOfAllTrades", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.hideA5eSkills">
        <Checkbox
            label="A5E.settings.hideA5eSkills"
            checked={updates.get("hideA5eSkills") ?? hideA5eSkills ?? false}
            onUpdateSelection={(detail) => {
                updates.set("hideA5eSkills", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.hideExpertiseDice">
        <Checkbox
            label="A5E.settings.hideExpertiseDice"
            checked={updates.get("hideExpertiseDice") ??
                hideExpertiseDice ??
                false}
            onUpdateSelection={(detail) => {
                updates.set("hideExpertiseDice", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.hideSkillCriticalPrompt">
        <Checkbox
            label="A5E.settings.hideSkillCriticalPrompt"
            checked={updates.get("hideSkillCriticalPrompt") ??
                hideSkillCriticalPrompt ??
                false}
            onUpdateSelection={(detail) => {
                updates.set("hideSkillCriticalPrompt", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.hideSkillSpecialties">
        <Checkbox
            label="A5E.settings.hideSkillSpecialties"
            checked={updates.get("hideSkillSpecialties") ??
                hideSkillSpecialties ??
                false}
            onUpdateSelection={(detail) => {
                updates.set("hideSkillSpecialties", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.replaceFatigueAndStrife">
        <Checkbox
            label="A5E.settings.replaceFatigueAndStrife"
            checked={updates.get("replaceFatigueAndStrife") ??
                exhaustion ??
                false}
            onUpdateSelection={(detail) => {
                updates.set("replaceFatigueAndStrife", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.simpleInitiative">
        <Checkbox
            label="A5E.settings.simpleInitiative"
            checked={updates.get("simpleInitiative") ??
                simpleInitiative ??
                false}
            onUpdateSelection={(detail) => {
                updates.set("simpleInitiative", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.simpleRests">
        <Checkbox
            label="A5E.settings.simpleRests"
            checked={updates.get("simpleRests") ?? simpleRests ?? false}
            onUpdateSelection={(detail) => {
                updates.set("simpleRests", detail);
                reload = true;
            }}
        />
    </FieldWrapper>
</Section>

<Section
    heading="A5E.settings.sectionHeader.sheetSettings"
    --a5e-section-body-gap="0.5rem"
>
    <FieldWrapper hint="A5E.settings.hints.hideBrokenAndDamaged">
        <Checkbox
            label="A5E.settings.hideBrokenAndDamaged"
            checked={updates.get("hideBrokenAndDamaged") ??
                hideBrokenAndDamaged ??
                false}
            onUpdateSelection={(detail) => {
                updates.set("hideBrokenAndDamaged", detail);
            }}
        />
    </FieldWrapper>
</Section>
