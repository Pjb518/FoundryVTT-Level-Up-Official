<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import getDeterministicBonus from "../../dice/getDeterministicBonus";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

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
        if (actionId) return action.uses?.per === "recharge";
        return item.system?.uses?.per === "recharge";
    }

    function updateField(event) {
        event.preventDefault();

        const { target } = event;
        updateDocumentDataFromField(item, target.name, Number(target.value));
    }

    const actor = getContext("actor");
    let usesType = actionId ? "action" : "item";

    $: flags = $actor.flags;

    $: uses = {
        action: {
            value: action ? action.uses?.value : 0,
            max: action
                ? getDeterministicBonus(
                      action.uses?.max ?? 0,
                      $actor.getRollData()
                  )
                : 0,
            updatePath: `system.actions.${actionId}.uses`,
        },
        item: {
            value: item.system?.uses?.value ?? 0,
            max: getDeterministicBonus(
                item.system?.uses?.max ?? 0,
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
        ? action.uses?.max == action.uses?.value
        : item.system?.uses?.max == item.system?.uses?.value;

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
    <div class="indicator-wrapper">
        {#if item.type === "spell"}
            <div class="component-wrapper">
                {#if item.system.components.vocalized}
                    <span
                        class="component"
                        data-tooltip="A5E.SpellComponentVocalized"
                        data-tooltip-direction="UP"
                    >
                        {localize("A5E.SpellComponentVocalizedAbbr")}
                    </span>
                {/if}

                {#if item.system.components.seen}
                    <span
                        class="component"
                        data-tooltip="A5E.SpellComponentSeen"
                        data-tooltip-direction="UP"
                    >
                        {localize("A5E.SpellComponentSeenAbbr")}
                    </span>
                {/if}

                {#if item.system.components.material}
                    <span
                        class="component"
                        data-tooltip="A5E.SpellComponentMaterial"
                        data-tooltip-direction="UP"
                    >
                        {localize("A5E.SpellComponentMaterialAbbr")}
                    </span>
                {/if}

                {#if item.system.concentration}
                    <span
                        class="component"
                        data-tooltip="A5E.SpellConcentration"
                        data-tooltip-direction="UP"
                    >
                        {localize("A5E.SpellConcentrationAbbr")}
                    </span>
                {/if}

                {#if item.system.ritual}
                    <span
                        class="component"
                        data-tooltip="A5E.SpellRitual"
                        data-tooltip-direction="UP"
                    >
                        {localize("A5E.SpellRitualAbbr")}
                    </span>
                {/if}
            </div>
        {/if}

        {#if item.type === "feature"}
            <div class="component-wrapper">
                {#if item.system.concentration}
                    <span
                        class="component"
                        data-tooltip="A5E.SpellConcentration"
                        data-tooltip-direction="UP"
                    >
                        {localize("A5E.SpellConcentrationAbbr")}
                    </span>
                {/if}
            </div>
        {/if}

        <div class="button-wrapper">
            {#if flags.a5e?.showFavoritesSection ?? true}
                <button
                    class="action-button fas fa-star"
                    class:active={item.system?.favorite ?? false}
                    data-tooltip="A5E.ButtonToolTipFavorite"
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => item.toggleFavorite()}
                />
            {/if}

            {#if item.type === "object"}
                {#if item.system.requiresAttunement}
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
                {/if}

                <button
                    class="action-button fas fa-shield-alt"
                    class:active={item.system.equipped}
                    data-tooltip={item.system.equipped
                        ? "A5E.ButtonToolTipUnequip"
                        : "A5E.ButtonToolTipEquip"}
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => item.toggleEquipped()}
                />

                <button
                    class="action-button fas fa-heart-crack"
                    class:active={item.system.broken}
                    data-tooltip={item.system.broken
                        ? "A5E.ButtonToolTipFixBroken"
                        : "A5E.ButtonToolTipBroken"}
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => item.toggleBroken()}
                />
            {/if}

            {#if item.type === "spell"}
                <button
                    class="action-button fas fa-book"
                    class:active={item.system.prepared}
                    data-tooltip={item.system.prepared
                        ? "A5E.ButtonToolTipUnprepare"
                        : "A5E.ButtonToolTipPrepare"}
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => item.togglePrepared()}
                />
            {/if}

            {#if hasRecharge(item)}
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
            {/if}
        </div>
    </div>
{:else}
    <div class="indicator-container">
        <div class="button-wrapper">
            {#if hasRecharge(item)}
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
            {/if}
        </div>
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

{#if (!actionId && item.system?.uses?.max) || (action && action.uses?.max)}
    <div class="uses-wrapper">
        <input
            class="number-input"
            id="{actor.id}-{item.id}-current-uses"
            type="number"
            name="{uses[usesType].updatePath}.value"
            value={uses[usesType].value}
            min="0"
            max={uses[usesType].max}
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
        padding: 0;
        margin: 0;
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

    .button-wrapper,
    .component-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .component-wrapper {
        gap: 0.25rem;
    }

    .button-wrapper {
        margin-inline: 0.25rem;
        gap: 0.5rem;
    }

    .component {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1rem;
        width: 1rem;
        border-radius: 3px;
        font-size: 0.579rem;
        background: #c6c5bc;
    }

    .indicator-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-inline: 0.25rem;
        grid-area: indicators;
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
