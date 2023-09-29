<script>
    import { createEventDispatcher, getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    export let conditionKey;
    export let icon;

    function getConditionName() {
        if (conditionKey === "dead") return localize("A5E.ConditionDead");
        if (conditionKey === "concentration")
            return localize("A5E.ConditionConcentration");

        return conditions[conditionKey] ?? conditionKey;
    }

    const { conditions, conditionIcons } = CONFIG.A5E;

    const dispatch = createEventDispatcher();
    const settings = getContext("settings");

    const conditionName = getConditionName();
    const iconStore = settings.getStore(`${conditionKey}ConditionCustomIcon`);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<li
    class="condition-grid__item"
    on:click={() =>
        dispatch("updateConditionIcon", [
            conditionKey,
            icon || $iconStore || conditionIcons[conditionKey],
        ])}
>
    <img
        class="condition-icon"
        src={icon || $iconStore || conditionIcons[conditionKey]}
        alt={getConditionName()}
    />

    {conditionName}
</li>

<style lang="scss">
    .condition-grid__item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.125rem;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 3px;
        cursor: pointer;
    }

    .condition-icon {
        height: 1.5rem;
        width: 1.5rem;
        object-fit: cover;
    }
</style>
