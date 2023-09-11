<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import FormSection from "../components/FormSection.svelte";
    import Checkbox from "../components/Checkbox.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    // export let reload;

    const appId = getContext("appId");
    const settings = getContext("settings");
    const updates = getContext("updates");

    // Stores
    let critCalculationMode = settings.getStore("critCalculationMode");
    let selectedCritMode =
        updates.get("critCalculationMode") ?? $critCalculationMode;
    const critCalculationModeOptions = game.settings.settings.get(
        "a5e.critCalculationMode"
    ).choices;

    let preventActivationRoll = settings.getStore("preventActionRollOnWarning");
</script>

<section
    class="u-flex-grow u-flex u-flex-col u-overflow-y-auto u-gap-md u-px-md u-mt-xl"
>
    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Generic Roll Settings</h3>
        </header>

        <FormSection
            hint="A5E.settings.hints.critCalculationMode"
            --gap="0.25rem"
        >
            <RadioGroup
                options={Object.entries(critCalculationModeOptions)}
                selected={selectedCritMode}
                on:updateSelection={({ detail }) => {
                    updates.set("critCalculationMode", detail);
                    selectedCritMode = detail;
                }}
            />
        </FormSection>

        <FormSection
            hint="A5E.settings.hints.preventActionRollOnWarning"
            --gap="0.25rem"
        >
            <Checkbox
                label="A5E.settings.preventActionRollOnWarning"
                checked={updates.get("preventActionRollOnWarning") ??
                    $preventActivationRoll ??
                    false}
                on:updateSelection={({ detail }) => {
                    updates.set("preventActionRollOnWarning", detail);
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
