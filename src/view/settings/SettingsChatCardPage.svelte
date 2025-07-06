<script lang="ts">
    import { getContext } from "svelte";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        reload?: boolean;
    };

    let { reload = $bindable() }: Props = $props();

    let settings: Record<string, { data: any; value: any }> =
        getContext("settings");
    let updates: Map<string, any> = getContext("updates");

    const isGM = game.user!.isGM;

    let enableDamageRollColors = $derived(settings["enableDamageRollColors"]);
    let hideDescription = $derived(settings["hideChatDescriptionsByDefault"]);
    let hideHpRolls = $derived(settings["hideRandomizedHPRolls"]);
    let protectRolls = $derived(settings["protectRolls"]);
    let terseRolls = $derived(settings["terseRollFormulae"]);
</script>

<Section heading="Chat Card Display Settings" --a5e-section-body-gap="0.5rem">
    <FieldWrapper hint="A5E.settings.hints.enableDamageRollColors">
        <Checkbox
            label="A5E.settings.enableDamageRollColors"
            checked={updates.get("enableDamageRollColors") ??
                enableDamageRollColors ??
                false}
            onUpdateSelection={(detail) => {
                updates.set("enableDamageRollColors", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    {#if isGM}
        <FieldWrapper hint="A5E.settings.hints.protectRolls">
            <Checkbox
                label="A5E.settings.protectRolls"
                checked={updates.get("protectRolls") ?? protectRolls ?? false}
                onUpdateSelection={(detail) => {
                    updates.set("protectRolls", detail);
                    reload = true;
                }}
            />
        </FieldWrapper>
    {/if}

    <FieldWrapper hint="A5E.settings.hints.hideChatDescriptionsByDefault">
        <Checkbox
            label="A5E.settings.hideChatDescriptionsByDefault"
            checked={updates.get("hideChatDescriptionsByDefault") ??
                hideDescription ??
                false}
            onUpdateSelection={(detail) => {
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
                    hideHpRolls ??
                    false}
                onUpdateSelection={(detail) => {
                    updates.set("hideRandomizedHPRolls", detail);
                }}
            />
        </FieldWrapper>
    {/if}

    <FieldWrapper hint="A5E.settings.hints.terseRollFormulae">
        <Checkbox
            label="A5E.settings.terseRollFormulae"
            checked={updates.get("terseRollFormulae") ?? terseRolls ?? false}
            onUpdateSelection={(detail) => {
                updates.set("terseRollFormulae", detail);
                reload = true;
            }}
        />
    </FieldWrapper>
</Section>
