<script lang="ts">
    import { getDeterministicBonus } from "../../../../dice/getDeterministicBonus.ts";
    import { getExpertiseDieSize } from "#utils/getExpertiseDieSize.ts";
    import { replaceHyphenWithMinusSign } from "#utils/replaceHyphenWithMinusSign";

    function getSkillBonus(skill) {
        const skillBonus = skill.deterministicBonus;

        const checkBonus = getDeterministicBonus(
            actor.BonusesManager.getAbilityBonusesFormula(skill.ability, "check"),
            actor.getRollData(),
        );
        return skillBonus - checkBonus;
    }

    function prepareTooltip(skillBonus, abilityBonus, expertiseDice) {
        let tooltip = replaceHyphenWithMinusSign(skillBonus + abilityBonus);
        if (expertiseDice) {
            tooltip += ` (${getExpertiseDieSize(expertiseDice, false)})`;
        }

        return tooltip;
    }

    let { actor, propData = {} } = $props();

    const actorData = $derived(actor?.system);
    let actorStore = $derived(actor.reactive.system);
</script>

{#each Object.entries(actorData.skills ?? {}) as [key, attribute]}
    {@const proficient = attribute.proficient}
    {@const abilityBonus = actorData.abilities[attribute.ability].check.mod}
    {@const skillBonus = getSkillBonus(attribute)}

    <div
        class="a5e-party-viewer__attribute-wrapper a5e-party-viewer__skills__value--{key}"
    >
        {#if proficient}
            <span>
                <i
                    class="icon fa-solid fa-star"
                    data-tooltip={prepareTooltip(
                        skillBonus,
                        abilityBonus,
                        attribute.expertiseDice,
                    )}
                    data-tooltip-direction="UP"
                >
                </i>
            </span>
        {/if}
    </div>
{/each}
