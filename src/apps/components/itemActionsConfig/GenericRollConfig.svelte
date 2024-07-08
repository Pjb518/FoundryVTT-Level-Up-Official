<script>
    import { getContext } from "svelte";

    import GenericConfigDialog from "../../dialogs/initializers/GenericConfigDialog";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RollScalingDialog from "../../dialogs/RollScalingDialog.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    function onClickScalingButton() {
        let dialog = $item.dialogs.rollScaling[rollId];

        if (!dialog) {
            $item.dialogs.rollScaling[rollId] = new GenericConfigDialog(
                $item,
                `${$item.name} Roll Scaling Configuration`,
                RollScalingDialog,
                { actionId, rollId },
                { width: 432 },
            );

            dialog = $item.dialogs.rollScaling[rollId];
        }

        dialog.render(true);
    }

    const item = getContext("item");
    const actionId = getContext("actionId");

    export let deleteRoll;
    export let duplicateRoll;
    export let roll;
    export let rollId;
</script>

<FieldWrapper
    heading="A5E.Label"
    buttons={[
        {
            classes: "fa-solid fa-clone a5e-field-wrapper__header-button--scale",
            handler: () => duplicateRoll(actionId, roll),
        },
        {
            classes: "fas fa-trash a5e-field-wrapper__header-button--scale",
            handler: () => deleteRoll(actionId, rollId),
        },
    ]}
    --a5e-header-button-color="#bebdb5"
    --a5e-header-button-color-hover="#555"
    --a5e-field-wrapper-button-wrapper-gap="0.75rem"
>
    <input
        type="text"
        value={roll.label ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.label`,
                target.value,
            )}
    />
</FieldWrapper>

<FieldWrapper heading="A5E.RollFormula" --a5e-field-wrapper-grow="1">
    <div class="u-flex u-gap-sm u-w-full">
        <input
            type="text"
            value={roll.formula ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.formula`,
                    target.value,
                )}
        />

        <button class="scaling-button" on:click|preventDefault={onClickScalingButton}>
            <i
                class="fa-solid fa-arrow-up-right-dots"
                data-tooltip="A5E.ConfigureDamageScaling"
                data-tooltip-direction="UP"
            />
        </button>
    </div>
</FieldWrapper>

<Checkbox
    label="A5E.GenericDefaultSelection"
    checked={roll.default ?? true}
    on:updateSelection={({ detail }) => {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.rolls.${rollId}.default`,
            detail,
        );
    }}
/>

<style lang="scss">
    .scaling-button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1.625rem;
        width: 1.625rem;
        padding: 0;
        margin: 0;
        font-size: var(--a5e-text-size-md);
        background: transparent;
        color: #999;
        border: 1px solid #7a7971;
        border-radius: var(--a5e-border-radius-standard);
        cursor: pointer;

        transition: var(--a5e-transition-standard);

        i {
            margin: 0;
        }

        &:focus,
        &:hover {
            color: #555;
        }
    }
</style>
