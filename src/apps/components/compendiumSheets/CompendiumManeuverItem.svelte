<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import ImportButton from "../ImportButton.svelte";

    export let document;

    function onDragStart(event) {
        const data = {
            type: collection.documentName,
            uuid: collection.getUuid(document._id),
        };
        return event.dataTransfer.setData("text/plain", JSON.stringify(data));
    }

    function getManeuverDetailsLabel(maneuver) {
        const maneuverDegree =
            maneuverDegrees[parseInt(maneuver.system.degree, 10)];

        const tradition = maneuverTraditions[maneuver.system.tradition] ?? "";
        const stance = maneuver.system.isStance ? "Stance" : "";

        const exertionCost = maneuver.system.exertionCost
            ? `(${maneuver.system.exertionCost} ${localize(
                  maneuver.system.exertionCost > 1
                      ? "A5E.ExertionPointPlural"
                      : "A5E.ExertionPoint",
              )})`
            : "";

        const maneuverProperties = [
            maneuverDegree,
            tradition,
            stance,
            exertionCost,
        ]
            .filter(Boolean)
            .join(" ");

        return maneuverProperties;
    }

    const collection = getContext("collection");
    const { maneuverDegrees, maneuverTraditions } = CONFIG.A5E;

    $: maneuverDetails = getManeuverDetailsLabel(document);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<li
    class="a5efc-document"
    draggable="true"
    on:click={async () => {
        const doc =
            collection.get(document._id) ??
            (await collection.getDocument(document._id));
        doc.sheet?.render(true);
    }}
    on:dragstart={onDragStart}
>
    <img class="a5efc-document__image" src={document.img} alt={document.name} />

    <h3 class="a5efc-document__name">
        {document.name}

        {#if document.system.isStance}
            <i
                class="a5efc-document__icon fa-solid fa-street-view"
                data-tooltip="Stance"
                data-tooltip-direction="UP"
            />
        {/if}
    </h3>

    <span class="a5efc-document__details">
        {maneuverDetails}
    </span>

    <ImportButton {document} />
</li>
