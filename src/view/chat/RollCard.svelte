<script lang="ts">
    import { setContext } from "svelte";

    import { prepareRolls } from "#utils/view/cards/cardRolls/prepareRolls.ts";
    import { toggleExpertiseDice } from "#utils/view/cards/cardRolls/toggleExpertiseDice.ts";
    import { toggleRollMode } from "#utils/view/cards/cardRolls/toggleRollMode.ts";

    import RollCardHeader from "./RollCardHeader.svelte";
    import RollSummary from "./components/RollSummary.svelte";

    type Props = {
        messageDocument: any;
    };

    async function repeatRoll() {
        const newRolls = await Promise.all(
            message.rolls.map((r) => new Roll(r.formula).roll()),
        );

        const chatData = {
            author: message?.author,
            speaker: message.speaker,
            sound: message.sound,
            rolls: newRolls,
            rollMode: message.rollMode,
            system: {
                actorId: message.system.actorId,
                actorName: message.system.actorName,
                img: message.system.img,
                rollData: foundry.utils.duplicate(message.system.rollData),
                rollType: message.system.rollType,
            },
            type: "roll",
        };

        // @ts-expect-error
        ChatMessage.applyRollMode(chatData, message.rollMode);
        // @ts-expect-error
        await ChatMessage.create(chatData);
    }

    function _toggleExpertiseDice(rollIndex, expertiseDice) {
        toggleExpertiseDice(message, rolls, rollIndex, expertiseDice);
    }

    async function _toggleRollMode(rollIndex, rollMode) {
        toggleRollMode(message, rolls, rollIndex, rollMode);
    }

    let { messageDocument }: Props = $props();

    const message = messageDocument;
    const { system, speaker } = message;

    const { img } = system;
    const tokenName = speaker?.alias || system.actorName;
    const rolls = prepareRolls(message);

    setContext("message", message);
</script>

<RollCardHeader actorName={tokenName} {img} onRepeatCard={repeatRoll} />

<article class="a5e-chat-card__body">
    <section class="rolls">
        {#each rolls ?? [] as [roll, rollData], i}
            <RollSummary
                {roll}
                {rollData}
                onToggleRollMode={(detail) => _toggleRollMode(i, detail)}
                onToggleExpertiseDice={(detail) => _toggleExpertiseDice(i, detail)}
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
