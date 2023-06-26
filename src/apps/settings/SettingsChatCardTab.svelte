<script>
    import { getContext } from "svelte";

    import FormSection from "../components/FormSection.svelte";
    import Checkbox from "../components/Checkbox.svelte";

    export let reload;

    const appId = getContext("appId");
    const settings = getContext("settings");
    const updates = getContext("updates");

    const hideDescription = settings.getStore("hideChatDescriptionsByDefault");
    const protectRolls = settings.getStore("protectRolls");
    const terseRolls = settings.getStore("terseRollFormulae");
</script>

<FormSection heading="Chat Card Settings" --direction="column" --gap="0.75rem">
    <Checkbox
        label="A5E.settings.hideChatDescriptionsByDefault"
        checked={$hideDescription || false}
        on:change={({ detail }) => {
            updates.set("hideChatDescriptionsByDefault", detail);
            reload = true;
        }}
    />

    <Checkbox
        label="A5E.settings.protectRolls"
        checked={$protectRolls || false}
        on:change={({ detail }) => {
            updates.set("protectRolls", detail);
            reload = true;
        }}
    />

    <Checkbox
        label="A5E.settings.terseRollFormulae"
        checked={$terseRolls || false}
        on:change={({ detail }) => {
            updates.set("terseRollFormulae", detail);
            reload = true;
        }}
    />
</FormSection>
