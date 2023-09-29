<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import Checkbox from "../components/Checkbox.svelte";
    import FormSection from "../components/FormSection.svelte";
    import SettingsCustomIcon from "./SettingsCustomIcon.svelte";

    export let reload;

    const settings = getContext("settings");
    const updates = getContext("updates");

    const { conditions, conditionIcons } = CONFIG.A5E;

    // Conditions Automation
    const automatableConditions = Object.entries(conditions).reduce(
        (acc, curr) => {
            if (!["fatigue", "frightened", "strife"].includes(curr))
                acc.push(curr);
            return acc;
        },
        []
    );

    const automatedConditions = settings.getStore("automatedConditions");
    const automateBloodied = settings.getStore("automateBloodiedApplication");

    const automateUnconscious = settings.getStore(
        "automateUnconsciousApplication"
    );

    const radialEffects = settings.getStore("enableRadialEffects");
    const removeEffects = settings.getStore("removeActiveEffectsOnLongRest");

    let selectedConditions =
        updates.get("automatedConditions") ?? $automatedConditions;
</script>

<section class="setting-group">
    <header class="setting-header">
        <h3 class="setting-heading">Custom Effect Icons</h3>
    </header>

    <ul class="condition-grid">
        {#each Object.keys(conditionIcons) as conditionKey}
            <SettingsCustomIcon {conditionKey} bind:reload />
        {/each}
    </ul>
</section>

<section class="setting-group">
    <header class="setting-header">
        <h3 class="setting-heading">
            {localize("A5E.settings.automateConditions")}
        </h3>
    </header>

    <!-- Condition Automation -->
    <FormSection hint="A5E.settings.hints.automateConditions" --gap="0.25rem">
        <CheckboxGroup
            options={automatableConditions}
            selected={selectedConditions}
            on:updateSelection={({ detail }) => {
                updates.set("automatedConditions", detail);
                selectedConditions = detail;
                reload = true;
            }}
        />
    </FormSection>

    <FormSection
        hint="A5E.settings.hints.automateBloodiedApplication"
        --gap="0.25rem"
    >
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
    </FormSection>

    <FormSection
        hint="A5E.settings.hints.automateUnconsciousApplication"
        --gap="0.25rem"
    >
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
    </FormSection>

    <FormSection hint="A5E.settings.hints.enableRadialEffects" --gap="0.25rem">
        <Checkbox
            label="A5E.settings.enableRadialEffects"
            checked={updates.get("enableRadialEffects") ?? $radialEffects}
            on:updateSelection={({ detail }) => {
                updates.set("enableRadialEffects", detail);
                reload = true;
            }}
        />
    </FormSection>

    <FormSection
        hint="A5E.settings.hints.removeActiveEffectsOnLongRest"
        --gap="0.25rem"
    >
        <Checkbox
            label="A5E.settings.removeActiveEffectsOnLongRest"
            checked={updates.get("removeActiveEffectsOnLongRest") ??
                $removeEffects ??
                false}
            on:updateSelection={({ detail }) => {
                updates.set("removeActiveEffectsOnLongRest", detail);
            }}
        />
    </FormSection>
</section>

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
        padding: 0 0.5rem 0.25rem 0.125rem;
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
