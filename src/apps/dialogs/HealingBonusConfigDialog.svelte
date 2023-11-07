<script>
    import { getContext, createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import Checkbox from "../components/Checkbox.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import FormSection from "../components/FormSection.svelte";
    import TagGroup from "../components/TagGroup.svelte";

    export let { actor, healingBonusId } = getContext("#external").application;
    export let jsonValue = null;

    const dispatch = createEventDispatcher();

    function onUpdateValue(key, value) {
        if (jsonValue === null) {
            key = `system.bonuses.healing.${healingBonusId}.${key}`;
            updateDocumentDataFromField($actor, key, value);
            return;
        }

        const newObj = { ...healingBonus, [key]: value };
        dispatch("change", JSON.stringify(newObj));
    }

    function getHealingBonus() {
        if (jsonValue === null)
            return $actor.system.bonuses.healing[healingBonusId];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.formula = obj.formula ?? "";
            obj.healingType = obj.healingType ?? "";
            obj.context = obj.context ?? "all";
            obj.default = obj.default ?? true;
            return obj;
        } catch (error) {
            return {
                label: "",
                formula: "",
                healingType: "",
                context: "all",
                default: true,
            };
        }
    }

    const { healingBonusContexts, healingTypes, spellLevels } = CONFIG.A5E;

    $: healingBonus = getHealingBonus($actor, jsonValue) ?? {};
    $: healingTypesContext = healingBonus.context.healingTypes ?? [];
    $: spellLevelsContext = healingBonus.context.spellLevels ?? [];
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
            value={healingBonus.label ?? ""}
            on:change={({ target }) => onUpdateValue("label", target.value)}
        />
    </FormSection>

    <FormSection>
        <FormSection
            heading="A5E.HealingFormula"
            --background="none"
            --grow="1"
            --direction="column"
            --padding="0"
        >
            <input
                type="text"
                value={healingBonus.formula ?? ""}
                on:change={({ target }) =>
                    onUpdateValue("formula", target.value)}
            />
        </FormSection>

        <FormSection
            heading="A5E.HealingType"
            --background="none"
            --direction="column"
            --padding="0"
        >
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
        </FormSection>
    </FormSection>

    <FormSection
        heading="Contexts"
        hint="The context determines when the healing bonus applies"
        --direction="column"
    >
        <!-- <RadioGroup
            options={Object.entries(healingBonusContexts)}
            selected={healingBonus.context}
            allowDeselect={false}
            on:updateSelection={({ detail }) =>
                onUpdateValue("context", detail)}
        /> -->

        <TagGroup
            heading="A5E.contexts.healingType"
            tags={healingBonusContexts}
            bind:selected={healingTypesContext}
            updateFunction={() =>
                onUpdateValue("context.healingTypes", healingTypesContext)}
        />

        <TagGroup
            heading="A5E.contexts.spellLevel"
            tags={spellLevels}
            bind:selected={spellLevelsContext}
            updateFunction={() =>
                onUpdateValue("context.spellLevels", spellLevelsContext)}
        />
    </FormSection>

    <FormSection>
        <Checkbox
            label="Select Healing Bonus Automatically in Roll Prompt"
            checked={healingBonus.default ?? true}
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
