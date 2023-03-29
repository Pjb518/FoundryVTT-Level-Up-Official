<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let item;
    export let action;
    export let actionId;

    const actor = getContext("actor");

    function updateField(event) {
        event.preventDefault();

        const { target } = event;
        updateDocumentDataFromField(item, target.name, Number(target.value));
    }

    function getMaxUses(value) {
        value = !value || value === "" ? 0 : value;
        const roll = new Roll(value.toString(), $actor.getRollData()).evaluate({
            async: false,
        });

        return roll.total;
    }

    $: consumer =
        Object.entries(action?.consumers ?? {}).filter(
            ([_, c]) => c?.type === "actionUses"
        )?.[0] ?? [];

    let usesType = actionId ? "action" : "item";
    $: uses = {
        action: {
            value: consumer?.[1]?.value,
            max: getMaxUses(consumer?.[1]?.max),
            updatePath: `system.actions.${actionId}.consumers.${consumer?.[1]}`,
        },
        item: {
            value: item.system.uses?.value ?? 0,
            max: getMaxUses(item.system.uses?.max),
            updatePath: "system.uses",
        },
    };

    $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<div class="name-wrapper">
    {action?.name ?? item.name}
</div>

{#if !action}
    <div class="button-wrapper">
        {#if item?.system?.favorite !== undefined}
            <button
                class="action-button fas fa-star"
                class:active={item.system.favorite}
                data-tooltip="A5E.ButtonToolTipFavorite"
                data-tooltip-direction="UP"
                on:click|stopPropagation={() => item.toggleFavorite()}
            />
        {/if}

        {#if item.type === "object"}
            {#if item.system.requiresAttunement}
                <li>
                    <button
                        class="action-button fa-solid fa-link"
                        class:active={item.system.attuned}
                        data-tooltip={item.system.attuned
                            ? localize("A5E.ButtonToolTipBreakAttunement", {
                                  item: item.name,
                              })
                            : localize("A5E.ButtonToolTipAttune", {
                                  item: item.name,
                              })}
                        data-tooltip-direction="UP"
                        on:click|stopPropagation={() => item.toggleAttunement()}
                    />
                </li>
            {/if}

            <li>
                <button
                    class="action-button fas fa-shield-alt"
                    class:active={item.system.equipped}
                    data-tooltip={item.system.equipped
                        ? "A5E.ButtonToolTipUnequip"
                        : "A5E.ButtonToolTipEquip"}
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => item.toggleEquipped()}
                />
            </li>

            <li>
                <button
                    class="action-button fas fa-heart-crack"
                    class:active={item.system.broken}
                    data-tooltip={item.system.broken
                        ? "A5E.ButtonToolTipFixBroken"
                        : "A5E.ButtonToolTipBroken"}
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => item.toggleBroken()}
                />
            </li>
        {/if}

        {#if item.type === "spell"}
            <li>
                <button
                    class="action-button fas fa-book"
                    class:active={item.system.prepared}
                    data-tooltip={item.system.prepared
                        ? "A5E.ButtonToolTipUnprepare"
                        : "A5E.ButtonToolTipPrepare"}
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => item.togglePrepared()}
                />
            </li>
        {/if}
    </div>
{/if}

{#if !actionId && item?.type === "object"}
    <div class="quantity-wrapper">
        <input
            class="number-input"
            id="{actor.id}-{item.id}-quantity"
            type="number"
            name="system.quantity"
            value={item.system.quantity}
            min="0"
            on:click|stopPropagation
            on:change={updateField}
        />
    </div>
{/if}

{#if (!actionId && item.system.uses?.max) || consumer?.[1]?.max}
    <div class="uses-wrapper">
        <input
            class="number-input"
            id="{actor.id}-{item.id}-current-uses"
            type="number"
            name="{uses[usesType].updatePath}.value"
            value={uses[usesType].value}
            on:click|stopPropagation
            on:change={updateField}
        />

        <span> / </span>

        <input
            class="number-input"
            type="number"
            name="{uses[usesType].updatePath}.max"
            value={uses[usesType].max}
            disabled={true}
            on:click|stopPropagation
        />
    </div>
{/if}

<style lang="scss">
    .action-button {
        flex-grow: 0;
        width: fit-content;
        padding: 0.125rem 0.25rem;
        background: none;
        color: #999;
        border: 0;

        transition: all 0.15s ease-in-out;

        &:hover {
            color: #555;
            transform: scale(1.2);
        }

        &:hover,
        &:focus {
            box-shadow: none;
        }
    }

    .active {
        color: #425f65;

        &:hover {
            color: #425f65;
            box-shadow: none;
        }
    }

    .button-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        grid-area: indicators;
        margin-left: -0.25rem;
    }

    .name-wrapper {
        display: block;
        font-size: 0.833rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        grid-area: name;
    }

    .number-input {
        background: transparent;
        border: 1px solid #bbb;
        height: 1.125rem;
        width: 7ch;

        &:hover {
            border: 1px solid #bbb;
        }
    }

    .number-input {
        font-size: 0.694rem;
        text-align: center;
    }

    .quantity-wrapper,
    .uses-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .uses-wrapper {
        gap: 0.25rem;
        grid-area: uses;
    }

    .quantity-wrapper {
        grid-area: quantity;
    }
</style>
