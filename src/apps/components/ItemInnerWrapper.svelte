<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import getDeterministicBonus from "../../dice/getDeterministicBonus";
    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let item;
    export let action;
    export let actionId;

    function getSelectedAmmo(item, action) {
        let _action = action;

        if (item.actions.count === 0) return "";

        if (item.actions.count === 1) {
            _action = item.actions.values()[0];
        }

        const ammoConsumer = Object.entries(_action?.consumers ?? {}).find(
            ([_, consumer]) => consumer?.type === "ammunition"
        );

        if (!ammoConsumer) return "";

        return ammoConsumer[1].itemId;
    }

    function hasAmmunition(item, action) {
        let _action = action;

        if (item.actions.count === 0) return false;

        if (item.actions.count === 1) {
            _action = item.actions.values()[0];
        }

        return Object.entries(_action?.consumers ?? {}).filter(
            ([_, consumer]) => consumer?.type === "ammunition"
        ).length;
    }

    function updateAmmunition(event) {
        let _actionId = actionId;
        const selectedOption = event.target?.selectedOptions[0]?.value;

        if (item.actions.count === 0) return;

        if (item.actions.count === 1) {
            _actionId = item.actions.keys()[0];
        }

        const [consumerId] = Object.entries(
            item.actions[_actionId]?.consumers ?? {}
        ).find(([_, consumer]) => consumer?.type === "ammunition");

        if (!consumerId) return;

        updateDocumentDataFromField(
            item,
            `system.actions.${_actionId}.consumers.${consumerId}.itemId`,
            selectedOption
        );
    }

    function hasRecharge(item) {
        if (actionId) {
            const consumers = item.actions
                .getConsumers(actionId)
                .filter(
                    ([_, consumer]) =>
                        consumer.type === "recharge" &&
                        consumer?.consumeType === "action"
                )[0];

            if (consumers.length) return true;
        }

        if (item.system.recharge.formula) return true;

        return false;
    }

    function updateField(event) {
        event.preventDefault();

        const { target } = event;
        updateDocumentDataFromField(item, target.name, Number(target.value));
    }

    const actor = getContext("actor");
    let usesType = actionId ? "action" : "item";

    $: consumer =
        item.actions
            .getConsumers(actionId)
            .filter(([_, c]) => c?.type === "actionUses")?.[0] ?? [];

    $: uses = {
        action: {
            value: consumer?.[1]?.value,
            max: getDeterministicBonus(
                consumer?.[1]?.max ?? 0,
                $actor.getRollData()
            ),
            updatePath: `system.actions.${actionId}.consumers.${consumer?.[0]}`,
        },
        item: {
            value: item.system.uses?.value ?? 0,
            max: getDeterministicBonus(
                item.system.uses?.max ?? 0,
                $actor.getRollData()
            ),
            updatePath: "system.uses",
        },
    };

    $: ammunitionItems = $actor.items
        .filter(
            (i) => i.type === "object" && i.system.objectType === "ammunition"
        )
        .map((i) => ({ name: i.name, id: i.id }))
        .sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );

    $: rechargeState = actionId
        ? item.actions
              .getConsumers(actionId)
              .filter(
                  ([_, c]) =>
                      c.type === "recharge" && c.consumeType === "action"
              )?.[0]?.charged ?? true
        : item.system.recharge.charged ?? true;

    $: selectedAmmo = getSelectedAmmo(item, action);
</script>

<div class="name-wrapper">
    <div class="name">
        {action?.name ?? item.name}
    </div>

    {#if hasAmmunition(item, action)}
        <select
            id="{$actor.id}-{item.id}-ammunition"
            class="ammunition-selector"
            on:click|stopPropagation
            on:change={updateAmmunition}
        >
            <option
                value=""
                on:click|stopPropagation
                selected={selectedAmmo === ""}
            />
            {#each ammunitionItems as { name, id } (id)}
                <option
                    value={id}
                    on:click|stopPropagation
                    selected={selectedAmmo === id}
                >
                    {name}
                </option>
            {/each}
        </select>
    {/if}
</div>

{#if !action}
    <div class="button-wrapper">
        {#if hasRecharge(item)}
            <li>
                <button
                    class="action-button fas fa-dice"
                    class:active={rechargeState}
                    data-tooltip={rechargeState
                        ? "A5E.ButtonToolTipCharged"
                        : "A5E.ButtonToolTipRecharge"}
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() =>
                        item.recharge(actionId, rechargeState)}
                />
            </li>
        {/if}

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

    .ammunition-selector {
        height: 1.25rem;
        width: fit-content;
        font-size: 0.694rem;

        &:focus {
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

    .name {
        font-size: 0.833rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .name-wrapper {
        display: flex;
        align-items: center;
        flex-grow: 0;
        gap: 0.5rem;
        overflow: hidden;
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
