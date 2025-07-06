<script lang="ts">
    import { getContext } from "svelte";

    import SettingsCustomIcon from "./SettingsCustomIcon.svelte";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import Checkbox from "#view/snippets/Checkbox.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        reload?: boolean;
    };

    function getCustomIcons() {
        return Object.entries(conditionIconsDefault).reduce(
            (acc, [key, path]) => {
                acc[key] =
                    updates.get("customConditionIcons")?.[key] ??
                    storedCustomIcons?.[key] ??
                    path ??
                    "";
                return acc;
            },
            {},
        );
    }

    async function resetIcons() {
        // const dialog = new ConditionIconResetConfirmationDialog();
        // await dialog.render(true);
        // let dialogData = await dialog.promise;

        // if (!dialogData || !dialogData.confirmReset) return;

        Object.keys(conditionIconsDefault).forEach((conditionKey) => {
            const defaultIcon = conditionIconsDefault[conditionKey];
            customIcons[conditionKey] = defaultIcon;
        });

        updates.set("customConditionIcons", customIcons);
        reload = true;
        customIcons = getCustomIcons();
    }

    function updateConditionIcon(key, current) {
        const filePicker = new FilePicker({
            type: "image",
            current,
            callback: (path) => {
                customIcons[key] = path;
                updates.set("customConditionIcons", customIcons);
                customIcons = getCustomIcons();
                reload = true;
            },
        });

        filePicker.browse();
    }

    let { reload = $bindable() }: Props = $props();

    let settings: Record<string, { data: any; value: any }> =
        getContext("settings");
    let updates: Map<string, any> = getContext("updates");

    let { conditions, conditionIconsDefault } = CONFIG.A5E;

    // Conditions Automation
    const automatableConditions = Object.entries(conditions).reduce(
        (acc, curr) => {
            if (!["frightened"].includes(curr)) acc.push(curr);
            return acc;
        },
        [],
    );

    const iconSizeChoices = settings.effectsPanelIconSize.data.choices;
    const conditionFlowDirectionChoices =
        settings.conditionFlowDirection.data.choices;

    let automateUnconscious = $derived(
        settings["automateUnconsciousApplication"].value,
    );
    let automatedConditions = $derived(settings["automatedConditions"].value);
    let automateBloodied = $derived(
        settings["automateBloodiedApplication"].value,
    );
    let conditionFlowDirection = $derived(
        settings["conditionFlowDirection"].value,
    );
    let showEffectsPanel = $derived(settings["showEffectsPanel"].value);
    let panelIconSize = $derived(settings["effectsPanelIconSize"].value);
    let panelOffset = $derived(settings["effectsPanelOffset"].value);
    let radialEffects = $derived(settings["enableRadialEffects"].value);
    let removeEffects = $derived(
        settings["removeActiveEffectsOnLongRest"].value,
    );
    let storedCustomIcons = $derived(settings["customConditionIcons"].value);

    let selectedConditionFlowDirection = $derived(
        updates.get("conditionFlowDirection") ?? conditionFlowDirection,
    );

    let selectedConditions = $derived(
        updates.get("automatedConditions") ?? automatedConditions,
    );

    let customIcons = $state(getCustomIcons());

    let selectedIconSize = $derived(
        updates.get("effectsPanelIconSize") ?? panelIconSize ?? "medium",
    );

    let selectedOffset = $derived(
        updates.get("effectsPanelOffset") ?? panelOffset,
    );
</script>

<Section
    heading="A5E.settings.automateConditions"
    --a5e-section-body-gap="0.5rem"
>
    <!-- Condition Automation -->
    <CheckboxGroup
        hint="A5E.settings.hints.automateConditions"
        options={automatableConditions}
        selected={selectedConditions}
        onUpdateSelection={(detail) => {
            updates.set("automatedConditions", detail);
            selectedConditions = detail;
            reload = true;
        }}
    />

    <FieldWrapper hint="A5E.settings.hints.automateBloodiedApplication">
        <Checkbox
            label="A5E.settings.automateBloodiedApplication"
            checked={updates.get("automateBloodiedApplication") ??
                automateBloodied ??
                false}
            onUpdateSelection={(detail) => {
                updates.set("automateBloodiedApplication", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.automateUnconsciousApplication">
        <Checkbox
            label="A5E.settings.automateUnconsciousApplication"
            checked={updates.get("automateUnconsciousApplication") ??
                automateUnconscious ??
                false}
            onUpdateSelection={(detail) => {
                updates.set("automateUnconsciousApplication", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.enableRadialEffects">
        <Checkbox
            label="A5E.settings.enableRadialEffects"
            checked={updates.get("enableRadialEffects") ?? radialEffects}
            onUpdateSelection={(detail) => {
                updates.set("enableRadialEffects", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.removeActiveEffectsOnLongRest">
        <Checkbox
            label="A5E.settings.removeActiveEffectsOnLongRest"
            checked={updates.get("removeActiveEffectsOnLongRest") ??
                removeEffects ??
                false}
            onUpdateSelection={(detail) => {
                updates.set("removeActiveEffectsOnLongRest", detail);
            }}
        />
    </FieldWrapper>
</Section>

<Section heading="Condition Interface Layout" --a5e-section-body-gap="0.5rem">
    <RadioGroup
        heading="A5E.settings.conditionFlowDirection"
        hint="A5E.settings.hints.conditionFlowDirection"
        options={Object.entries(conditionFlowDirectionChoices)}
        selected={selectedConditionFlowDirection}
        onUpdateSelection={(detail) => {
            updates.set("conditionFlowDirection", detail);
            selectedConditionFlowDirection = detail;
            reload = true;
        }}
    />
</Section>

<Section
    heading="Custom Effect Icons"
    --a5e-section-body-gap="0.5rem"
    headerButtons={[
        {
            classes: "reset-button",
            label: "Reset Icons to Defaults",
            handler: resetIcons,
        },
    ]}
>
    <ul class="condition-grid">
        {#each Object.entries(customIcons) as [conditionKey, icon]}
            <SettingsCustomIcon
                {conditionKey}
                {icon}
                onUpdateConditionIcon={updateConditionIcon}
            />
        {/each}
    </ul>
</Section>

<Section heading="Effects Panel" --a5e-section-body-gap="0.5rem">
    <FieldWrapper hint="A5E.settings.hints.showEffectsPanel">
        <Checkbox
            label="A5E.settings.showEffectsPanel"
            checked={updates.get("showEffectsPanel") ??
                showEffectsPanel ??
                true}
            onUpdateSelection={(detail) => {
                updates.set("showEffectsPanel", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <RadioGroup
        heading="A5E.settings.effectsPanelIconSize"
        hint="A5E.settings.hints.effectsPanelIconSize"
        options={Object.entries(iconSizeChoices)}
        selected={selectedIconSize}
        onUpdateSelection={(detail) => {
            updates.set("effectsPanelIconSize", detail);
            selectedIconSize = detail;
        }}
    />

    <FieldWrapper
        heading="A5E.settings.effectsPanelPosition"
        hint="A5E.settings.hints.effectsPanelPosition"
        --a5e-field-wrapper-gap="0.5rem"
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-header-width="100%"
    >
        <FieldWrapper heading="Top Offset">
            <input
                id="top-offset"
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                value={selectedOffset.top}
                onchange={({ currentTarget }) => {
                    const { value } = currentTarget;
                    selectedOffset.top = Number(value);
                    updates.set("effectsPanelOffset", selectedOffset);
                }}
            />
        </FieldWrapper>

        <FieldWrapper heading="Bottom Offset">
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                value={selectedOffset.bottom}
                onchange={({ currentTarget }) => {
                    const { value } = currentTarget;
                    selectedOffset.bottom = Number(value);
                    updates.set("effectsPanelOffset", selectedOffset);
                }}
            />
        </FieldWrapper>

        <FieldWrapper heading="Right Offset">
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                value={selectedOffset.right}
                onchange={({ currentTarget }) => {
                    const { value } = currentTarget;
                    selectedOffset.right = Number(value);
                    updates.set("effectsPanelOffset", selectedOffset);
                }}
            />
        </FieldWrapper>
    </FieldWrapper>
</Section>

<style lang="scss">
    .condition-grid {
        display: grid;
        width: 100%;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.25rem;
        margin: 0;
        padding: 0;
        list-style: none;
    }
</style>
