<script>
    import { getContext, createEventDispatcher } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store/fvtt/document";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import Checkbox from "../components/Checkbox.svelte";
    import FormSection from "../components/FormSection.svelte";
    import TagGroup from "../components/TagGroup.svelte";

    export let { document, bonusID } = getContext("#external").application;
    export let jsonValue = null;

    const actor = new TJSDocument(document);
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
            key = `system.bonuses.skills.${bonusID}.${key}`;
            updateDocumentDataFromField($actor, key, value);
            return;
        }

        const newObj = foundry.utils.expandObject({
            ...skillBonus,
            [key]: value,
        });
        dispatch("change", JSON.stringify(newObj));
    }

    function getAbilityBonus() {
        if (jsonValue === null) return $actor.system.bonuses.skills[bonusID];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.formula = obj.formula ?? "";
            obj.context = obj.context ?? {};
            obj.default = obj.default ?? true;
            obj.img = obj.img ?? "icons/svg/upgrade.svg";
            return obj;
        } catch (error) {
            return {
                label: "",
                formula: "",
                damageType: "",
                context: {},
                default: true,
                img: "icons/svg/upgrade.svg",
            };
        }
    }

    const { skills } = CONFIG.A5E;

    $: skillBonus = getAbilityBonus($actor, jsonValue) ?? {};
    $: passiveOnly = skillBonus.context.passiveOnly ?? false;
    $: skillsContext = skillBonus.context.skills ?? [];
    $: requiresProficiency = skillBonus.context.requiresProficiency ?? false;
</script>

<form>
    <header class="sheet-header">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img
            class="bonus-image"
            src={skillBonus.img}
            alt={skillBonus.label}
            on:click={() => updateImage()}
        />

        <div class="name-wrapper">
            <input
                type="text"
                name="name"
                value={skillBonus.label ?? ""}
                class="bonus-name"
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
                value={skillBonus.formula ?? ""}
                on:change={({ target }) =>
                    onUpdateValue("formula", target.value)}
            />
        </FormSection>
    </FormSection>

    <FormSection
        heading="Contexts"
        hint="The context determines when the ability bonus applies"
        --direction="column"
        --wrap="nowrap"
    >
        <TagGroup
            heading="A5E.contexts.skills"
            options={Object.entries(skills)}
            selected={skillsContext}
            on:updateSelection={({ detail }) => {
                onUpdateValue("context.skills", detail);
            }}
        />

        <Checkbox
            label="A5E.contexts.requiresProficiency"
            checked={requiresProficiency}
            on:updateSelection={({ detail }) => {
                onUpdateValue("context.requiresProficiency", detail);
            }}
        />

        <Checkbox
            label="A5E.contexts.passiveOnly"
            checked={passiveOnly}
            on:updateSelection={({ detail }) => {
                onUpdateValue("context.passiveOnly", detail);
            }}
        />
    </FormSection>

    <FormSection>
        <Checkbox
            label="Select Skill Bonus Automatically in Roll Prompt"
            checked={skillBonus.default ?? true}
            on:updateSelection={({ detail }) => {
                onUpdateValue("default", detail);
            }}
        />
    </FormSection>
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
