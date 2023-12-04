<script>
    import { getContext, createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import Checkbox from "../components/Checkbox.svelte";
    import FormSection from "../components/FormSection.svelte";
    import TagGroup from "../components/TagGroup.svelte";

    export let { actor, skillBonusId } = getContext("#external").application;
    export let jsonValue = null;

    const dispatch = createEventDispatcher();

    function onUpdateValue(key, value) {
        if (jsonValue === null) {
            key = `system.bonuses.skills.${skillBonusId}.${key}`;
            updateDocumentDataFromField($actor, key, value);
            return;
        }

        const newObj = { ...skillBonus, [key]: value };
        dispatch("change", JSON.stringify(newObj));
    }

    function getAbilityBonus() {
        if (jsonValue === null)
            return $actor.system.bonuses.skills[skillBonusId];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.formula = obj.formula ?? "";
            obj.context = obj.context ?? {};
            obj.default = obj.default ?? true;
            return obj;
        } catch (error) {
            return {
                label: "",
                formula: "",
                damageType: "",
                context: {},
                default: true,
            };
        }
    }

    const { skills, skillBonusContexts } = CONFIG.A5E;

    $: skillBonus = getAbilityBonus($actor, jsonValue) ?? {};
    $: bonusType = skillBonus.bonusType ?? "check";
    $: skillsContext = skillBonus.context.skills ?? [];
    $: requiresProficiency = skillBonus.context.requiresProficiency ?? false;
</script>

<form>
    <FormSection
        heading="A5E.Label"
        --direction="column"
        --grow="1"
        --margin="0"
    >
        <input
            type="text"
            value={skillBonus.label ?? ""}
            on:change={({ target }) => onUpdateValue("label", target.value)}
        />
    </FormSection>

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

        <FormSection
            heading="A5E.BonusType"
            --background="none"
            --direction="column"
            --padding="0"
        >
            <select
                class="u-w-fit damage-type-select"
                on:change={({ target }) =>
                    onUpdateValue("bonusType", target.value)}
            >
                {#each Object.entries(skillBonusContexts) as [key, name] (key)}
                    <option value={key} selected={bonusType === key}>
                        {localize(name)}
                    </option>
                {/each}
            </select>
        </FormSection>
    </FormSection>

    <FormSection
        heading="Contexts"
        hint="The context determines when the ability bonus applies"
        --direction="column"
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
        overflow: auto;
        background: var(--background, $color-sheet-background);
    }
</style>
