<script>
    import { getContext, createEventDispatcher } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import Checkbox from "../components/Checkbox.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import FormSection from "../components/LegacyFormSection.svelte";
    import TagGroup from "../components/TagGroup.svelte";
    import Section from "../components/Section.svelte";
    import CheckboxGroup from "../components/CheckboxGroup.svelte";

    export let { document, bonusID } = getContext("#external").application;
    export let jsonValue = null;

    const actor = document;
    const dispatch = createEventDispatcher();

    function updateImage() {
        const current = abilityBonus?.img;

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
            key = `system.bonuses.abilities.${bonusID}.${key}`;
            updateDocumentDataFromField($actor, key, value);
            return;
        }

        const newObj = foundry.utils.expandObject({
            ...abilityBonus,
            [key]: value,
        });
        dispatch("change", JSON.stringify(newObj));
    }

    function getAbilityBonus() {
        if (jsonValue === null) return $actor.system.bonuses.abilities[bonusID];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.formula = obj.formula ?? "";
            obj.context = obj.context ?? {
                abilities: [],
                types: [],
                requiresProficiency: false,
            };
            obj.default = obj.default ?? true;
            obj.img = obj.img ?? "icons/svg/upgrade.svg";
            return obj;
        } catch (error) {
            return {
                label: "",
                formula: "",
                damageType: "",
                context: {
                    abilities: [],
                    types: [],
                    requiresProficiency: false,
                },
                default: true,
                img: "icons/svg/upgrade.svg",
            };
        }
    }

    const { abilities, abilityBonusContexts } = CONFIG.A5E;

    $: abilityBonus = getAbilityBonus($actor, jsonValue) ?? {};
    $: abilitiesContext = abilityBonus.context?.abilities ?? [];
    $: abilityTypeContext = abilityBonus.context?.types ?? [];
    $: requiresProficiency = abilityBonus.context?.requiresProficiency ?? false;
</script>

<form>
    <header class="sheet-header">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img
            class="bonus-image"
            src={abilityBonus.img}
            alt={abilityBonus.label}
            on:click={() => updateImage()}
        />

        <div class="name-wrapper">
            <input
                type="text"
                name="name"
                value={abilityBonus.label ?? ""}
                class="bonus-name"
                placeholder="Bonus Name"
                on:change={({ target }) => onUpdateValue("label", target.value)}
            />
        </div>
    </header>

    <Section --a5e-section-margin="0.25rem 0">
        <FieldWrapper heading="A5E.Formula">
            <input
                type="text"
                value={abilityBonus.formula ?? ""}
                on:change={({ target }) =>
                    onUpdateValue("formula", target.value)}
            />
        </FieldWrapper>
    </Section>

    <Section
        heading="Contexts"
        hint="The context determines when the ability bonus applies"
        --a5e-section-body-gap="0.75rem"
        --a5e-section-body-padding="0 0.25rem"
        --a5e-section-margin="0"
    >
        <FieldWrapper heading="A5E.contexts.abilities">
            <CheckboxGroup
                options={Object.entries(abilities)}
                selected={abilitiesContext}
                on:updateSelection={({ detail }) => {
                    onUpdateValue("context.abilities", detail);
                }}
            />
        </FieldWrapper>

        <FieldWrapper heading="A5E.contexts.bonusTypes">
            <CheckboxGroup
                options={Object.entries(abilityBonusContexts)}
                selected={abilityTypeContext}
                on:updateSelection={({ detail }) => {
                    onUpdateValue("context.types", detail);
                }}
            />
        </FieldWrapper>

        <FieldWrapper>
            <Checkbox
                label="A5E.contexts.requiresProficiency"
                checked={requiresProficiency}
                on:updateSelection={({ detail }) => {
                    onUpdateValue("context.requiresProficiency", detail);
                }}
            />
        </FieldWrapper>

        <FieldWrapper>
            <Checkbox
                label="Select Ability Bonus Automatically in Roll Prompt"
                checked={abilityBonus.default ?? true}
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
