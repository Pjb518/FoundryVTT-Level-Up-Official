<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    export let reload;

    const settings = getContext("settings");
    const updates = getContext("updates");

    const diagonalRuleOptions =
        game.settings.settings.get("a5e.diagonalRule").choices;

    let diagonalRule = settings.getStore("diagonalRule");
    let selectedDiagonalRule = updates.get("diagonalRule") ?? $diagonalRule;
    let placeTemplate = settings.getStore("placeItemTemplateDefault");
</script>

<section class="setting-group">
    <RadioGroup
        heading="Grid Settings"
        hint="A5E.settings.hints.diagonalRule"
        options={Object.entries(diagonalRuleOptions)}
        selected={selectedDiagonalRule}
        on:updateSelection={({ detail }) => {
            updates.set("diagonalRule", detail);
            selectedDiagonalRule = detail;
            reload = true;
        }}
    />
</section>

<section class="setting-group">
    <FieldWrapper
        heading="Template Settings"
        hint="A5E.settings.hints.placeItemTemplateDefault"
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
    </FieldWrapper>
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
</style>
