<script>
    import { getContext, createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import Checkbox from "../components/Checkbox.svelte";
    import FormSection from "../components/FormSection.svelte";
    import TagGroup from "../components/TagGroup.svelte";

    export let { actor, damageBonusId } = getContext("#external").application;
    export let jsonValue = null;

    const dispatch = createEventDispatcher();

    function onUpdateValue(key, value) {
        if (jsonValue === null) {
            key = `system.bonuses.damage.${damageBonusId}.${key}`;
            console.log(key, value);
            updateDocumentDataFromField($actor, key, value);
            return;
        }

        const newObj = { ...damageBonus, [key]: value };
        dispatch("change", JSON.stringify(newObj));
    }

    function getDamageBonus() {
        if (jsonValue === null)
            return $actor.system.bonuses.damage[damageBonusId];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.formula = obj.formula ?? "";
            obj.damageType = obj.damageType ?? "";
            obj.context = obj.context ?? {};
            obj.default = obj.default ?? true;
            return obj;
        } catch (error) {
            return {
                label: "",
                formula: "",
                damageType: "",
                context: "all",
                default: true,
            };
        }
    }

    const { damageBonusContexts, damageTypes, spellLevels } = CONFIG.A5E;

    $: damageBonus = getDamageBonus($actor, jsonValue) ?? {};
    $: attackTypesContext = damageBonus.context.attackTypes ?? [];
    $: damageTypesContext = damageBonus.context.damageTypes ?? [];
    $: spellLevelsContext = damageBonus.context.spellLevels ?? [];
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
            value={damageBonus.label ?? ""}
            on:change={({ target }) => onUpdateValue("label", target.value)}
        />
    </FormSection>

    <FormSection>
        <FormSection
            heading="A5E.DamageFormula"
            --background="none"
            --grow="1"
            --direction="column"
            --padding="0"
        >
            <input
                type="text"
                value={damageBonus.formula ?? ""}
                on:change={({ target }) =>
                    onUpdateValue("formula", target.value)}
            />
        </FormSection>

        <FormSection
            heading="A5E.DamageType"
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
                    selected={damageBonus.damageType === "null" ||
                        damageBonus.damageType === null}
                >
                    {localize("A5E.None")}
                </option>

                {#each Object.entries(damageTypes) as [key, name] (key)}
                    <option
                        value={key}
                        selected={damageBonus.damageType === key}
                    >
                        {localize(name)}
                    </option>
                {/each}
            </select>
        </FormSection>
    </FormSection>

    <FormSection
        heading="Contexts"
        hint="The context determines when the damage bonus applies"
        --direction="column"
    >
        <TagGroup
            heading="A5E.contexts.attackType"
            tags={damageBonusContexts}
            bind:selected={attackTypesContext}
            updateFunction={() =>
                onUpdateValue("context.attackTypes", attackTypesContext)}
        />

        <TagGroup
            heading="A5E.contexts.damageType"
            tags={damageTypes}
            bind:selected={damageTypesContext}
            updateFunction={() =>
                onUpdateValue("context.damageTypes", damageTypesContext)}
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
            label="Select Damage Bonus Automatically in Roll Prompt"
            checked={damageBonus.default ?? true}
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
