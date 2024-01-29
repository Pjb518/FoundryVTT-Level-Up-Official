<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import Section from "../components/Section.svelte";

    export let reload;

    const settings = getContext("settings");
    const updates = getContext("updates");

    const isGM = game.user.isGM;

    let hideDescription = settings.getStore("hideChatDescriptionsByDefault");
    let hideHpRolls = settings.getStore("hideRandomizedHPRolls");
    let protectRolls = settings.getStore("protectRolls");
    let terseRolls = settings.getStore("terseRollFormulae");
</script>

<Section heading="Chat Card Display Settings" --a5e-section-body-gap="0.5rem">
    <FieldWrapper hint="A5E.settings.hints.hideChatDescriptionsByDefault">
        <Checkbox
            label="A5E.settings.hideChatDescriptionsByDefault"
            checked={updates.get("hideChatDescriptionsByDefault") ??
                $hideDescription ??
                false}
            on:updateSelection={({ detail }) => {
                updates.set("hideChatDescriptionsByDefault", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    {#if isGM}
        <FieldWrapper hint="A5E.settings.hints.hideRandomizedHPRolls">
            <Checkbox
                label="A5E.settings.hideRandomizedHPRolls"
                checked={updates.get("hideRandomizedHPRolls") ??
                    $hideHpRolls ??
                    false}
                on:updateSelection={({ detail }) => {
                    updates.set("hideRandomizedHPRolls", detail);
                }}
            />
        </FieldWrapper>
    {/if}

    {#if isGM}
        <FieldWrapper hint="A5E.settings.hints.protectRolls">
            <Checkbox
                label="A5E.settings.protectRolls"
                checked={updates.get("protectRolls") ?? $protectRolls ?? false}
                on:updateSelection={({ detail }) => {
                    updates.set("protectRolls", detail);
                    reload = true;
                }}
            />
        </FieldWrapper>
    {/if}

    <FieldWrapper hint="A5E.settings.hints.terseRollFormulae">
        <Checkbox
            label="A5E.settings.terseRollFormulae"
            checked={updates.get("terseRollFormulae") ?? $terseRolls ?? false}
            on:updateSelection={({ detail }) => {
                updates.set("terseRollFormulae", detail);
                reload = true;
            }}
        />
    </FieldWrapper>
</Section>
