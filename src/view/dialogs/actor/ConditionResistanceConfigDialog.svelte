<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    type Props = {
        document: Actor;
        propertyKey: string;
    };

    let { document, propertyKey }: Props = $props();
    const actor = document;

    const columns = "A5E.traits.headings.conditions.resistanceColumns";
    const CUSTOM = "__custom__";

    const expertiseOptions = [
        [1, "d4"],
        [2, "d6"],
        [3, "d8"],
        [4, "d10"],
        [5, "d12"],
        [6, "d20"],
    ];

    const conditions = Object.entries(CONFIG.A5E.conditions)
        .filter(([id]) => !/^generic\d+$/.test(id))
        .map(([id, name]) => [id, localize(name as string)])
        .sort((a, b) => a[1].localeCompare(b[1]));

    let resistances = $derived(
        Object.entries(
            foundry.utils.getProperty(actor.reactive._source, propertyKey) ?? {},
        ) as [string, any][],
    );

    function addRow() {
        actor.update({
            [`${propertyKey}.${foundry.utils.randomID()}`]: {
                condition: "",
                custom: false,
            },
        });
    }

    function deleteRow(id: string) {
        actor.update({ [`${propertyKey}.${id}`]: _del });
    }

    function update(id: string, field: string, value: number | string | boolean) {
        updateDocumentDataFromField(actor, `${propertyKey}.${id}.${field}`, value);
    }

    function onSelectCondition(id: string, value: string) {
        if (value === CUSTOM) {
            actor.update({
                [`${propertyKey}.${id}`]: { custom: true, condition: "" },
            });
        } else update(id, "condition", value);
    }
</script>

<article>
    <header class="a5e-section-header a5e-section-header--flat-bottom resistance-table__header">
        <h3 class="a5e-section-header__heading">{localize(`${columns}.condition`)}</h3>

        <h3 class="a5e-section-header__heading a5e-section-header__heading--center">
            {localize(`${columns}.advDis`)}
        </h3>

        <h3 class="a5e-section-header__heading a5e-section-header__heading--center">
            {localize(`${columns}.expertise`)}
        </h3>

        <h3 class="a5e-section-header__heading a5e-section-header__heading--center">
            {localize(`${columns}.bonus`)}
        </h3>

        <button
            type="button"
            class="a5e-section-header__button"
            aria-label={localize(`${columns}.add`)}
            data-tooltip={localize(`${columns}.add`)}
            data-tooltip-direction="UP"
            onclick={addRow}
        >
            <i class="fa-solid fa-plus"></i>
        </button>
    </header>

    <ul class="resistance-table">
        {#each resistances as [id, data] (id)}
            <li class="resistance-table__row">
                {#if data.custom}
                    <input
                        class="a5e-input a5e-input--slim"
                        type="text"
                        value={data.condition}
                        onchange={({ currentTarget }) =>
                            update(id, "condition", currentTarget.value.trim())}
                    />
                {:else}
                    <select
                        class="a5e-input a5e-input--slim"
                        onchange={({ currentTarget }) =>
                            onSelectCondition(id, currentTarget.value)}
                    >
                        <option value="" selected={!data.condition} disabled></option>

                        {#each conditions as [key, name]}
                            <option value={key} selected={data.condition === key}>
                                {name}
                            </option>
                        {/each}

                        <option value={CUSTOM}>{localize(`${columns}.custom`)}</option>
                    </select>
                {/if}

                <select
                    class="a5e-input a5e-input--slim"
                    onchange={({ currentTarget }) =>
                        update(id, "rollMode", Number(currentTarget.value))}
                >
                    <option value="0" selected={!data.rollMode}></option>
                    <option value="1" selected={data.rollMode === 1}>
                        {localize(`${columns}.advantage`)}
                    </option>
                    <option value="-1" selected={data.rollMode === -1}>
                        {localize(`${columns}.disadvantage`)}
                    </option>
                </select>

                <select
                    class="a5e-input a5e-input--slim"
                    onchange={({ currentTarget }) =>
                        update(id, "expertiseDice", Number(currentTarget.value))}
                >
                    <option value="0" selected={!data.expertiseDice}></option>
                    {#each expertiseOptions as [value, label]}
                        <option {value} selected={data.expertiseDice === value}>
                            {label}
                        </option>
                    {/each}
                </select>

                <input
                    class="a5e-input a5e-input--slim a5e-input--small"
                    type="number"
                    step="1"
                    value={data.bonus || ""}
                    onchange={({ currentTarget }) =>
                        update(id, "bonus", Math.trunc(Number(currentTarget.value) || 0))}
                />

                <button
                    type="button"
                    class="resistance-table__delete"
                    aria-label={localize(`${columns}.delete`)}
                    onclick={() => deleteRow(id)}
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
            </li>
        {/each}
    </ul>
</article>

<style lang="scss">
    article {
        --resistance-columns: 1fr 5.5rem 5rem 4rem 1.25rem;

        height: 100%;
        padding: 0.75rem;
        overflow: auto;
    }

    .resistance-table__header {
        grid-template-columns: var(--resistance-columns);
        gap: 0.5rem;
    }

    .resistance-table {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin: 0.5rem 0 0;
        padding: 0;
        list-style: none;

        &__row {
            display: grid;
            grid-template-columns: var(--resistance-columns);
            align-items: center;
            gap: 0.5rem;
            padding: 0 0.5rem;
        }

        &__delete {
            all: unset;
            display: flex;
            justify-content: center;
            cursor: pointer;
            font-size: var(--a5e-sm-text);
            color: var(--a5e-button-gray);
        }
    }
</style>
