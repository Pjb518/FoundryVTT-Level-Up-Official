<script>
    import { getContext, createEventDispatcher } from "svelte";

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
        const current = initiativeBonus?.img;

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
            key = `system.bonuses.initiative.${bonusID}.${key}`;
            updateDocumentDataFromField($actor, key, value);
            return;
        }

        const newObj = foundry.utils.expandObject({
            ...initiativeBonus,
            [key]: value,
        });
        dispatch("change", JSON.stringify(newObj));
    }

    function getAbilityBonus() {
        if (jsonValue === null)
            return $actor.system.bonuses.initiative[bonusID];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.formula = obj.formula ?? "";
            obj.context = obj.context ?? {
                abilities: [],
                skills: [],
            };
            obj.default = obj.default ?? true;
            obj.img = obj.img || "icons/svg/upgrade.svg";
            return obj;
        } catch (error) {
            return {
                label: "",
                formula: "",
                damageType: "",
                context: {
                    abilities: [],
                    skills: [],
                },
                default: true,
                img: "icons/svg/upgrade.svg",
            };
        }
    }

    const { abilities, skills } = CONFIG.A5E;

    $: initiativeBonus = getAbilityBonus($actor, jsonValue) ?? {};
    $: abilitiesContext = initiativeBonus.context?.abilities ?? [];
    $: skillsContext = initiativeBonus.context?.skills ?? [];
</script>

<form>
    <header class="sheet-header">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img
            class="bonus-image"
            src={initiativeBonus.img}
            alt={initiativeBonus.label}
            on:click={() => updateImage()}
        />

        <div class="name-wrapper">
            <input
                type="text"
                name="name"
                value={initiativeBonus.label ?? ""}
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
                value={initiativeBonus.formula ?? ""}
                on:change={({ target }) =>
                    onUpdateValue("formula", target.value)}
            />
        </FieldWrapper>
    </Section>

    <Section
        heading="Contexts"
        hint="The context determines when the ability bonus applies"
        --a5e-section-body-gap="0.75rem"
    >
        <CheckboxGroup
            heading="A5E.contexts.abilities"
            options={Object.entries(abilities)}
            selected={abilitiesContext}
            showToggleAllButton={true}
            on:updateSelection={({ detail }) => {
                onUpdateValue("context.abilities", detail);
            }}
        />

        <CheckboxGroup
            heading="A5E.contexts.skills"
            options={Object.entries(skills)}
            selected={skillsContext}
            showToggleAllButton={true}
            on:updateSelection={({ detail }) => {
                onUpdateValue("context.skills", detail);
            }}
        />

        <FieldWrapper>
            <Checkbox
                label="Select Ability Bonus Automatically in Roll Prompt"
                checked={initiativeBonus.default ?? true}
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
