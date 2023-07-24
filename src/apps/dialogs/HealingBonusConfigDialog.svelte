<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import Checkbox from "../components/Checkbox.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import FormSection from "../components/FormSection.svelte";

    export let { actor, healingBonusId } = getContext("#external").application;

    const { healingBonusContexts, healingTypes } = CONFIG.A5E;

    $: healingBonus = $actor.system.bonuses.healing[healingBonusId];
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
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $actor,
                    `system.bonuses.healing.${healingBonusId}.label`,
                    target.value
                )}
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
                    updateDocumentDataFromField(
                        $actor,
                        `system.bonuses.healing.${healingBonusId}.formula`,
                        target.value
                    )}
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
                    updateDocumentDataFromField(
                        $actor,
                        `system.bonuses.healing.${healingBonusId}.healingType`,
                        target.value
                    )}
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
        heading="Context"
        hint="The context determines when the healing bonus applies"
    >
        <RadioGroup
            options={Object.entries(healingBonusContexts)}
            selected={healingBonus.context}
            allowDeselect={false}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField(
                    $actor,
                    `system.bonuses.healing.${healingBonusId}.context`,
                    detail
                )}
        />
    </FormSection>

    <FormSection>
        <Checkbox
            label="Select Healing Bonus Automatically in Roll Prompt"
            checked={healingBonus.default ?? true}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    `system.bonuses.healing.${healingBonusId}.default`,
                    detail
                );
            }}
        />
    </FormSection>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
        overflow: auto;
        background: rgba(246, 242, 235, 0.5);
    }
</style>
