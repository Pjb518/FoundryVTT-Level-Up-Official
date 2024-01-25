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
        const current = attackBonus?.img;

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
            key = `system.bonuses.attacks.${bonusID}.${key}`;
            updateDocumentDataFromField($actor, key, value);
            return;
        }

        const newObj = foundry.utils.expandObject({
            ...attackBonus,
            [key]: value,
        });
        dispatch("change", JSON.stringify(newObj));
    }

    function getAttackBonus() {
        if (jsonValue === null) return $actor.system.bonuses.attacks[bonusID];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.formula = obj.formula ?? "";
            obj.context = obj.context ?? {
                attackTypes: [],
                spellLevels: [],
                requiresProficiency: false,
            };
            obj.default = obj.default ?? true;
            obj.img = obj.img ?? "icons/svg/upgrade.svg";
            return obj;
        } catch (error) {
            return {
                label: "",
                formula: "",
                context: {
                    attackTypes: [],
                    spellLevels: [],
                    requiresProficiency: false,
                },
                default: true,
                img: "icons/svg/upgrade.svg",
            };
        }
    }

    const { attackTypes, spellLevels } = CONFIG.A5E;

    $: attackBonus = getAttackBonus($actor, jsonValue) ?? {};
    $: attackTypesContext = attackBonus.context.attackTypes ?? [];
    $: spellLevelsContext = attackBonus.context.spellLevels ?? [];
    $: requiresProficiency = attackBonus.context.requiresProficiency ?? false;
</script>

<form>
    <header class="sheet-header">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img
            class="bonus-image"
            src={attackBonus.img}
            alt={attackBonus.label}
            on:click={() => updateImage()}
        />

        <div class="name-wrapper">
            <input
                type="text"
                name="name"
                value={attackBonus.label ?? ""}
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
        <FieldWrapper heading="A5E.Formula" --a5e-field-wrapper-grow="1">
            <input
                type="text"
                value={attackBonus.formula ?? ""}
                on:change={({ target }) =>
                    onUpdateValue("formula", target.value)}
            />
        </FieldWrapper>
    </Section>

    <Section
        heading="Contexts"
        hint="The context determines when the attack bonus applies"
        --a5e-section-body-gap="0.75rem"
    >
        <CheckboxGroup
            heading="A5E.contexts.attackType"
            options={Object.entries(attackTypes)}
            selected={attackTypesContext}
            showToggleAllButton={true}
            on:updateSelection={({ detail }) => {
                onUpdateValue("context.attackTypes", detail);
            }}
        />

        <CheckboxGroup
            heading="A5E.contexts.spellLevel"
            options={Object.entries(spellLevels)}
            selected={spellLevelsContext}
            showToggleAllButton={true}
            on:updateSelection={({ detail }) => {
                onUpdateValue("context.spellLevels", detail);
            }}
        />

        <Checkbox
            label="A5E.contexts.requiresProficiency"
            checked={requiresProficiency}
            on:updateSelection={({ detail }) => {
                onUpdateValue("context.requiresProficiency", detail);
            }}
        />

        <!-- TODO: ADD THIS BACK IN WHEN IT ACTUALLY DOES SOMETHING! -->
        <!-- <FieldWrapper>
            <Checkbox
                label="Select Attack Bonus Automatically in Roll Prompt"
                checked={attackBonus.default ?? true}
                on:updateSelection={({ detail }) => {
                    onUpdateValue("default", detail);
                }}
            />
        </FieldWrapper> -->
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
