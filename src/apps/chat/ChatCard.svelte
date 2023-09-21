<svelte:options accessors={true} />

<script>
    import { setContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import zip from "../../utils/zip";

    import CheckHeader from "./header/CheckHeader.svelte";
    import CardBody from "./body/CardBody.svelte";
    import ItemActivationFooter from "./footer/ItemActivationFooter.svelte";
    import ItemActivationHeader from "./header/ItemActivationHeader.svelte";

    function getHeaderComponent() {
        switch ($message?.flags?.a5e?.cardType) {
            case "item":
                return ItemActivationHeader;
            case "abilityCheck":
            case "hitDice":
            case "savingThrow":
            case "skillCheck":
                return CheckHeader;
        }
    }

    function reevaluateCritMode() {
        const isCrit = zip($message.rolls, $message?.flags?.a5e?.rollData).some(
            ([roll, rollData]) => {
                if (rollData.type !== "attack") return false;

                const d20Roll = roll.terms.find((term) => term.faces === 20);

                if (!d20Roll) return false;

                return d20Roll.results.some(
                    ({ result, active }) =>
                        active && result >= (rollData.critThreshold ?? 20)
                );
            }
        );

        if (isCrit === undefined || isCrit === null) return;

        toggleCriticalDamage(isCrit ? 1 : 0);
    }

    function toggleCriticalDamage(newCritMode) {
        const rolls = zip($message.rolls, $message?.flags?.a5e?.rollData).map(
            ([roll, rollData]) => {
                if (rollData.type !== "damage") return roll;
                if (!rollData.canCrit ?? true) return roll;
                if (!rollData.critRoll || !rollData.baseRoll) return roll;

                if (newCritMode === 1) return Roll.fromData(rollData.critRoll);
                if (newCritMode === 0) return Roll.fromData(rollData.baseRoll);

                if (rollData.baseRoll.formula === roll.formula) {
                    return Roll.fromData(rollData.critRoll);
                }

                return Roll.fromData(rollData.baseRoll);
            }
        );

        $message.update({ rolls });
    }

    export let messageDocument;

    let hideDescription =
        game.settings.get("a5e", "hideChatDescriptionsByDefault") ?? false;

    const message = new TJSDocument(messageDocument);

    setContext("message", message);
</script>

<svelte:component
    this={getHeaderComponent()}
    {message}
    on:toggleCriticalDamage={toggleCriticalDamage}
    on:toggleDescription={() => (hideDescription = !hideDescription)}
/>

<CardBody
    {message}
    hideDescription={hideDescription ||
        $message?.flags?.a5e?.cardType !== "item"}
    on:reevaluateCritMode={reevaluateCritMode}
/>

{#if $message?.flags?.a5e?.cardType === "item"}
    <ItemActivationFooter {message} />
{/if}
