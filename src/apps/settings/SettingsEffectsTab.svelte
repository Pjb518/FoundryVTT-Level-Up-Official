<script>
    import { getContext } from "svelte";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import Checkbox from "../components/Checkbox.svelte";
    import SettingsCustomIcon from "./SettingsCustomIcon.svelte";
    import ConditionIconResetConfirmationDialog from "../dialogs/initializers/ConditionIconResetConfirmationDialog";
    import RadioGroup from "../components/RadioGroup.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import Section from "../components/Section.svelte";

    export let reload;

    function getCustomIcons() {
        return Object.entries(conditionIconsDefault).reduce(
            (acc, [key, path]) => {
                acc[key] =
                    updates.get("customConditionIcons")?.[key] ??
                    $storedCustomIcons?.[key] ??
                    path ??
                    "";
                return acc;
            },
            {},
        );
    }

    async function resetIcons() {
        const dialog = new ConditionIconResetConfirmationDialog();
        await dialog.render(true);
        let dialogData = await dialog.promise;

        if (!dialogData || !dialogData.confirmReset) return;

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

    const settings = getContext("settings");
    const updates = getContext("updates");

    let { conditions, conditionIconsDefault } = CONFIG.A5E;

    // Conditions Automation
    const automatableConditions = Object.entries(conditions).reduce(
        (acc, curr) => {
            if (!["frightened"].includes(curr)) acc.push(curr);
            return acc;
        },
        [],
    );

    const automateUnconscious = settings.getStore(
        "automateUnconsciousApplication",
    );

    const automatedConditions = settings.getStore("automatedConditions");

    const conditionFlowDirectionChoices = game.settings.settings.get(
        "a5e.conditionFlowDirection",
    ).choices;

    const iconSizeChoices = game.settings.settings.get(
        "a5e.effectsPanelIconSize",
    ).choices;

    let automateBloodied = settings.getStore("automateBloodiedApplication");
    let conditionFlowDirection = settings.getStore("conditionFlowDirection");
    let showEffectsPanel = settings.getStore("showEffectsPanel");
    let panelIconSize = settings.getStore("effectsPanelIconSize");
    let panelOffset = settings.getStore("effectsPanelOffset");

    let radialEffects = settings.getStore("enableRadialEffects");
    let removeEffects = settings.getStore("removeActiveEffectsOnLongRest");
    let storedCustomIcons = settings.getStore("customConditionIcons");

    let selectedConditionFlowDirection =
        updates.get("conditionFlowDirection") ?? $conditionFlowDirection;

    let selectedConditions =
        updates.get("automatedConditions") ?? $automatedConditions;

    let customIcons = getCustomIcons();

    let selectedIconSize =
        updates.get("effectsPanelIconSize") ?? $panelIconSize ?? "medium";

    let selectedOffset = updates.get("effectsPanelOffset") ?? $panelOffset;
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
        on:updateSelection={({ detail }) => {
            updates.set("automatedConditions", detail);
            selectedConditions = detail;
            reload = true;
        }}
    />

    <FieldWrapper hint="A5E.settings.hints.automateBloodiedApplication">
        <Checkbox
            label="A5E.settings.automateBloodiedApplication"
            checked={updates.get("automateBloodiedApplication") ??
                $automateBloodied ??
                false}
            on:updateSelection={({ detail }) => {
                updates.set("automateBloodiedApplication", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.automateUnconsciousApplication">
        <Checkbox
            label="A5E.settings.automateUnconsciousApplication"
            checked={updates.get("automateUnconsciousApplication") ??
                $automateUnconscious ??
                false}
            on:updateSelection={({ detail }) => {
                updates.set("automateUnconsciousApplication", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.enableRadialEffects">
        <Checkbox
            label="A5E.settings.enableRadialEffects"
            checked={updates.get("enableRadialEffects") ?? $radialEffects}
            on:updateSelection={({ detail }) => {
                updates.set("enableRadialEffects", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.removeActiveEffectsOnLongRest">
        <Checkbox
            label="A5E.settings.removeActiveEffectsOnLongRest"
            checked={updates.get("removeActiveEffectsOnLongRest") ??
                $removeEffects ??
                false}
            on:updateSelection={({ detail }) => {
                updates.set("removeActiveEffectsOnLongRest", detail);
            }}
        />
    </FieldWrapper>
</Section>

<Section heading="Condition Interface Layout" --a5e-section-body-gap="0.5rem">
    <RadioGroup
        heading="Condition Interface Flow Direction"
        hint={game.settings.settings.get("a5e.conditionFlowDirection").hint}
        options={Object.entries(conditionFlowDirectionChoices)}
        selected={selectedConditionFlowDirection}
        on:updateSelection={({ detail }) => {
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
                bind:reload
                on:updateConditionIcon={({ detail }) =>
                    updateConditionIcon(...detail)}
            />
        {/each}
    </ul>
</Section>

<Section heading="Effects Panel" --a5e-section-body-gap="0.5rem">
    <FieldWrapper hint="A5E.settings.hints.showEffectsPanel">
        <Checkbox
            label="A5E.settings.showEffectsPanel"
            checked={updates.get("showEffectsPanel") ??
                $showEffectsPanel ??
                true}
            on:updateSelection={({ detail }) => {
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
        on:updateSelection={({ detail }) => {
            updates.set("effectsPanelIconSize", detail);
            selectedIconSize = detail;
        }}
    />

    <FieldWrapper
        heading="A5E.settings.effectsPanelPosition"
        hint="A5E.settings.hints.effectsPanelPosition"
    >
        <div class="u-flex u-gap-md">
            <FieldWrapper>
                <label for="top-offset">Top Offset</label>

                <input
                    id="top-offset"
                    class="a5e-input a5e-input--slim"
                    type="number"
                    value={selectedOffset.top}
                    on:change={({ target }) => {
                        const { value } = target;
                        selectedOffset.top = Number(value);
                        updates.set("effectsPanelOffset", selectedOffset);
                    }}
                />
            </FieldWrapper>

            <FieldWrapper>
                <label for="bottom-offset"> Bottom Offset </label>

                <input
                    class="a5e-input a5e-input--slim"
                    type="number"
                    value={selectedOffset.bottom}
                    on:change={({ target }) => {
                        const { value } = target;
                        selectedOffset.bottom = Number(value);
                        updates.set("effectsPanelOffset", selectedOffset);
                    }}
                />
            </FieldWrapper>

            <FieldWrapper>
                <label for="right-offset"> Right Offset </label>

                <input
                    class="a5e-input a5e-input--slim"
                    type="number"
                    value={selectedOffset.right}
                    on:change={({ target }) => {
                        const { value } = target;
                        selectedOffset.right = Number(value);
                        updates.set("effectsPanelOffset", selectedOffset);
                    }}
                />
            </FieldWrapper>
        </div>
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

    .reset-button {
        all: unset;
        display: inline;
        padding: 0.15rem 0.4rem;
        border-color: darken($color-secondary, 5%);
        background: $color-secondary;
        color: lighten($color-secondary, 95%);
        border-radius: 3px;
        white-space: normal;
        font-size: $font-size-xs;

        transition: var(--a5e-transition-standard);
        cursor: pointer;

        &:hover,
        &:focus {
            background: $color-secondary;
            color: lighten($color-secondary, 80%);
        }
    }

    .setting-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        &:not(:last-child) {
            margin-bottom: 0.25rem;
        }
    }

    .setting-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0 0.25rem 0.125rem;
        border-bottom: 1px solid #ccc;
    }

    // .setting-header-button {
    //     width: fit-content;
    //     padding: 0;
    //     margin: 0;
    //     background: transparent;
    //     line-height: 1;
    //     font-size: $font-size-sm;
    //     color: #7e7960;

    //     transition: $standard-transition;

    //     &:focus,
    //     &:hover {
    //         box-shadow: none;
    //         color: rgb(25, 24, 19);
    //     }
    // }

    .setting-heading {
        font-size: $font-size-sm;
        white-space: nowrap;
    }
</style>
