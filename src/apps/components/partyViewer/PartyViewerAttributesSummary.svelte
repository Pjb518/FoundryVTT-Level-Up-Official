<script>
    import replaceHyphenWithMinusSign from "../../../utils/replaceHyphenWithMinusSign";

    export let actor;
    export const propData = {};

    $: actorData = $actor?.system;
    const abilities = CONFIG.A5E.abilities;
</script>

{#each Object.entries(actorData.abilities ?? {}) as [key, attribute]}
    {@const proficient = attribute.save.proficient}
    {@const abilityLabel = abilities[key]}

    <div class="attribute-wrapper attribute-wrapper--{key}">
        <div
            class="attribute-wrapper__check"
            data-tooltip="{abilityLabel} Check Modifier"
            data-tooltip-direction="UP"
        >
            <span>
                {replaceHyphenWithMinusSign(attribute?.check?.deterministicBonus)}
            </span>
        </div>

        <div
            class="attribute-wrapper__save"
            class:attribute-wrapper__save--proficient={proficient}
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

<style lang="scss">
    .attribute-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-around;

        &--str {
            grid-area: str;
        }

        &--dex {
            grid-area: dex;
        }

        &--con {
            grid-area: con;
        }

        &--int {
            grid-area: int;
        }

        &--wis {
            grid-area: wis;
        }

        &--cha {
            grid-area: cha;
        }

        &__check,
        &__save {
            position: relative;

            span {
                position: inherit;
                z-index: 1;
            }

            &::before {
                position: absolute;
                top: 50%;
                left: 50%;
                font: var(--fa-font-solid);
                font-size: var(--a5e-text-size-xl);
                transform: translate(-50%, -50%);
                color: #e7e5db;
                z-index: 0;
                text-shadow: #000 0 0 1px;
            }
        }

        &__check::before {
            content: "\f111";
        }

        &__save {
            &::before {
                content: "\f132";
            }

            &--proficient {
                color: var(--a5e-color-text-light);

                &::before {
                    color: var(--a5e-color-primary);
                }
            }
        }
    }
</style>
