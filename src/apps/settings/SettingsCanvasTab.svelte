<script>
    import { getContext } from "svelte";

    import FormSection from "../components/FormSection.svelte";
    import Checkbox from "../components/Checkbox.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    export let reload;

    const appId = getContext("appId");
    const settings = getContext("settings");
    const updates = getContext("updates");

    let diagonalRule = settings.getStore("diagonalRule");
    let selectedDiagonalRule = updates.get("diagonalRule") ?? $diagonalRule;
    const diagonalRuleOptions =
        game.settings.settings.get("a5e.diagonalRule").choices;

    let placeTemplate = settings.getStore("placeItemTemplateDefault");
</script>

<section
    class="u-flex-grow u-flex u-flex-col u-overflow-y-auto u-gap-md u-px-md u-mt-xl"
>
    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Grid Settings</h3>
        </header>

        <FormSection hint="A5E.settings.hints.diagonalRule" --gap="0.25rem">
            <RadioGroup
                options={Object.entries(diagonalRuleOptions)}
                selected={selectedDiagonalRule}
                on:updateSelection={({ detail }) => {
                    updates.set("diagonalRule", detail);
                    selectedDiagonalRule = detail;
                    reload = true;
                }}
            />
        </FormSection>
    </section>

    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Template Settings</h3>
        </header>

        <FormSection
            hint="A5E.settings.hints.placeItemTemplateDefault"
            --gap="0.25rem"
        >
            <Checkbox
                label="A5E.settings.placeItemTemplateDefault"
                checked={updates.get("placeItemTemplateDefault") ??
                    $placeTemplate ??
                    false}
                on:updateSelection={({ detail }) => {
                    updates.set("placeItemTemplateDefault", detail);
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
