<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import BaseHeader from "./BaseHeader.svelte";

    export let message;

    function getTitle() {
        switch ($message?.flags?.a5e?.cardType) {
            case "abilityCheck":
                return `${localize(abilities[abilityKey])} Check`;
            case "savingThrow":
                return `${localize(abilities[abilityKey])} Save`;
            case "skillCheck":
                const { skillKey } = $message?.flags?.a5e;
                return `${localize(skills[skillKey])} Check`;
        }
    }

    function getSubtitle() {
        switch ($message?.flags?.a5e?.cardType) {
            case "skillCheck":
                return localize(abilities[abilityKey] ?? "No Ability Selected");
            default:
                return null;
        }
    }

    const { abilities, skills } = CONFIG.A5E;
    const { abilityKey, img, name } = $message?.flags?.a5e;
</script>

<BaseHeader {img} altText={name} title={getTitle()} subtitle={getSubtitle()} />
