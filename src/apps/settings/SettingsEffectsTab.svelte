<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import Checkbox from "../components/Checkbox.svelte";
    import FormSection from "../components/FormSection.svelte";

    export let reload;

    const appId = getContext("appId");
    const settings = getContext("settings");
    const updates = getContext("updates");

    // Conditions Automation
    const conditions = [
        "blinded",
        "encumbered",
        // 'fatigue',
        // 'frightened',
        "grappled",
        "invisible",
        "paralyzed",
        "petrified",
        "poisoned",
        "prone",
        "rattled",
        "restrained",
        "slowed",
        // 'strife',
        "stunned",
        "unconscious",
    ].map((c) => [c, localize(`A5E.Condition${c.capitalize()}`)]);

    const automatedConditions = settings.getStore("automatedConditions");
    let selectedConditions =
        updates.get("automatedConditions") ?? $automatedConditions;

    const automateBloodied = settings.getStore("automateBloodiedApplication");
    const removeEffects = settings.getStore("removeActiveEffectsOnLongRest");
</script>

<section
    class="u-flex-grow u-flex u-flex-col u-overflow-y-auto u-gap-md u-px-md u-mt-xl"
>
    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">
                {localize("A5E.settings.automateConditions")}
            </h3>
        </header>

        <!-- Condition Automation -->
        <FormSection
            hint="A5E.settings.hints.automateConditions"
            --gap="0.25rem"
        >
            <CheckboxGroup
                options={conditions}
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
</section>

<style lang="scss">
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
    //     font-size: 0.833rem;
    //     color: #7e7960;

    //     transition: all 0.15s ease-in-out;

    //     &:focus,
    //     &:hover {
    //         box-shadow: none;
    //         color: rgb(25, 24, 19);
    //     }
    // }

    .setting-heading {
        font-size: 0.833rem;
        white-space: nowrap;
    }
</style>
