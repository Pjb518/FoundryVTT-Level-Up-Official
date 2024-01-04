<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store/fvtt/document";

    import FormSection from "../components/LegacyFormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { document, actionId, rollId } =
        getContext("#external").application;

    function getHealingScalingOptions() {
        return [
            [null, "A5E.None"],
            ...Object.entries(CONFIG.A5E.healingScalingModes),
        ];
    }

    const item = document;

    $: roll = $item.actions[actionId].rolls[rollId];
    $: scalingMode = roll.scaling?.mode ?? null;
</script>

<form>
    <FormSection heading="Scaling Mode">
        <RadioGroup
            options={getHealingScalingOptions()}
            selected={scalingMode}
            allowDeselect={false}
            on:updateSelection={(event) => {
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.scaling.mode`,
                    event.detail,
                );
            }}
        />
    </FormSection>

    {#if scalingMode === "cantrip"}
        <FormSection
            heading="Healing Increment"
            hint="This increment will be applied automatically to your healing roll based on your caster level."
        >
            <input
                class="a5e-input"
                type="text"
                name="system.actions.{actionId}.rolls.{rollId}.scaling.formula"
                value={roll.scaling?.formula ?? 0}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        target.value,
                    )}
            />
        </FormSection>
    {:else if scalingMode === "spellLevel"}
        <FormSection>
            <section class="row u-flex-wrap">
                <div
                    class="a5e-field-group a5e-field-group--formula a5e-field-group--spell-level"
                >
                    <label for="{actionId}-{rollId}-healing-scaling-formula">
                        Healing Increment
                    </label>

                    <input
                        id="{actionId}-{rollId}-healing-scaling-formula"
                        type="text"
                        name="system.actions.{actionId}.rolls.{rollId}.scaling.formula"
                        value={roll.scaling?.formula ?? 0}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                target.name,
                                target.value,
                            )}
                    />
                </div>

                <div
                    class="a5e-field-group u-w-12 a5e-field-group--spell-level"
                >
                    <label for="{actionId}-{rollId}-healing-scaling-step">
                        Per
                    </label>

                    <input
                        id="{actionId}-{rollId}-healing-scaling-step"
                        type="number"
                        name="system.actions.{actionId}.rolls.{rollId}.scaling.step"
                        value={roll.scaling?.step ?? 1}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                target.name,
                                parseInt(target.value, 10),
                            )}
                    />
                </div>

                <div class="a5e-field-group levels-wrapper">
                    <span class="levels">Levels</span>
                </div>
            </section>
        </FormSection>
    {:else if ["spellPoints", "actionUses", "itemUses"].includes(scalingMode)}
        <FormSection>
            <section class="row u-flex-wrap">
                <div class="a5e-field-group a5e-field-group--formula">
                    <label for="{actionId}-{rollId}-healing-scaling-formula">
                        Healing Increment
                    </label>

                    <input
                        id="{actionId}-{rollId}-healing-scaling-formula"
                        type="text"
                        name="system.actions.{actionId}.rolls.{rollId}.scaling.formula"
                        value={roll.scaling?.formula ?? 0}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                target.name,
                                target.value,
                            )}
                    />
                </div>

                <div class="a5e-field-group u-w-12">
                    <label for="{actionId}-{rollId}-healing-scaling-step">
                        Per
                    </label>

                    <input
                        id="{actionId}-{rollId}-healing-scaling-step"
                        style="text-align: center;"
                        type="number"
                        name="system.actions.{actionId}.rolls.{rollId}.scaling.step"
                        value={roll.scaling?.step ?? 1}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                target.name,
                                parseInt(target.value, 10),
                            )}
                    />
                </div>

                <div class="a5e-field-group levels-wrapper">
                    <span class="levels">
                        Additional {scalingMode === "spellPoints"
                            ? "Points"
                            : "Uses"}
                    </span>
                </div>
            </section>
        </FormSection>
    {/if}
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
    }

    label {
        font-weight: bold;
        font-size: $font-size-sm;
    }

    input {
        height: 2rem;
        font-size: $font-size-sm;
    }

    .a5e-field-group--spell-level {
        gap: 0.375rem;
    }

    .levels {
        display: flex;
        align-items: center;
        height: 1.625rem;
    }

    .levels-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    .row {
        display: flex;
        gap: 0.5rem;
        width: 100%;
    }
</style>
