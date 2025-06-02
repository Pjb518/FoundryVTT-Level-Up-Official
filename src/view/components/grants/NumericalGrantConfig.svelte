<script lang="ts">
    import { setContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";
    import NumericalGrantContexts from "./NumericalGrantContexts.svelte";
    import GrantConfig from "./GrantConfig.svelte";

    type Props = {
        document: any;
        grantId: string;
        grantType:
            | "abilities"
            | "damage"
            | "healing"
            | "movement"
            | "senses"
            | "skills";
    };

    function updateImage() {
        const current = grant?.img;

        const filePicker = new FilePicker({
            type: "image",
            current,
            callback: (path) => {
                onUpdateValue("img", path);
            },
        });

        return filePicker.browse();
    }

    function onUpdateValue(key: string, value: string | number) {
        key = `system.grants.${grantId}.${key}`;
        updateDocumentDataFromField(item, key, value);
    }

    let { document, grantId, grantType }: Props = $props();

    let item = document;

    const configObject = {
        abilities: {},
        damage: {
            selectHeading: "A5E.DamageType",
            selectTypes: CONFIG.A5E.damageTypes,
            selectProperty: "damageType",
        },
        healing: {
            selectHeading: "A5E.HealingType",
            selectTypes: CONFIG.A5E.healingTypes,
            selectProperty: "healingType",
        },
        movement: {
            selectHeading: "A5E.Unit",
            selectTypes: CONFIG.A5E.distanceUnits,
            selectProperty: "unit",
        },
        senses: {
            selectHeading: "A5E.Unit",
            selectTypes: CONFIG.A5E.visionUnits,
            selectProperty: "unit",
        },
        skills: {},
    };
    const hasSelectDialog = [
        "damage",
        "healing",
        "movement",
        "senses",
    ].includes(grantType);

    let grant = $derived(item.reactive.system.grants[grantId]);
    let selectProperty = $derived(configObject[grantType]?.selectProperty);

    setContext("item", item);
    setContext("grantId", grantId);
    setContext("grantType", grantType);
</script>

<form class="a5e-grant">
    <header class="a5e-grant__header">
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img
            class="a5e-grant-image"
            src={grant.img || item.img || "icons/svg/upgrade.svg"}
            alt={grant.label}
            onclick={updateImage}
        />

        <div class="a5e-input a5e-grant-name-wrapper">
            <input
                class="a5e-grant-name"
                type="text"
                name="name"
                value={grant.label ?? ""}
                placeholder="Bonus Name"
                onchange={({ currentTarget }) =>
                    onUpdateValue("label", currentTarget.value)}
            />
        </div>
    </header>

    <Section
        --a5e-section-margin="0.25rem 0"
        --a5e-section-body-direction={hasSelectDialog ? "row" : "column"}
    >
        <FieldWrapper
            heading="A5E.Formula"
            --a5e-field-wrapper-grow={hasSelectDialog ? "1" : "0"}
        >
            <input
                class="a5e-input"
                type="text"
                value={grant.bonus ?? ""}
                onchange={({ currentTarget }) =>
                    onUpdateValue("bonus", currentTarget.value)}
            />
        </FieldWrapper>

        {#if hasSelectDialog}
            <FieldWrapper
                heading={configObject[grantType]?.selectHeading ?? ""}
                --a5e-grant-container-background="none"
                --direction="column"
                --a5e-grant-container-padding="0"
            >
                <select
                    class="a5e-input a5e-input--slim a5e-input--fit"
                    onchange={({ currentTarget }) =>
                        onUpdateValue(
                            configObject[grantType]?.selectProperty,
                            currentTarget.value,
                        )}
                >
                    <option
                        value={null}
                        selected={grant[selectProperty] === "null" ||
                            grant[selectProperty] === null}
                    >
                        {localize("A5E.None")}
                    </option>

                    {#each Object.entries(configObject[grantType].selectTypes) as [key, name] (key)}
                        <option
                            value={key}
                            selected={grant[selectProperty] === key}
                        >
                            {localize(name as string)}
                        </option>
                    {/each}
                </select>
            </FieldWrapper>
        {/if}
    </Section>

    <NumericalGrantContexts />

    <GrantConfig />
</form>

<style lang="scss">
</style>
