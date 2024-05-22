<script>
    import { getContext } from "svelte";

    import FieldWrapper from "../components/FieldWrapper.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { document, actionId, rollId } = getContext("#external").application;

    function getScalingOptions() {
        return [[null, "A5E.None"], ...Object.entries(CONFIG.A5E.baseScalingModes)];
    }

    const item = document;

    $: roll = $item.actions[actionId].rolls[rollId];
    $: scalingMode = roll.scaling?.mode ?? null;
</script>

<form>
    <RadioGroup
        heading="Scaling Mode"
        options={getScalingOptions()}
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

    {#if scalingMode === "cantrip"}
        <FieldWrapper
            heading="Roll Increment"
            hint="This increment will be applied automatically to your roll based on your caster level."
        >
            <input
                class="a5e-input"
                type="text"
                name="system.actions.{actionId}.rolls.{rollId}.scaling.formula"
                value={roll.scaling?.formula ?? 0}
                on:change={({ target }) =>
                    updateDocumentDataFromField($item, target.name, target.value)}
            />
        </FieldWrapper>
    {:else if scalingMode === "spellLevel"}
        <FieldWrapper>
            <section class="row u-flex-wrap">
                <div
                    class="a5e-field-group a5e-field-group--formula a5e-field-group--spell-level"
                >
                    <label for="{actionId}-{rollId}-roll-scaling-formula">
                        Roll Increment
                    </label>

                    <input
                        id="{actionId}-{rollId}-roll-scaling-formula"
                        type="text"
                        name="system.actions.{actionId}.rolls.{rollId}.scaling.formula"
                        value={roll.scaling?.formula ?? 0}
                        on:change={({ target }) =>
                            updateDocumentDataFromField($item, target.name, target.value)}
                    />
                </div>

                <div class="a5e-field-group u-w-12 a5e-field-group--spell-level">
                    <label for="{actionId}-{rollId}-roll-scaling-step"> Per </label>

                    <input
                        id="{actionId}-{rollId}-roll-scaling-step"
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

                <small>
                    This increment will be applied automatically to your roll based the
                    spell slot used during activation.
                </small>
            </section>
        </FieldWrapper>
    {:else if ["artifactCharges", "spellPoints", "actionUses", "itemUses"].includes(scalingMode)}
        <FieldWrapper>
            <section class="row u-flex-wrap">
                <div class="a5e-field-group a5e-field-group--formula">
                    <label for="{actionId}-{rollId}-roll-scaling-formula">
                        Roll Increment
                    </label>

                    <input
                        id="{actionId}-{rollId}-roll-scaling-formula"
                        type="text"
                        name="system.actions.{actionId}.rolls.{rollId}.scaling.formula"
                        value={roll.scaling?.formula ?? 0}
                        on:change={({ target }) =>
                            updateDocumentDataFromField($item, target.name, target.value)}
                    />
                </div>

                <div class="a5e-field-group u-w-12">
                    <label for="{actionId}-{rollId}-roll-scaling-step"> Per </label>

                    <input
                        id="{actionId}-{rollId}-roll-scaling-step"
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
                        Additional {scalingMode === "spellPoints" ? "Points" : "Uses"}
                    </span>
                </div>
            </section>
        </FieldWrapper>
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

    small {
        margin-top: 0.125rem;
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
