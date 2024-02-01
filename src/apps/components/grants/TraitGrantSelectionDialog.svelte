<script>
    import { createEventDispatcher } from "svelte";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    export let grant;
    export let base;
    export let choices;
    export let count;
    export let traitType;

    // =============================================
    // Trait choices configs
    // =============================================
    const configObject = {
        armorTypes: {
            label: "A5E.ArmorType",
            config: Object.entries(CONFIG.A5E.armor),
        },
        conditionImmunities: {
            label: "A5E.Condition",
            config: Object.entries(CONFIG.A5E.conditions),
        },
        creatureTypes: {
            label: "A5E.CreatureType",
            config: Object.entries(CONFIG.A5E.creatureTypes),
        },
        damageImmunities: {
            label: "A5E.DamageImmunity",
            config: Object.entries(CONFIG.A5E.damageTypes),
        },
        damageResistances: {
            label: "A5E.DamageResistance",
            config: Object.entries(CONFIG.A5E.damageTypes),
        },
        damageVulnerabilities: {
            label: "A5E.DamageVulnerability",
            config: Object.entries(CONFIG.A5E.damageTypes),
        },
        languages: {
            label: "A5E.Language",
            config: Object.entries(CONFIG.A5E.languages),
        },
        size: {
            label: "A5E.Size",
            config: Object.entries(CONFIG.A5E.actorSizes),
        },
        // tools: {
        //     label: "A5E.ToolPlural",
        //     config: Object.entries(
        //         CONFIG.A5E.tools
        //     ),
        // },
        // weapons: {
        //     label: "A5E.WeaponPlural",
        //     config: Object.entries(CONFIG.A5E.weapons),
        // },
    };

    function getDisabledOptions() {
        const options = [];

        if (choicesLocked) {
            options.push(
                ...Object.keys(configObject).filter(
                    (key) => !choices.includes(key) || base.includes(key),
                ),
            );
        }

        return options;
    }

    function getGrantSummary(selected) {
        // return ` This grant provides a bonus of ${bonus} to ${selected
        //     .map((s) => configObject[s])
        //     .join(", ")}.`;
        return "";
    }

    function onUpdateSelection({ detail }) {
        selected = detail;
        dispatch("updateSelection", { selected, summary });
    }

    const dispatch = createEventDispatcher();
    let choicesLocked = true;

    $: selected = [...base];
    $: remainingSelections = count - selected.length;
    $: disabledOptions = getDisabledOptions(choicesLocked, grant);
    $: summary = getGrantSummary(selected);
</script>

<Section
    heading="Trait Grant - {grant.label}"
    headerButtons={[
        {
            classes: "add-button",
            handler: () => (choicesLocked = !choicesLocked),
            htmlString: `<i class="fa-solid ${
                choicesLocked ? "fa-plus" : "fa-minus"
            }" />`,
            tooltip: choicesLocked
                ? "Locked to Grant Options"
                : "Free Selection Mode",
        },
    ]}
    --a5e-section-body-gap="0.75rem"
>
    <FieldWrapper
        warning={remainingSelections === 1
            ? `1 choice remaining`
            : `${count - selected.length} choices remaining.`}
        showWarning={selected.length < count}
        --direction="column"
    >
        <CheckboxGroup
            options={configObject[traitType]?.config}
            {selected}
            orange={choices}
            disabled={selected.length >= count}
            {disabledOptions}
            on:updateSelection={onUpdateSelection}
        />
    </FieldWrapper>

    <FieldWrapper>
        {summary}
    </FieldWrapper>
</Section>

<style lang="scss">
</style>
