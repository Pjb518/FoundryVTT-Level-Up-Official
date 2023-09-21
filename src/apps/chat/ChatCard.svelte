<svelte:options accessors={true} />

<script>
    import { setContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import zip from "../../utils/zip";

    import CheckHeader from "./header/CheckHeader.svelte";
    import CardBody from "./body/CardBody.svelte";
    import ItemActivationFooter from "./footer/ItemActivationFooter.svelte";
    import ItemActivationHeader from "./header/ItemActivationHeader.svelte";
    import RollConfigurationOptions from "./body/RollConfigurationOptions.svelte";

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

    function toggleCriticalDamage() {
        const rolls = zip($message.rolls, $message?.flags?.a5e?.rollData).map(
            ([roll, rollData]) => {
                if (rollData.type !== "damage") return roll;
                if (!rollData.canCrit) return roll;
                if (!rollData.critRoll || !rollData.baseRoll) return roll;

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
/>

{#if $message?.flags?.a5e?.cardType === "item"}
    <ItemActivationFooter {message} />
{/if}
