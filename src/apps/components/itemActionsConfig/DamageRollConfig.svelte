<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const actionId = getContext("actionId");

    const A5E = CONFIG.A5E;

    export let roll;
    export let rollId;
</script>

<section class="action-config__wrapper">
    <div class="a5e-field-group a5e-field-group--label">
        <label for={`${actionId}-${rollId}-label`}>
            {localize("A5E.Label")}
        </label>

        <input
            id={`${actionId}-${rollId}-label`}
            name={`${actionId}-${rollId}-label`}
            type="text"
            value={roll.label ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.label`,
                    target.value
                )}
        />
    </div>

    <section class="row">
        <div class="a5e-field-group a5e-field-group--formula">
            <label for={`${actionId}-${rollId}-damage-formula`}>
                {localize("A5E.DamageFormula")}
            </label>

            <input
                id={`${actionId}-${rollId}-damage-formula`}
                name={`${actionId}-${rollId}-damage-formula`}
                type="text"
                value={roll.formula ?? ""}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.rolls.${rollId}.formula`,
                        target.value
                    )}
            />
        </div>

        <div class="a5e-field-group">
            <label for={`${actionId}-${rollId}-damage-type`}>
                {localize("A5E.DamageType")}
            </label>

            <select
                id={`${actionId}-${rollId}-damage-type`}
                class="u-w-fit"
                name={`${actionId}-${rollId}-damage-type`}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.rolls.${rollId}.damageType`,
                        target.value
                    )}
            >
                <option value={null} selected={roll.damageType === "null"}>
                    {localize("A5E.None")}
                </option>

                {#each Object.entries(A5E.damageTypes) as [key, name] (key)}
                    <option value={key} selected={roll.damageType === key}>
                        {localize(name)}
                    </option>
                {/each}
            </select>
        </div>
    </section>

    <div class="a5e-field-group a5e-field-group--checkbox">
        <input
            id={`${actionId}-${rollId}-can-crit`}
            class="checkbox"
            name={`${actionId}-${rollId}-can-crit`}
            type="checkbox"
            checked={roll.canCrit ?? true}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.canCrit`,
                    target.checked
                )}
        />

        <label for={`${actionId}-${rollId}-can-crit`}>
            {localize("A5E.DamageDoubleOnCrit")}
        </label>
    </div>

    {#if roll.canCrit ?? true}
        <div class="a5e-field-group">
            <label for={`${actionId}-${rollId}-crit-bonus`}>
                {localize("A5E.DamageBonusOnCrit")}
            </label>

            <p class="a5e-field-group__hint">
                When you score a critical hit, this damage is added after
                doubling the attack's damage.
            </p>

            <input
                id={`${actionId}-${rollId}-crit-bonus`}
                name={`${actionId}-${rollId}-crit-bonus`}
                type="text"
                value={roll.critBonus ?? ""}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.rolls.${rollId}.critBonus`,
                        target.value
                    )}
            />
        </div>
    {/if}

    <div class="a5e-field-group a5e-field-group--checkbox">
        <input
            id={`${actionId}-${rollId}-default`}
            class="checkbox"
            name={`${actionId}-${rollId}-default`}
            type="checkbox"
            checked={roll.default ?? true}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.default`,
                    target.checked
                )}
        />

        <label for={`${actionId}-${rollId}-default`}>
            {localize("A5E.DamageDefaultSelection")}
        </label>
    </div>
</section>

<style lang="scss">
    .checkbox {
        margin: 0;
    }

    .row {
        display: flex;
        gap: 0.5rem;
        width: 100%;
    }
</style>
