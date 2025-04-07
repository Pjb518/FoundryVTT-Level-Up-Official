<script lang="ts">
    import type { Action } from "types/action";
    import type { ItemA5e } from "../../documents/item/item";

    import { getContext, createEventDispatcher } from "svelte";
    import { localize } from "#runtime/util/i18n";

    import formulaIsClassResource from "../../utils/formulaIsClassResource";
    import getDeterministicBonus from "../../dice/getDeterministicBonus";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";
    import type ObjectItemA5e from "../../documents/item/object";

    export let item: ItemA5e;
    export let action: Action | null;
    export let actionId: string | null;

    function getActivationCost(item: ItemA5e, action: Action) {
        let _action = action;

        if (!item.actions) return "";
        if (item.actions?.count === 0) return "";

        if (item.actions?.count === 1) {
            _action = item.actions.first!;
        }

        switch (_action?.activation?.type) {
            case "action":
                return "A";
            case "bonusAction":
                return "B";
            case "legendaryAction": {
                const cost = _action?.activation?.cost;

                if (cost === 1 || cost === 0) return "L";
                return `${cost}L`;
            }
            case "reaction":
                return "R";
            default:
                return "";
        }
    }

    // TODO: Cleanup - Fix up this gross mess
    function getActivationCostLabel(
        item: ItemA5e,
        action: Action,
        cost: string,
    ) {
        let _action = action;

        if (item.actions?.count === 1) {
            _action = item.actions.first!;
        }

        switch (cost) {
            case "A":
                return "Action";
            case "B":
                return "Bonus Action";
            case "L":
                return "Legendary Action";
            case "R":
                return _action?.activation?.reactionTrigger
                    ? `Reaction (${_action.activation.reactionTrigger})`
                    : "Reaction";
            default:
                return "";
        }
    }

    function getSelectedAmmo(item: ItemA5e, action: Action) {
        let _action = action;

        if (!item.actions) return "";
        if (item.actions?.count === 0) return "";

        if (item.actions?.count === 1) {
            _action = item.actions.first!;
        }

        const ammoConsumer = Object.entries(_action?.consumers ?? {}).find(
            ([_, consumer]) => consumer?.type === "ammunition",
        );

        if (!ammoConsumer) return "";

        return ammoConsumer[1].itemId;
    }

    function hasAmmunition(item: ItemA5e, action: Action) {
        let _action = action;

        if (!item.actions) return false;
        if (item.actions.count === 0) return false;

        if (item.actions.count === 1) {
            _action = item.actions.first!;
        }

        return Object.entries(_action?.consumers ?? {}).filter(
            ([_, consumer]) => consumer?.type === "ammunition",
        ).length;
    }

    function updateAmmunition(event) {
        let _actionId = actionId;
        const selectedOption = event.target?.selectedOptions[0]?.value;

        if (!item.actions) return;
        if (item.actions.count === 0) return;

        if (item.actions.count === 1) {
            _actionId = item.actions.first.id;
        }

        const [consumerId] = Object.entries(
            item.actions.get(_actionId || "")?.consumers ?? {},
        ).find(([_, consumer]) => consumer?.type === "ammunition");

        if (!consumerId) return;

        updateDocumentDataFromField(
            item,
            `system.actions.${_actionId}.consumers.${consumerId}.itemId`,
            selectedOption,
        );
    }

    function hasRecharge(item: ItemA5e) {
        if (actionId && action) return action.uses?.per === "recharge";
        return item.system?.uses?.per === "recharge";
    }

    function updateField(event) {
        event.preventDefault();

        const { target } = event;
        updateDocumentDataFromField(item, target.name, Number(target.value));
    }

    function updateUsesValue(event) {
        event.preventDefault();

        const { target } = event;
        if (isClassResource) {
            updateDocumentDataFromField(
                $actor,
                target.name,
                Number(target.value),
            );
        } else {
            updateDocumentDataFromField(
                item,
                target.name,
                Number(target.value),
            );
        }
    }

    function onConfigure() {
        if (!rightClickConfigure) return;

        if (actionId) {
            item.actions?.configure(actionId);
            return;
        }

        const id = [...(item.actions.keys() ?? [])].at(0);
        if (!id) {
            item.configureItem();
            return;
        }

        item.actions?.configure(id);
    }

    function getCapacity(item: ObjectItemA5e): number {
        if (!item.isType("object")) return 0;
        if (item.system?.objectType !== "container") return 0;

        const capacity = item.containerItems
            ?.capacity()
            .then((c) => (containerCapacity = c.percentage))
            .catch((e) => console.error(e));

        return capacity?.percentage ?? 0;
    }

    function generateUsesConfig() {
        const uses = {
            action: {
                value: action ? action.uses?.value : 0,
                max: action
                    ? getDeterministicBonus(
                          action.uses?.max ?? 0,
                          $actor.getRollData(item),
                      )
                    : 0,
                updatePath: `system.actions.${actionId}.uses`,
            },
            item: {
                value: item.system?.uses?.value ?? 0,
                max: getDeterministicBonus(
                    item.system?.uses?.max ?? 0,
                    $actor.getRollData(item),
                ),
                updatePath: "system.uses",
            },
        };

        const maxFormula =
            usesType === "action" && action
                ? (action.uses?.max ?? "")
                : (item.system.uses?.max ?? "");

        if (!maxFormula) return uses;

        isClassResource = formulaIsClassResource(maxFormula);

        if (isClassResource) {
            const reg = new RegExp(/@classResources.(\S+)/gm);
            const slug = reg.exec(maxFormula)?.[1];

            if (!slug) return uses;

            const resource =
                foundry.utils.getProperty(
                    $actor._source,
                    `system.resources.classResources.${slug}`,
                ) ??
                getDeterministicBonus(maxFormula, $actor.getRollData(item));

            uses[usesType].value = resource;
            uses[usesType].updatePath =
                `system.resources.classResources.${slug}`;
        }

        return uses;
    }

    const actor = getContext("actor");
    const dispatch = createEventDispatcher();

    const {
        damagedStates,
        DAMAGED_STATES,
        equippedStates,
        EQUIPPED_STATES,
        preparedStates,
        PREPARED_STATES,
    } = CONFIG.A5E;

    let hideBrokenAndDamaged = game.settings.get(
        "a5e",
        "hideBrokenAndDamaged",
    ) as boolean;
    let usesType: "action" | "item" = actionId ? "action" : "item";

    let rightClickConfigure = (game.settings.get(
        "a5e",
        "itemRightClickConfigure",
    ) ?? false) as boolean;

    $: flags = $actor.flags;

    $: isClassResource = false;
    $: uses = generateUsesConfig($actor, item, action);

    $: ammunitionItems = $actor.items
        .filter(
            (i: ItemA5e) =>
                i.isType("object") && i.system.objectType === "ammunition",
        )
        .map((i) => ({ name: i.name, id: i.id }))
        .sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        );

    $: rechargeState = actionId
        ? action.uses?.max == action.uses?.value
        : item.system?.uses?.max == item.system?.uses?.value;

    $: activationCost = getActivationCost(item, action);
    $: activationCostLabel = getActivationCostLabel(
        item,
        action,
        activationCost,
    );
    $: containerCapacity = getCapacity(item as ObjectItemA5e);
    $: selectedAmmo = getSelectedAmmo(item, action);
</script>

<div
    class="name-wrapper"
    class:name-wrapper--ammunition={hasAmmunition(item, action)}
>
    <div class="name">
        {action?.name ?? item.name}

        {#if activationCost && (item.actions?.count === 1 || action)}
            <button
                class="action-button action-button--activation-cost"
                data-tooltip={activationCostLabel}
                data-tooltip-direction="UP"
                on:auxclick|stopPropagation={onConfigure}
            >
                {activationCost}
            </button>
        {/if}

        {#if !action && item.system.isStance}
            <i
                class="action-button action-button--stance icon fa-solid fa-street-view"
                data-tooltip={"A5E.ManeuverIsStance"}
                data-tooltip-direction="UP"
            />
        {/if}

        {#if !action && item.system.requiresBloodied}
            <i
                class="action-button action-button--bloodied icon fa-solid fa-droplet"
                data-tooltip={"A5E.RequiresBloodied"}
                data-tooltip-direction="UP"
            />
        {/if}

        {#if !action && item.actions?.count > 1}
            <button
                class="action-button icon fas fa-chevron-down"
                on:click|stopPropagation={() => {
                    dispatch("toggleActionList");
                }}
            />
        {/if}

        {#if item?.system?.objectType === "container"}
            {#if containerCapacity}
                <span data-tooltip="Capacity" data-tooltip-direction="UP">
                    ({containerCapacity}%)
                </span>
            {/if}

            <button
                class="action-button icon fas fa-chevron-down"
                on:click|stopPropagation={() => {
                    dispatch("toggleContainer");
                }}
            />
        {/if}
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

        {#if item.type === "feature" || item.type === "maneuver"}
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
                    class="action-button icon fas fa-star"
                    class:active={item.system?.favorite ?? false}
                    data-tooltip="A5E.ButtonToolTipFavorite"
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => item.toggleFavorite()}
                />
            {/if}

            {#if item.type === "object"}
                {#if item.system.requiresAttunement}
                    <button
                        class="action-button icon fa-solid fa-link"
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

                {#if !item.system?.containerId}
                    <button
                        class="action-button icon fas"
                        class:fa-shield-alt={item.system.equippedState ===
                            EQUIPPED_STATES.EQUIPPED}
                        class:fa-person-carry-box={item.system.equippedState ===
                            EQUIPPED_STATES.CARRIED}
                        class:fa-tents={item.system.equippedState ===
                            EQUIPPED_STATES.NOT_CARRIED}
                        class:active={[
                            EQUIPPED_STATES.EQUIPPED,
                            EQUIPPED_STATES.CARRIED,
                        ].includes(item.system.equippedState)}
                        data-tooltip={equippedStates[
                            item.system.equippedState ?? 0
                        ]}
                        data-tooltip-direction="UP"
                        on:click|stopPropagation={() =>
                            item.toggleEquippedState()}
                    />
                {/if}

                {#if !hideBrokenAndDamaged}
                    <button
                        class="action-button icon fas"
                        class:fa-heart={item.system.damagedState ===
                            DAMAGED_STATES.INTACT}
                        class:fa-heart-crack={item.system.damagedState ===
                            DAMAGED_STATES.DAMAGED}
                        class:fa-heart-pulse={item.system.damagedState ===
                            DAMAGED_STATES.BROKEN}
                        class:active={[
                            DAMAGED_STATES.DAMAGED,
                            DAMAGED_STATES.BROKEN,
                        ].includes(item.system.damagedState)}
                        data-tooltip={damagedStates[
                            item.system.damagedState ?? 0
                        ]}
                        data-tooltip-direction="UP"
                        on:click|stopPropagation={() =>
                            item.toggleDamagedState()}
                    />
                {/if}
            {/if}

            {#if item.type === "spell"}
                <button
                    class="action-button icon fas"
                    class:fa-book={[
                        PREPARED_STATES.UNPREPARED,
                        PREPARED_STATES.PREPARED,
                    ].includes(Number(item.system.prepared ?? 0))}
                    class:fa-book-sparkles={Number(
                        item.system.prepared ?? 0,
                    ) === PREPARED_STATES.ALWAYS_PREPARED}
                    class:active={[
                        PREPARED_STATES.PREPARED,
                        PREPARED_STATES.ALWAYS_PREPARED,
                    ].includes(Number(item.system.prepared ?? 0))}
                    data-tooltip={preparedStates[
                        Number(item.system.prepared ?? 0)
                    ]}
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => item.togglePrepared()}
                />
            {/if}

            {#if hasRecharge(item)}
                <button
                    class="action-button icon fas fa-dice"
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
                    class="action-button icon fas fa-dice"
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
            name={isClassResource
                ? `${uses[usesType].updatePath}`
                : `${uses[usesType].updatePath}.value`}
            value={uses[usesType].value}
            min="0"
            max={uses[usesType].max}
            on:click|stopPropagation
            on:change={updateUsesValue}
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
        color: var(--icon-color, #999);
        border: 0;
        background: none;
        box-shadow: none;
        outline: none;

        // 17.5 pixels: the width of the largest icon we have
        min-width: 1.09375rem;

        transition: var(--a5e-transition-standard);

        &:hover {
            color: var(--icon-color-active, #555);
            transform: scale(1.2);
        }

        &:hover,
        &:focus {
            box-shadow: none;
            outline: none;
        }

        &--activation-cost {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 1rem;
            width: fit-content;
            font-size: var(--a5e-text-size-xxs);
            color: var(--indicator-text-color, inherit);
            border-radius: var(--a5e-border-radius-standard);
            background: var(--indicator-background, #c6c5bc);

            &:hover {
                color: var(--indicator-text-color, inherit);
                transform: scale(1);
            }
        }

        &--bloodied {
            color: var(--icon-color-active);

            &:hover {
                color: var(--icon-color-active, inherit);
                transform: scale(1);
            }
        }

        &--stance:hover {
            color: var(--icon-color, #999);
            transform: scale(1);
        }
    }

    .active {
        color: var(--icon-color-active, var(--a5e-color-primary));

        &:hover {
            color: var(--icon-color-active, var(--a5e-color-primary));
            box-shadow: none;
        }
    }

    .ammunition-selector {
        height: 1.25rem;
        flex-grow: 0;
        font-size: var(--a5e-text-size-xs);

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
        font-family: var(--a5e-font-sans-serif);
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
        border-radius: var(--a5e-border-radius-standard);
        font-size: var(--a5e-text-size-xxs);
        background: var(--indicator-background, #c6c5bc);
    }

    .indicator-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-inline: 0.25rem;
        grid-area: indicators;
        color: var(--indicator-text-color, inherit);
    }

    .name {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .name-wrapper {
        display: grid;
        align-items: center;
        gap: 0.5rem;
        overflow: hidden;
        grid-area: name;

        &--ammunition {
            grid-template-columns: auto minmax(6rem, 1fr);
        }
    }

    .number-input {
        background: transparent;
        border: 1px solid var(--item-input-border-color);
        height: 1.125rem;
        width: 7ch;

        &:hover {
            border: 1px solid
                var(--item-input-border-color, var(--a5e-border-color));
        }
    }

    .number-input {
        font-size: var(--a5e-text-size-xs);
        text-align: center;

        &:disabled {
            border: 1px solid transparent;
        }
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
