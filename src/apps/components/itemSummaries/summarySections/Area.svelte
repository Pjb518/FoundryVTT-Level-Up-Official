<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import validateTemplateData from "../../../../utils/measuredTemplates/validateTemplateData";

    export let actionId;
    export let item;

    function getAreaLabel({ area } = {}) {
        if (!validateTemplateData(item, actionId ?? item.actions.keys()[0])) {
            return null;
        }

        switch (area.shape) {
            case "circle":
                return localize("A5E.AreaCircleSpecific", {
                    radius: area.radius,
                });
            case "cone":
                return localize("A5E.AreaConeSpecific", {
                    length: area.length,
                });
            case "cube":
                return localize("A5E.AreaCubeSpecific", { width: area.width });
            case "cylinder":
                if (area.height) {
                    return localize("A5E.AreaCylinderSpecific", {
                        height: area.height,
                        radius: area.radius,
                    });
                } else {
                    return localize("A5E.AreaCylinderSpecificNoHeight", {
                        radius: area.radius,
                    });
                }
            case "line":
                return localize("A5E.AreaLineSpecific", {
                    width: area.width ?? 5,
                    length: area.length,
                });
            case "sphere":
                return localize("A5E.AreaSphereSpecific", {
                    radius: area.radius,
                });
            case "square":
                return localize("A5E.AreaSquareSpecific", {
                    width: area.width,
                });
        }
    }

    $: action = item.actions[actionId] ?? item.actions.values()[0];
    $: area = getAreaLabel(action);

    $: showArea = (actionId && area) || (item.actions.count === 1 && area);
</script>

{#if showArea}
    <div class="summary-group">
        <dt>{localize("A5E.TargetArea")}:</dt>
        <dd>
            {area}

            {#if action?.area?.quantity > 1}
                (&times;{action?.area?.quantity})
            {/if}
        </dd>
    </div>
{/if}

<style lang="scss">
    dt {
        white-space: nowrap;
    }

    dd {
        margin: 0;
        padding: 0;
    }

    .summary-group {
        display: flex;
        align-items: flex-start;
        gap: 0.25rem;
    }
</style>
