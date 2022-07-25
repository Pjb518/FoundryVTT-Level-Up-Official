<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import computeTotalAvailableHitDice from "../utils/computeTotalAvailableHitDice";
    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let actor;
    export let availableHitDice;

    $: availableHitDice = computeTotalAvailableHitDice($actor);
</script>

<div class="a5e-health-container">
    <meter class="a5e-health-bar" min="0" :max="hp.max" :value="hp.value">
        {$actor.system.attributes.hp.value} / {$actor.system.attributes.hp.max}
    </meter>

    <div class="a5e-health-bar__text">
        <input
            class="a5e-health-bar__current-hp"
            type="number"
            name="system.attributes.hp.value"
            value={$actor.system.attributes.hp.value}
            placeholder="0"
            min="0"
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $actor,
                    target.name,
                    Number(target.value)
                )}
        />
        /
        <input
            class="a5e-health-bar__max-hp"
            type="number"
            name="system.attributes.hp.max"
            value={$actor.system.attributes.hp.max}
            placeholder="0"
            min="0"
            disabled
        />
    </div>

    <div class="a5e-health-bar__text a5e-health-bar__text--secondary">
        <input
            class="a5e-health-bar__temp-hp"
            type="number"
            name="system.attributes.hp.temp"
            min="0"
            value={$actor.system.attributes.hp.temp || ""}
            placeholder={localize("A5E.HitPointsTemporaryLabel")}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $actor,
                    target.name,
                    Number(target.value)
                )}
        />

        <input
            class="a5e-health-bar__bonus-hp"
            type="number"
            name="data.attributes.hp.bonus"
            data-dtype="Number"
            value={$actor.system.attributes.hp.bonus || ""}
            placeholder={localize("A5E.HitPointsMaxModifierLabel")}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $actor,
                    target.name,
                    Number(target.value)
                )}
        />
    </div>

    <div
        class="a5e-health-bar__rest-button"
        data-tooltip="A5E.Rest"
        data-tooltip-direction="DOWN"
    >
        <i class="fas fa-campground" />
    </div>

    <div
        class="a5e-config-button--health u-font-serif u-text-medium"
        data-tooltip="A5E.HitDiceRemaining"
        data-tooltip-direction="DOWN"
    >
        {availableHitDice}
    </div>

    <!-- <div v-else class="a5e-config-button a5e-config-button--health"         data-tooltip="A5E.HitPointsConfigurationTooltip"
        data-tooltip-direction="DOWN" >
        <i class="fas fa-cog" />

        <div class="a5e-tooltip a5e-tooltip--health">
            {localize("A5E.HitPointsConfigurationTooltip")}
        </div>
    </div> -->
</div>

<style lang="scss">
</style>
