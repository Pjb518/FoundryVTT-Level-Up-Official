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

    <div class="attribute-wrapper attribute-wrapper--{key}">
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

<style lang="scss">
    .attribute-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-around;

        &--acr {
            grid-area: acr;
        }
        &--ani {
            grid-area: ani;
        }
        &--arc {
            grid-area: arc;
        }
        &--ath {
            grid-area: ath;
        }
        &--cul {
            grid-area: cul;
        }
        &--dec {
            grid-area: dec;
        }
        &--eng {
            grid-area: eng;
        }
        &--his {
            grid-area: his;
        }
        &--ins {
            grid-area: ins;
        }
        &--inv {
            grid-area: inv;
        }
        &--itm {
            grid-area: itm;
        }
        &--med {
            grid-area: med;
        }
        &--nat {
            grid-area: nat;
        }
        &--per {
            grid-area: per;
        }
        &--prc {
            grid-area: prc;
        }
        &--prf {
            grid-area: prf;
        }
        &--rel {
            grid-area: rel;
        }
        &--sci {
            grid-area: sci;
        }
        &--slt {
            grid-area: slt;
        }
        &--ste {
            grid-area: ste;
        }
        &--sur {
            grid-area: sur;
        }
    }
</style>
