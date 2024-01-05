<script>
    import { getContext, createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import Checkbox from "../components/Checkbox.svelte";
    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import Section from "../components/Section.svelte";

    export let { document, bonusID } = getContext("#external").application;
    export let jsonValue = null;

    const actor = document;
    const dispatch = createEventDispatcher();

    function updateImage() {
        const current = healingBonus?.img;

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
        if (jsonValue === null) {
            key = `system.bonuses.healing.${bonusID}.${key}`;
            updateDocumentDataFromField($actor, key, value);
            return;
        }

        const newObj = foundry.utils.expandObject({
            ...healingBonus,
            [key]: value,
        });
        dispatch("change", JSON.stringify(newObj));
    }

    function getHealingBonus() {
        if (jsonValue === null) return $actor.system.bonuses.healing[bonusID];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.formula = obj.formula ?? "";
            obj.healingType = obj.healingType ?? "";
            obj.context = obj.context ?? {
                healingTypes: [],
                spellLevels: [],
            };
            obj.default = obj.default ?? true;
            obj.img = obj.img ?? "icons/svg/upgrade.svg";
            return obj;
        } catch (error) {
            return {
                label: "",
                formula: "",
                healingType: "",
                context: {
                    healingTypes: [],
                    spellLevels: [],
                },
                default: true,
                img: "icons/svg/upgrade.svg",
            };
        }
    }

    const { healingBonusContexts, healingTypes, spellLevels } = CONFIG.A5E;

    $: healingBonus = getHealingBonus($actor, jsonValue) ?? {};
    $: healingTypesContext = healingBonus.context.healingTypes ?? [];
    $: spellLevelsContext = healingBonus.context.spellLevels ?? [];
</script>

<form>
    <header class="sheet-header">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img
            class="bonus-image"
            src={healingBonus.img}
            alt={healingBonus.label}
            on:click={() => updateImage()}
        />

        <div class="name-wrapper">
            <input
                type="text"
                name="name"
                value={healingBonus.label ?? ""}
                class="bonus-name"
                placeholder="Bonus Name"
                on:change={({ target }) => onUpdateValue("label", target.value)}
            />
        </div>
    </header>

    <Section
        --a5e-section-body-direction="row"
        --a5e-section-margin="0.25rem 0"
    >
        <FieldWrapper heading="A5E.HealingFormula" --a5e-field-wrapper-grow="1">
            <input
                type="text"
                value={healingBonus.formula ?? ""}
                on:change={({ target }) =>
                    onUpdateValue("formula", target.value)}
            />
        </FieldWrapper>

        <FieldWrapper heading="A5E.HealingType">
            <select
                class="u-w-fit healing-type-select"
                on:change={({ target }) =>
                    onUpdateValue("healingType", target.value)}
            >
                <option
                    value={null}
                    selected={healingBonus.healingType === "null" ||
                        healingBonus.healingType === null}
                >
                    {localize("A5E.None")}
                </option>

                {#each Object.entries(healingTypes) as [key, name] (key)}
                    <option
                        value={key}
                        selected={healingBonus.healingType === key}
                    >
                        {localize(name)}
                    </option>
                {/each}
            </select>
        </FieldWrapper>
    </Section>

    <Section
        heading="Contexts"
        hint="The context determines when the healing bonus applies"
        --a5e-section-body-gap="0.75rem"
        --a5e-section-body-padding="0 0.25rem"
        --a5e-section-margin="0"
    >
        <CheckboxGroup
            heading="A5E.contexts.healingType"
            options={Object.entries(healingBonusContexts)}
            selected={healingTypesContext}
            showToggleAllButton={true}
            on:updateSelection={({ detail }) =>
                onUpdateValue("context.healingTypes", detail)}
        />

        <CheckboxGroup
            heading="A5E.contexts.spellLevel"
            options={Object.entries(spellLevels)}
            selected={spellLevelsContext}
            showToggleAllButton={true}
            on:updateSelection={({ detail }) =>
                onUpdateValue("context.spellLevels", detail)}
        />

        <FieldWrapper>
            <Checkbox
                label="Select Healing Bonus Automatically in Roll Prompt"
                checked={healingBonus.default ?? true}
                on:updateSelection={({ detail }) => {
                    onUpdateValue("default", detail);
                }}
            />
        </FieldWrapper>
    </Section>
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

    .bonus-name,
    .bonus-name[type="text"] {
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

    .bonus-image {
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
