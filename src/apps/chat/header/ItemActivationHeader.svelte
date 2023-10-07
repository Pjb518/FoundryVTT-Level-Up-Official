<script>
    import BaseHeader from "./BaseHeader.svelte";

    // import hexToRGB from "../../../utils/hexToRGB";

    export let message;

    function getSubtitle(name, actionName) {
        if (!actionName || typeof actionName !== "string") return null;
        if (name.trim() === actionName.trim()) return null;

        return actionName;
    }

    const { actionName, img, name } = $message.flags?.a5e;
</script>

<!--
    TODO: Add this below when it comes to changing the chat header to match user colors
    --background-color={hexToRGB(game.user.color, 0.25)}
-->
<BaseHeader
    {img}
    altText={name}
    clickableHeader={true}
    subtitle={getSubtitle(name, actionName)}
    title={name}
    on:toggleCriticalDamage
    on:toggleDescription
/>
