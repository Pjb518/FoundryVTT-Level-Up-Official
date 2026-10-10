<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";

    type Props = {
        data: any;
        onchange: (value: any) => void;
    };

    let { data, onchange }: Props = $props();

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

    let value = $state({
        condition: data?.condition ?? "",
        custom: data?.custom ?? false,
        rollMode: data?.rollMode ?? 0,
        expertiseDice: data?.expertiseDice ?? 0,
        bonus: data?.bonus ?? 0,
    });

    function update(field: string, fieldValue: number | string | boolean) {
        value[field] = fieldValue;
        onchange({ ...value });
    }

    function onSelectCondition(selected: string) {
        if (selected === CUSTOM) {
            value.custom = true;
            update("condition", "");
        } else update("condition", selected);
    }
</script>

<div class="u-w-full">
    <div class="resistance-value">
        {#if value.custom}
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                value={value.condition}
                onchange={({ currentTarget }) =>
                    update("condition", currentTarget.value.trim())}
            />
        {:else}
            <select
                class="a5e-input a5e-input--slim"
                onchange={({ currentTarget }) =>
                    onSelectCondition(currentTarget.value)}
            >
                <option value="" selected={!value.condition} disabled></option>

                {#each conditions as [key, name]}
                    <option value={key} selected={value.condition === key}>
                        {name}
                    </option>
                {/each}

                <option value={CUSTOM}>{localize(`${columns}.custom`)}</option>
            </select>
        {/if}

        <select
            class="a5e-input a5e-input--slim"
            onchange={({ currentTarget }) =>
                update("rollMode", Number(currentTarget.value))}
        >
            <option value="0" selected={!value.rollMode}>
                {localize(`${columns}.advDis`)}
            </option>
            <option value="1" selected={value.rollMode === 1}>
                {localize(`${columns}.advantage`)}
            </option>
            <option value="-1" selected={value.rollMode === -1}>
                {localize(`${columns}.disadvantage`)}
            </option>
        </select>

        <select
            class="a5e-input a5e-input--slim"
            onchange={({ currentTarget }) =>
                update("expertiseDice", Number(currentTarget.value))}
        >
            <option value="0" selected={!value.expertiseDice}>
                {localize(`${columns}.expertise`)}
            </option>
            {#each expertiseOptions as [die, label]}
                <option value={die} selected={value.expertiseDice === die}>
                    {label}
                </option>
            {/each}
        </select>

        <input
            class="a5e-input a5e-input--slim a5e-input--small"
            type="number"
            step="1"
            placeholder={localize(`${columns}.bonus`)}
            value={value.bonus || ""}
            onchange={({ currentTarget }) =>
                update("bonus", Math.trunc(Number(currentTarget.value) || 0))}
        />
    </div>
</div>

<style lang="scss">
    .resistance-value {
        display: grid;
        grid-template-columns: 1fr 5.5rem 5rem 4.5rem;
        gap: 0.5rem;
    }
</style>
