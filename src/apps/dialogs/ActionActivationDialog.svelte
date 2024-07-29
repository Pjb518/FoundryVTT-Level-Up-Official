<script lang="ts">
    import type { ActionActivationOptions } from "../../documents/item/data";
    import type { AttackRollData } from "../../dataModels/item/actions/ActionRollsDataModel";
    import type { BaseActorA5e } from "../../documents/actor/base";
    import type { ItemA5e } from "../../documents/item/item";

    import { RollPreparationManager } from "../../managers/RollPreparationManager";

    import { getContext, setContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    export let { application } = getContext("#external") as { application: any };
    export let {
        actionId,
        options,
        dialog,
    }: { actionId: string; options: ActionActivationOptions; dialog: any } = application;
    export let {
        actorDocument,
        itemDocument,
    }: { actorDocument: BaseActorA5e; itemDocument: ItemA5e } = application;

    const actor = new TJSDocument(actorDocument);
    const item = new TJSDocument(itemDocument);
    const action = $item.actions.get(actionId);

    const consumers = RollPreparationManager.prepareConsumers($item, actionId);
    const prompts = RollPreparationManager.preparePrompts($item, actionId);
    const rolls = RollPreparationManager.prepareRolls($item, actionId);

    const attackRoll = rolls.attack?.length ? rolls.attack[0][1] : ({} as AttackRollData);
</script>

<form></form>

<style lang="scss">
    :global(.a5e-activation-dialog .window-content) {
        overflow-y: auto;
        max-height: 90vh;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
        max-height: 50rem;
        overflow-y: auto;
    }

    :global(small) {
        margin-top: 0.25rem;
    }

    .warning__wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin-block: 0.125rem;
        padding-inline: 0.25rem;

        .warning {
            font-family: $font-secondary;
            font-size: var(--a5e-text-size-xs);
        }
    }
</style>
