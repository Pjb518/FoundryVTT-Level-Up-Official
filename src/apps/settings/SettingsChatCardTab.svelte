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

<section
    class="u-flex-grow u-flex u-flex-col u-overflow-y-auto u-gap-md u-px-md u-mt-xl"
>
    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Chat Card Display Settings</h3>
        </header>

        <FormSection
            hint="A5E.settings.hints.hideChatDescriptionsByDefault"
            --gap="0.25rem"
        >
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
        </FormSection>

        <FormSection hint="A5E.settings.hints.protectRolls" --gap="0.25rem">
            <Checkbox
                label="A5E.settings.protectRolls"
                checked={updates.get("protectRolls") ?? $protectRolls ?? false}
                on:updateSelection={({ detail }) => {
                    updates.set("protectRolls", detail);
                    reload = true;
                }}
            />
        </FormSection>

        <FormSection
            hint="A5E.settings.hints.terseRollFormulae"
            --gap="0.25rem"
        >
            <Checkbox
                label="A5E.settings.terseRollFormulae"
                checked={updates.get("terseRollFormulae") ??
                    $terseRolls ??
                    false}
                on:updateSelection={({ detail }) => {
                    updates.set("terseRollFormulae", detail);
                    reload = true;
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
