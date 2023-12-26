<script>
    import { getContext, onDestroy, setContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";
    import TagGroup from "../TagGroup.svelte";
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

    function getTypeHeading() {
        if (grantType === "damage") return "A5E.DamageType";
        if (grantType === "healing") return "A5E.HealingType";
        return "";
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
        skills: {},
    };

    $: grant = $item.system.grants[grantId];
    $: selectProperty = configObject[grantType]?.selectProperty;
    console.log(grantType);

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
            src={grant.img ?? $item.img}
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

    <FormSection>
        <FormSection
            heading="A5E.Formula"
            --background="none"
            --grow="1"
            --direction="column"
            --padding="0"
        >
            <input
                type="text"
                value={grant.bonus ?? ""}
                on:change={({ target }) => onUpdateValue("bonus", target.value)}
            />
        </FormSection>

        {#if grantType === "damage" || grantType === "healing"}
            <FormSection
                heading={getTypeHeading()}
                --background="none"
                --direction="column"
                --padding="0"
            >
                <select
                    class="u-w-fit damage-type-select"
                    on:change={({ target }) =>
                        onUpdateValue("damageType", target.value)}
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
            </FormSection>
        {/if}
    </FormSection>

    <NumericalGrantContexts />
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: var(--padding, 0.75rem);
        gap: 0.5rem;
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
