<svelte:options accessors={true} />

<script>
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
    import { setContext } from "svelte";

    import prepareRolls from "../dataPreparationHelpers/cardRolls/prepareRolls";
    import toggleExpertiseDice from "../dataPreparationHelpers/cardRolls/toggleExpertiseDice";
    import toggleRollMode from "../dataPreparationHelpers/cardRolls/toggleRollMode";

    import RollCardHeader from "./RollCardHeader.svelte";
    import RollSummary from "./body/RollSummary.svelte";

    export let messageDocument;

    async function repeatRoll() {
        const newRolls = await Promise.all(
            $message.rolls.map((r) => new Roll(r.formula).roll()),
        );

        const chatData = {
            author: $message?.author,
            speaker: $message.speaker,
            sound: $message.sound,
            rolls: newRolls,
            rollMode: $message.rollMode,
            system: {
                actorId: $message.system.actorId,
                actorName: $message.system.actorName,
                img: $message.system.img,
                rollData: foundry.utils.duplicate($message.system.rollData),
                rollType: $message.system.rollType,
            },
            type: "roll",
        };

        // @ts-expect-error
        ChatMessage.applyRollMode(chatData, $message.rollMode);
        // @ts-expect-error
        await ChatMessage.create(chatData);
    }

    function _toggleExpertiseDice(rollIndex, expertiseDice) {
        toggleExpertiseDice($message, rolls, rollIndex, expertiseDice);
    }

    async function _toggleRollMode(rollIndex, rollMode) {
        toggleRollMode($message, rolls, rollIndex, rollMode);
    }

    const message = new TJSDocument(messageDocument);
    const { system, speaker } = $message;

    const { img } = system;
    const tokenName = speaker?.alias || system.actorName;
    const rolls = prepareRolls($message);

    setContext("message", message);
</script>

<RollCardHeader actorName={tokenName} {img} messageDocument={$message} on:repeatCard={repeatRoll} />

<article class="a5e-chat-card__body">
    <section class="rolls">
        {#each rolls ?? [] as [roll, rollData], i}
            <RollSummary
                {roll}
                {rollData}
                on:toggleRollMode={({ detail }) => _toggleRollMode(i, detail)}
                on:toggleExpertiseDice={({ detail }) => _toggleExpertiseDice(i, detail)}
            />
        {/each}
    </section>
</article>

<style lang="scss">
    .rolls {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>
