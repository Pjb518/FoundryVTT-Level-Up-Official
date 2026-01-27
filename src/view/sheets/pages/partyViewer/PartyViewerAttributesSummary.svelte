<script>
    import { replaceHyphenWithMinusSign } from "#utils/replaceHyphenWithMinusSign";

    let { actor, propData = {} } = $props();

    const actorData = $derived(actor?.system);
    const abilities = CONFIG.A5E.abilities;
</script>

{#each Object.entries(actorData.abilities ?? {}) as [key, attribute]}
    {@const proficient = attribute.save.proficient}
    {@const abilityLabel = abilities[key]}

    <div class="a5e-party-viewer__attribute-wrapper a5e-party-viewer__attribute--{key}">
        <div
            class="a5e-party-viewer__attribute-wrapper__check"
            data-tooltip="{abilityLabel} Check Modifier"
            data-tooltip-direction="UP"
        >
            <span>
                {replaceHyphenWithMinusSign(attribute?.check?.deterministicBonus)}
            </span>
        </div>

        <div
            class="a5e-party-viewer__attribute-wrapper__save"
            class:a5e-party-viewer__attribute-wrapper__save--proficient={proficient}
            data-tooltip={proficient
                ? `${abilityLabel} Saving Throw Modifier (Proficient)`
                : `${abilityLabel} Saving Throw Modifier`}
            data-tooltip-direction="UP"
        >
            <span>
                {replaceHyphenWithMinusSign(attribute?.save?.deterministicBonus)}
            </span>
        </div>
    </div>
{/each}
