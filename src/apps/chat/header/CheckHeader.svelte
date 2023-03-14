<script>
    import { createEventDispatcher } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import BaseHeader from "./BaseHeader.svelte";

    export let message;

    function getTitle() {
        const ability = localize(abilities[abilityKey]);

        switch ($message?.flags?.a5e?.cardType) {
            case "abilityCheck":
                return localize("A5E.AbilityCheckSpecific", { ability });
            case "hitDice":
                return $message?.flags?.a5e?.title;
            case "savingThrow":
                return localize("A5E.SavingThrowSpecific", { ability });
            case "skillCheck":
                const { skillKey } = $message?.flags?.a5e;
                const skill = localize(skills[skillKey]);
                return localize("A5E.SkillCheck", { skill });
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

    const dispatch = createEventDispatcher();
    const { abilities, skills } = CONFIG.A5E;
    const { abilityKey, img, name } = $message?.flags?.a5e;
</script>

<BaseHeader
    {img}
    altText={name}
    title={getTitle()}
    subtitle={getSubtitle()}
    on:repeatCard={() => dispatch("repeatCard")}
/>
