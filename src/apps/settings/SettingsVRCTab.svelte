<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import Section from "../components/Section.svelte";

    export let reload;

    const settings = getContext("settings");
    const updates = getContext("updates");

    let vrc = settings.getStore("vrc");
</script>

<Section
    heading="A5E.settings.sectionHeader.actorBehavior"
    --a5e-section-body-gap="0.5rem"
>
        <FieldWrapper hint="A5E.settings.hints.vrc">
            <Checkbox
                label="A5E.settings.vrc"
                checked={updates.get("vrc") ??
                    $vrc ??
                    false}
                on:updateSelection={({ detail }) => {
                    updates.set("vrc", detail);
                    reload = true;
                }}
            />
        </FieldWrapper>
</Section>
