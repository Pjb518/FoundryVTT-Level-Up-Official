<script>
    import { getContext, onDestroy, setContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";
    import NumericalGrantContexts from "./NumericalGrantContexts.svelte";

    export let { document, grantId, grantType } =
        getContext("#external").application;

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

    function onUpdateValue(key, value) {
        key = `system.grants.${grantId}.${key}`;
        updateDocumentDataFromField($item, key, value);
    }

    onDestroy(() => {
        item.destroy();
    });

    const item = new TJSDocument(document);
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

    $: grant = $item.system.grants[grantId];
    $: selectProperty = configObject[grantType]?.selectProperty;

    setContext("item", item);
    setContext("grantId", grantId);
    setContext("grantType", grantType);
</script>

<form>
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <header class="sheet-header">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <img
            class="grant-image"
            src={grant.img || $item.img || "icons/svg/upgrade.svg"}
            alt={grant.label}
            on:click={updateImage}
        />

        <div class="name-wrapper">
            <input
                type="text"
                name="name"
                value={grant.label ?? ""}
                class="grant-name"
                placeholder="Bonus Name"
                on:change={({ target }) => onUpdateValue("label", target.value)}
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
                type="text"
                value={grant.bonus ?? ""}
                on:change={({ target }) => onUpdateValue("bonus", target.value)}
            />
        </FieldWrapper>

        {#if hasSelectDialog}
            <FieldWrapper
                heading={configObject[grantType]?.selectHeading ?? ""}
                --background="none"
                --direction="column"
                --padding="0"
            >
                <select
                    class="u-w-fit damage-type-select"
                    on:change={({ target }) =>
                        onUpdateValue(
                            configObject[grantType]?.selectProperty,
                            target.value,
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
                            {localize(name)}
                        </option>
                    {/each}
                </select>
            </FieldWrapper>
        {/if}
    </Section>

    <NumericalGrantContexts />

    <Section heading="Grant Config">
        <Checkbox
            label="Mark grant as optional"
            checked={grant.optional ?? false}
            on:updateSelection={({ detail }) =>
                onUpdateValue("optional", detail)}
        />
    </Section>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: var(--padding, 0.75rem);
        gap: 0.75rem;
        background: var(--background, $color-sheet-background);
    }

    .grant-name,
    .grant-name[type="text"] {
        font-family: $font-primary;
        font-size: $font-size-xxl;
        border: 0;
        background: transparent;
        text-overflow: ellipsis;

        &:active,
        &:focus {
            box-shadow: none;
        }
    }

    .grant-image {
        width: 2rem;
        height: 2rem;
        border-radius: 4px;
        cursor: pointer;
    }

    .name-wrapper {
        width: 100%;
    }

    .sheet-header {
        display: flex;
        align-items: center;
    }
</style>
