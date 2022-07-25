<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import computeTotalAvailableHitDice from "../utils/computeTotalAvailableHitDice";
    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let actor;
    export let availableHitDice;

    $: availableHitDice = computeTotalAvailableHitDice($actor);
</script>

<div class="health-container">
    <meter class="health-bar" min="0" :max="hp.max" :value="hp.value">
        {$actor.system.attributes.hp.value} / {$actor.system.attributes.hp.max}
    </meter>

    <div class="health-bar-values">
        <input
            class="current-hp"
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
            class="max-hp"
            type="number"
            name="system.attributes.hp.max"
            value={$actor.system.attributes.hp.max}
            placeholder="0"
            min="0"
            disabled
        />
    </div>

    <div class="health-secondary-values">
        <input
            class="temp-hp"
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
            class="bonus-hp"
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
        class="rest-button"
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

    <!-- <div class="a5e-config-button a5e-config-button--health"         data-tooltip="A5E.HitPointsConfigurationTooltip"
        data-tooltip-direction="DOWN" >
        <i class="fas fa-cog" />

        <div class="a5e-tooltip a5e-tooltip--health">
            {localize("A5E.HitPointsConfigurationTooltip")}
        </div>
    </div> -->
</div>

<style lang="scss">
    .bonus-hp[type="number"] {
        text-align: left;
    }

    .bonus-hp[type="number"],
    .current-hp[type="number"],
    .max-hp[type="number"],
    .temp-hp[type="number"] {
        border: 0;
        background: transparent;
        color: inherit;
    }

    .bonus-hp[type="number"],
    .temp-hp[type="number"] {
        height: 1.25rem;
        border: 0;
        background: transparent;
        color: inherit;
        border-bottom: 1px solid #bbb;
        border-radius: 0;
        text-align: center;
        padding: 0;

        &:active,
        &:focus {
            box-shadow: none;
        }

        &::placeholder {
            color: inherit;
        }
    }

    .current-hp[type="number"] {
        text-align: right;

        &:active,
        &:focus {
            box-shadow: none;
        }
    }

    .health {
        &-bar {
            position: absolute;
            z-index: -1;
            left: 50%;
            width: 9rem;
            height: 1.2rem;
            appearance: meter;
            transform: translateX(-50%);

            &::-webkit-meter-bar,
            &::-webkit-meter-inner-element {
                width: 100%;
                height: 1.2rem;
                border: 0;
                background: #bbb;
                outline: none;
            }

            // Set the bar colour
            &::-webkit-meter-optimum-value {
                background: #0b5a2f;
            }
        }

        &-container {
            position: absolute;
            bottom: 1.25rem;
            left: 50%;
            width: 9rem;
            height: 1.2rem;
            transform: translateX(-50%);
        }

        &-bar-values,
        &-secondary-values {
            position: absolute;
            left: 50%;
            display: flex;
            width: 9rem;
            height: 1.2rem;
            align-items: center;
            justify-content: center;
            color: lighten(#0b5a2f, 80%);
            font-size: 0.694rem;
            gap: 0.25rem;
            transform: translateX(-50%);
        }

        &-secondary-values {
            bottom: -1.5rem;
            width: 85%;
            color: #aaa;
            gap: 0.5rem;
        }
    }

    .rest-button {
        position: absolute;
        top: 50%;
        left: 0;
        display: flex;
        width: 2rem;
        height: 2rem;
        align-items: center;
        justify-content: center;
        border: 1px solid #ccc;
        background: #f6f2eb;
        border-radius: 50%;
        box-shadow: 0 0 10px #ccc inset;
        color: rgba(0, 0, 0, 0.2);
        cursor: pointer;
        font-size: 1rem;
        transform: translate(-50%, -50%);

        transition: all 0.15s ease-in-out;

        &:hover {
            color: lighten(#191813, 35%);
        }
    }
</style>
