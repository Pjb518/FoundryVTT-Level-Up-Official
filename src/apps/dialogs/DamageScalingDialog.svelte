<script>
    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    function getDamageScalingOptions() {
        return [
            [null, "A5E.None"],
            ...Object.entries(CONFIG.A5E.damageScalingModes),
        ];
    }

    export let actionId;
    export let dialog;
    export let item;
    export let rollId;

    $: roll = $item.actions[actionId].rolls[rollId];
    $: scalingMode = roll.scaling?.mode ?? null;
</script>

<form>
    <FormSection heading="Scaling Mode">
        <RadioGroup
            options={getDamageScalingOptions()}
            selected={scalingMode}
            on:updateSelection={(event) => {
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.scaling.mode`,
                    event.detail
                );
            }}
        />
    </FormSection>

    {#if scalingMode === "cantrip"}
        <FormSection
            heading="Damage Increment"
            hint="This increment will be applied automatically to your damage roll based on your caster level."
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
                        target.value
                    )}
            />
        </FormSection>
    {:else if scalingMode === "spellLevel"}
        <FormSection>
            <section class="row u-flex-wrap">
                <div class="a5e-field-group a5e-field-group--formula">
                    <label for="{actionId}-{rollId}-damage-scaling-formula">
                        Damage Increment
                    </label>

                    <input
                        id="{actionId}-{rollId}-damage-scaling-formula"
                        type="text"
                        name="system.actions.{actionId}.rolls.{rollId}.scaling.formula"
                        value={roll.scaling?.formula ?? 0}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                target.name,
                                target.value
                            )}
                    />
                </div>

                <div class="a5e-field-group u-w-12">
                    <label for="{actionId}-{rollId}-damage-scaling-step">
                        Per
                    </label>

                    <input
                        id="{actionId}-{rollId}-damage-scaling-step"
                        type="number"
                        name="system.actions.{actionId}.rolls.{rollId}.scaling.step"
                        value={roll.scaling?.step ?? 1}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                target.name,
                                parseInt(target.value, 10)
                            )}
                    />
                </div>

                <div class="a5e-field-group levels-wrapper">
                    <span class="levels">Levels</span>
                </div>
            </section>
        </FormSection>
    {/if}
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
    }

    label {
        font-weight: bold;
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
