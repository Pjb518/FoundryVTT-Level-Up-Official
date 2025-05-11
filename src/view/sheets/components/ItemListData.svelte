<script lang="ts">
    import type { Action } from "types/action.d.ts";

    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { formulaIsClassResource } from "#utils/formulaIsClassResource.ts";
    import { getDeterministicBonus } from "../../../dice/getDeterministicBonus.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    type Props = {
        item: Item;
        action?: Action;
        actionId?: string;
        toggleActionList?: () => void;
        toggleContainer?: () => void;
    };

    let { item, action, actionId, toggleActionList, toggleContainer }: Props =
        $props();

    function getActivationCost() {
        let _action = action;

        if (!item.reactive.actions) return "";
        if (item.reactive.actions?.count === 0) return "";

        if (item.reactive.actions?.count === 1) {
            _action = item.reactive.actions.first!;
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
    function getActivationCostLabel(cost: string) {
        let _action = action;

        if (item.reactive.actions?.count === 1) {
            _action = item.reactive.actions.first!;
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

    function getSelectedAmmo(item: Item, action: Action) {
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
                actor,
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

    function getCapacity(item: Item): number {
        if (!item.isType("object")) return 0;
        if (item.system?.objectType !== "container") return 0;

        const capacity = item.containerItems
            ?.capacity()
            .then((c) => (containerCapacity = c.percentage))
            .catch((e) => console.error(e));

        return capacity?.percentage ?? 0;
    }

    function generateUsesConfig() {
        const usesData = {
            action: {
                value: action ? action.uses?.value : 0,
                max: action
                    ? getDeterministicBonus(
                          action.uses?.max ?? 0,
                          actor.getRollData(item),
                      )
                    : 0,
                updatePath: `system.actions.${actionId}.uses`,
            },
            item: {
                value: itemStore?.uses?.value ?? 0,
                max: getDeterministicBonus(
                    itemStore?.uses?.max ?? 0,
                    actor.reactive.getRollData(item),
                ),
                updatePath: "system.uses",
            },
        };

        const maxFormula =
            usesType === "action" && action
                ? (action.uses?.max ?? "")
                : (item.system.uses?.max ?? "");

        if (!maxFormula) return usesData;

        isClassResource = formulaIsClassResource(maxFormula);

        if (isClassResource) {
            const reg = new RegExp(/@classResources.(\S+)/gm);
            const slug = reg.exec(maxFormula)?.[1];

            if (!slug) return usesData;

            const resource =
                foundry.utils.getProperty(
                    actor._source,
                    `system.resources.classResources.${slug}`,
                ) ?? getDeterministicBonus(maxFormula, actor.getRollData(item));

            usesData[usesType].value = resource;
            usesData[usesType].updatePath =
                `system.resources.classResources.${slug}`;
        }

        return usesData;
    }

    let actor: any = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");
    let actorStore = $derived(actor.reactive.system);
    let itemStore = $derived(item.reactive.system);

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

    let flags = $derived(actor.reactive.flags);
    let isClassResource = $state(false);
    let uses = generateUsesConfig(); // TODO: V13 This should be reactive

    let ammunitionItems = $derived.by(() =>
        actor.reactive.items
            .filter(
                (i: Item) =>
                    i.reactive.isType("object") &&
                    i.reactive.system.objectType === "ammunition",
            )
            .map((i) => ({ name: i.name, id: i.id }))
            .sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
            ),
    );

    let rechargeState = $derived(
        actionId
            ? // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
              action.uses?.max == action.uses?.value
            : // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
              item.system?.uses?.max == item.system?.uses?.value,
    );

    let activationCost = $derived(getActivationCost());
    let activationCostLabel = $derived(getActivationCostLabel(activationCost));
    let containerCapacity = $derived(getCapacity(item));
    let selectedAmmo = $derived(getSelectedAmmo(item, action));
</script>

<div
    class="name-wrapper"
    class:name-wrapper--ammunition={hasAmmunition(item, action)}
>
    <div class="name">
        {action?.name ?? item.name}

        {#if activationCost && (item.reactive.actions?.count === 1 || action)}
            <button
                class="action-button action-button--activation-cost"
                data-tooltip={activationCostLabel}
                data-tooltip-direction="UP"
                onauxclick={onConfigure}
            >
                {activationCost}
            </button>
        {/if}

        {#if !action && itemStore.isStance}
            <i
                class="action-button action-button--stance icon fa-solid fa-street-view"
                data-tooltip={"A5E.ManeuverIsStance"}
                data-tooltip-direction="UP"
            ></i>
        {/if}

        {#if !action && itemStore.requiresBloodied}
            <i
                class="action-button action-button--bloodied icon fa-solid fa-droplet"
                data-tooltip={"A5E.RequiresBloodied"}
                data-tooltip-direction="UP"
            ></i>
        {/if}

        {#if !action && item.reactive.actions?.count > 1}
            <button
                class="action-button icon fas fa-chevron-down"
                aria-label="Expand Action List"
                onclick={(e) => {
                    e.stopPropagation();
                    toggleActionList?.();
                }}
            >
            </button>
        {/if}

        {#if itemStore?.objectType === "container"}
            {#if containerCapacity}
                <span data-tooltip="Capacity" data-tooltip-direction="UP">
                    ({containerCapacity}%)
                </span>
            {/if}

            <button
                class="action-button icon fas fa-chevron-down"
                aria-label="Expand Container"
                onclick={(e) => {
                    e.stopPropagation();
                    toggleContainer?.();
                }}
            ></button>
        {/if}
    </div>

    {#if hasAmmunition(item, action)}
        <select
            id="{actor.id}-{item.id}-ammunition"
            class="ammunition-selector"
            onclick={(e) => e.stopPropagation()}
            onchange={updateAmmunition}
        >
            <option
                value=""
                onclick={(e) => e.stopPropagation()}
                selected={selectedAmmo === ""}
            ></option>
            {#each ammunitionItems as { name, id } (id)}
                <option
                    value={id}
                    onclick={(e) => e.stopPropagation()}
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
                {#if itemStore.components.vocalized}
                    <span
                        class="component"
                        data-tooltip="A5E.SpellComponentVocalized"
                        data-tooltip-direction="UP"
                    >
                        {localize("A5E.SpellComponentVocalizedAbbr")}
                    </span>
                {/if}

                {#if itemStore.components.seen}
                    <span
                        class="component"
                        data-tooltip="A5E.SpellComponentSeen"
                        data-tooltip-direction="UP"
                    >
                        {localize("A5E.SpellComponentSeenAbbr")}
                    </span>
                {/if}

                {#if itemStore.components.material}
                    <span
                        class="component"
                        data-tooltip="A5E.SpellComponentMaterial"
                        data-tooltip-direction="UP"
                    >
                        {localize("A5E.SpellComponentMaterialAbbr")}
                    </span>
                {/if}

                {#if itemStore.concentration}
                    <span
                        class="component"
                        data-tooltip="A5E.SpellConcentration"
                        data-tooltip-direction="UP"
                    >
                        {localize("A5E.SpellConcentrationAbbr")}
                    </span>
                {/if}

                {#if itemStore.ritual}
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
                {#if itemStore.concentration}
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
                    class:active={itemStore?.favorite ?? false}
                    data-tooltip="A5E.ButtonToolTipFavorite"
                    data-tooltip-direction="UP"
                    aria-label="Toggle Favorite"
                    onclick={(e) => {
                        e.stopPropagation();
                        item.toggleFavorite();
                    }}
                >
                </button>
            {/if}

            {#if item.type === "object"}
                {#if itemStore.requiresAttunement}
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
                        aria-label="Toggle Attuned State"
                        onclick={(e) => {
                            e.stopPropagation();
                            item.toggleAttunement();
                        }}
                    ></button>
                {/if}

                {#if !itemStore?.containerId}
                    <button
                        class="action-button icon fas"
                        class:fa-shield-alt={itemStore.equippedState ===
                            EQUIPPED_STATES.EQUIPPED}
                        class:fa-person-carry-box={itemStore.equippedState ===
                            EQUIPPED_STATES.CARRIED}
                        class:fa-tents={itemStore.equippedState ===
                            EQUIPPED_STATES.NOT_CARRIED}
                        class:active={[
                            EQUIPPED_STATES.EQUIPPED,
                            EQUIPPED_STATES.CARRIED,
                        ].includes(itemStore.equippedState)}
                        data-tooltip={equippedStates[
                            itemStore.equippedState ?? 0
                        ]}
                        data-tooltip-direction="UP"
                        aria-label="Toggle Equipped State"
                        onclick={(e) => {
                            e.stopPropagation();
                            item.toggleEquippedState();
                        }}
                    >
                    </button>
                {/if}

                {#if !hideBrokenAndDamaged}
                    <button
                        class="action-button icon fas"
                        class:fa-heart={itemStore.damagedState ===
                            DAMAGED_STATES.INTACT}
                        class:fa-heart-crack={itemStore.damagedState ===
                            DAMAGED_STATES.DAMAGED}
                        class:fa-heart-pulse={itemStore.damagedState ===
                            DAMAGED_STATES.BROKEN}
                        class:active={[
                            DAMAGED_STATES.DAMAGED,
                            DAMAGED_STATES.BROKEN,
                        ].includes(itemStore.damagedState)}
                        data-tooltip={damagedStates[
                            itemStore.damagedState ?? 0
                        ]}
                        data-tooltip-direction="UP"
                        aria-label="Toggle Damaged Dtate"
                        onclick={(e) => {
                            e.stopPropagation();
                            item.toggleDamagedState();
                        }}
                    >
                    </button>
                {/if}
            {/if}

            {#if item.type === "spell"}
                <button
                    class="action-button icon fas"
                    class:fa-book={[
                        PREPARED_STATES.UNPREPARED,
                        PREPARED_STATES.PREPARED,
                    ].includes(Number(itemStore.prepared ?? 0))}
                    class:fa-book-sparkles={Number(itemStore.prepared ?? 0) ===
                        PREPARED_STATES.ALWAYS_PREPARED}
                    class:active={[
                        PREPARED_STATES.PREPARED,
                        PREPARED_STATES.ALWAYS_PREPARED,
                    ].includes(Number(itemStore.prepared ?? 0))}
                    data-tooltip={preparedStates[
                        Number(itemStore.prepared ?? 0)
                    ]}
                    data-tooltip-direction="UP"
                    aria-label="Toggle Prepared State"
                    onclick={(e) => {
                        e.stopPropagation();
                        item.togglePrepared();
                    }}
                ></button>
            {/if}

            {#if hasRecharge(item)}
                <button
                    class="action-button icon fas fa-dice"
                    class:active={rechargeState}
                    data-tooltip={rechargeState
                        ? "A5E.ButtonToolTipCharged"
                        : "A5E.ButtonToolTipRecharge"}
                    data-tooltip-direction="UP"
                    aria-label="Toggle Recharge State"
                    onclick={(e) => {
                        e.stopPropagation();
                        item.recharge(actionId, rechargeState);
                    }}
                ></button>
            {/if}
        </div>
    </div>
{:else}
    <div class="indicator-container">
        <div class="button-wrapper">
            {#if hasRecharge(item.reactive)}
                <button
                    class="action-button icon fas fa-dice"
                    class:active={rechargeState}
                    data-tooltip={rechargeState
                        ? "A5E.ButtonToolTipCharged"
                        : "A5E.ButtonToolTipRecharge"}
                    data-tooltip-direction="UP"
                    aria-label="Toggle Recharge State"
                    onclick={(e) => {
                        e.stopPropagation();
                        item.recharge(actionId, rechargeState);
                    }}
                ></button>
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
            value={itemStore.quantity}
            min="0"
            onclick={(e) => e.stopPropagation()}
            onchange={updateField}
        />
    </div>
{/if}

{#if (!actionId && itemStore?.uses?.max) || (action && action.uses?.max)}
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
            onclick={(e) => e.stopPropagation()}
            onchange={updateUsesValue}
        />

        <span> / </span>

        <input
            class="number-input"
            type="number"
            name="{uses[usesType].updatePath}.max"
            value={uses[usesType].max}
            disabled={true}
            onclick={(e) => e.stopPropagation()}
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
            font-size: var(--a5e-xxs-text);
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
        font-size: var(--a5e-xs-text);

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
        font-family: var(--a5e-primary-font);
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
        font-size: var(--a5e-xxs-text);
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
        font-size: var(--a5e-xs-text);
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
