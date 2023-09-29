<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    export let conditionKey;
    export let reload;

    function getConditionName() {
        if (conditionKey === "dead") return localize("A5E.ConditionDead");
        if (conditionKey === "concentration")
            return localize("A5E.ConditionConcentration");

        return conditions[conditionKey] ?? conditionKey;
    }

    function updateConditionIcon() {
        const current =
            updates.get(`${conditionKey}ConditionCustomIcon`) ||
            $iconStore ||
            conditionIcons[conditionKey];

        const filePicker = new FilePicker({
            type: "image",
            current,
            callback: (path) => {
                updates.set(`${conditionKey}ConditionCustomIcon`, path);
                iconSrc = path;
                reload = true;
            },
        });

        filePicker.browse();
    }

    const { conditions, conditionIcons } = CONFIG.A5E;

    const settings = getContext("settings");
    const updates = getContext("updates");

    const conditionName = getConditionName();
    const iconStore = settings.getStore(`${conditionKey}ConditionCustomIcon`);

    let iconSrc =
        updates.get(`${conditionKey}ConditionCustomIcon`) ||
        $iconStore ||
        conditionIcons[conditionKey];
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<li class="condition-grid__item" on:click={updateConditionIcon}>
    <img class="condition-icon" src={iconSrc} alt={getConditionName()} />

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
