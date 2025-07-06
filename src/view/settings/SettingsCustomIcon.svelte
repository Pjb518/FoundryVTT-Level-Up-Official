<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    type Props = {
        conditionKey: string;
        icon: string;

        onUpdateConditionIcon: (args: any[]) => void;
    };

    let { conditionKey, icon, onUpdateConditionIcon }: Props = $props();

    function getConditionName() {
        if (conditionKey === "dead") return localize("A5E.ConditionDead");
        if (conditionKey === "concentration")
            return localize("A5E.ConditionConcentration");

        return conditions[conditionKey] ?? conditionKey;
    }

    const { conditions, conditionIconsDefault } = CONFIG.A5E;

    let settings: Record<string, { data: any; value: any }> =
        getContext("settings");

    const conditionName = getConditionName();
    const iconStore = settings["customConditionIcons"].value;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<li
    class="condition-grid__item"
    onclick={() =>
        onUpdateConditionIcon([
            conditionKey,
            icon ||
                iconStore[conditionKey] ||
                conditionIconsDefault[conditionKey],
        ])}
>
    <img
        class="condition-icon"
        src={icon ||
            iconStore[conditionKey] ||
            conditionIconsDefault[conditionKey]}
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
        border-radius: var(--a5e-border-radius-standard);
        cursor: pointer;
    }

    .condition-icon {
        height: 1.5rem;
        width: 1.5rem;
        object-fit: cover;
    }
</style>
