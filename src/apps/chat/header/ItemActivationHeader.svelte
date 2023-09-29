<script>
    import BaseHeader from "./BaseHeader.svelte";

    export let message;

    function getSubtitle(name, actionName) {
        if (!actionName || typeof actionName !== "string") return null;
        if (name.trim() === actionName.trim()) return null;

        return actionName;
    }

    const { actionName, img, name } = $message.flags?.a5e;
</script>

<BaseHeader
    {img}
    altText={name}
    clickableHeader={true}
    subtitle={getSubtitle(name, actionName)}
    title={name}
    on:toggleCriticalDamage
    on:toggleDescription
/>
