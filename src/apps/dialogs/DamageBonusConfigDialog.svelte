<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import Checkbox from "../components/Checkbox.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import FormSection from "../components/FormSection.svelte";

    export let { actor, damageBonusId } = getContext("#external").application;

    const { damageBonusContexts, damageTypes } = CONFIG.A5E;

    $: damageBonus = $actor.system.bonuses.damage[damageBonusId];
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
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $actor,
                    `system.bonuses.damage.${damageBonusId}.label`,
                    target.value
                )}
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
                    updateDocumentDataFromField(
                        $actor,
                        `system.bonuses.damage.${damageBonusId}.formula`,
                        target.value
                    )}
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
                    updateDocumentDataFromField(
                        $actor,
                        `system.bonuses.damage.${damageBonusId}.damageType`,
                        target.value
                    )}
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
        heading="Context"
        hint="The context determines when the damage bonus applies"
    >
        <RadioGroup
            options={Object.entries(damageBonusContexts)}
            selected={damageBonus.context}
            allowDeselect={false}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField(
                    $actor,
                    `system.bonuses.damage.${damageBonusId}.context`,
                    detail
                )}
        />
    </FormSection>

    <FormSection>
        <Checkbox
            label="Select Damage Bonus Automatically in Roll Prompt"
            checked={damageBonus.default ?? true}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    `system.bonuses.damage.${damageBonusId}.default`,
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
