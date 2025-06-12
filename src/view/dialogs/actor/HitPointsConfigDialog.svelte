<script lang="ts">
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    import { prepareHitDice } from "#utils/view/helpers/prepareHitDice.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    type Props = {
        document: any;
    };

    let { document }: Props = $props();

    const hpFields = [
        { label: "A5E.hitPoints.current", updateAttribute: "value" },
        { label: "A5E.hitPoints.baseMaximum", updateAttribute: "baseMax" },
        { label: "A5E.hitPoints.temporary", updateAttribute: "temp" },
        { label: "A5E.hitPoints.maxModifier", updateAttribute: "bonus" },
    ];

    let actor: any = document;
    const hitDice = prepareHitDice(actor);

    let hp = $derived(actor.reactive.system.attributes.hp);
    let disableHitDice = $derived(
        Object.keys(actor.reactive.classes ?? {}).length ?? false,
    );

    let hitDieClasses =
        actor.type === "character"
            ? "a5e-hit-die-container--character"
            : "a5e-hit-die-container--npc";

    let disableMaxHp = $derived(
        Object.keys(actor.classes ?? {}).length ??
            !actor.reactive.classAutomationFlags?.hitPoints ??
            false,
    );
</script>

<article>
    {#each hpFields as { label, updateAttribute }}
        {#if !disableMaxHp || updateAttribute !== "baseMax"}
            <FieldWrapper
                heading={label}
                --a5e-field-wrapper-direction="row"
                --a5e-field-wrapper-padding="0.5rem"
                --a5e-field-wrapper-item-alignment="center"
                --a5e-field-wrapper-label-width="8rem"
            >
                <input
                    class="a5e-input a5e-input-slim a5e-input--small"
                    type="number"
                    name="system.attributes.hp.{updateAttribute}"
                    value={hp[updateAttribute]}
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            actor,
                            currentTarget.name,
                            Number(currentTarget.value),
                        )}
                />
            </FieldWrapper>
        {/if}
    {/each}

    <hr class="a5e-rule" />

    <section class={`a5e-hit-die-container ${hitDieClasses}`}>
        {#each hitDice as { dieSize, current, total }}
            <div class="a5e-hit-die-wrapper">
                <div class="a5e-hit-die">
                    <span class="a5e-hit-die__label">{dieSize}</span>
                </div>

                <div class="a5e-hit-die__input-container">
                    <input
                        class="a5e-hit-die__quantity"
                        type="number"
                        min="0"
                        name="system.attributes.hitDice.{dieSize}.current"
                        disabled={!!disableHitDice}
                        data-tooltip={disableHitDice
                            ? "Update Hit Dice in class document.   "
                            : ""}
                        value={current}
                        onchange={({ currentTarget }) =>
                            updateDocumentDataFromField(
                                actor,
                                currentTarget.name,
                                Number(currentTarget.value),
                            )}
                    />
                    /
                    <input
                        class="a5e-hit-die__quantity"
                        type="number"
                        min="0"
                        name="system.attributes.hitDice.{dieSize}.total"
                        disabled={!!disableHitDice}
                        value={total}
                        onchange={({ currentTarget }) =>
                            updateDocumentDataFromField(
                                actor,
                                currentTarget.name,
                                Number(currentTarget.value),
                            )}
                    />
                </div>
            </div>
        {/each}
    </section>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
        overflow: auto;
    }

    .a5e-hit-die-container {
        margin-top: 0;

        &--character {
            display: flex;
            gap: 0.5rem;
        }

        &--npc {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.5rem;
        }
    }
</style>
