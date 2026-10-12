<script lang="ts">
  import { getContext } from "svelte";
  import RadioGroup from "#view/snippets/RadioGroup.svelte";
  import Section from "#view/snippets/Section.svelte";

  function requestAbilityCheck() {
    const rollString = `[[/check ability="${selectedCheckAbility}" dc="${abilityCheckDC}"]]`;
    toCard(rollString);
  }

  function requestSavingThrow() {
    const rollString = `[[/save ability="${selectedSaveAbility}" dc="${abilitySaveDC}"]]`;
    toCard(rollString);
  }

  function requestSkillCheck() {
    const rollString = `[[/check skill="${selectedSkill}" dc="${skillDC}"]]`;
    toCard(rollString);
  }

  async function toCard(rollString: string) {
    let content = "<strong>Requested Roll: </strong> <br /><br />";
    content += `${rollString}`;
    // content = await foundry.applications.ux.TextEditor.enrichHTML(content);

    const chatData = {
      author: game.user.id,
      style: CONST.CHAT_MESSAGE_STYLES.OTHER,
      sound: CONFIG.sounds.notification,
      content,
    };

    await ChatMessage.create(chatData);
  }

  const { abilities, skills } = CONFIG.A5E;
  let party: Actor.OfType<"party"> = getContext("party");

  let xpValue = $state(0);
  let selectedCheckAbility = $state("str");
  let abilityCheckDC = $state(0);
  let selectedSaveAbility = $state("str");
  let abilitySaveDC = $state(0);
  let selectedSkill = $state("acr");
  let skillDC = $state(0);
</script>

<div class="a5e-party-sheet__actions">
  <Section
    heading="Distribute XP"
    headerButtons={[
      {
        htmlString: '<i class="fa-solid fa-share"</i>',
        tooltip: "Distribute XP",
        handler: () => party.distributeXP(xpValue),
      },
    ]}
  >
    <div>
      <input
        class="a5e-input a5e-input--small a5e-input--slim"
        type="number"
        bind:value={xpValue}
      />
    </div>
  </Section>

  <Section
    heading="Request Ability Check"
    headerButtons={[
      {
        htmlString: '<i class="fa-solid fa-dice-d20"</i>',
        tooltip: "Request Ability Check",
        handler: () => requestAbilityCheck(),
      },
    ]}
    --a5e-section-body-gap="0.5rem"
  >
    <RadioGroup
      options={Object.entries(abilities)}
      allowDeselect={false}
      selected={selectedCheckAbility}
      onUpdateSelection={(value) => (selectedCheckAbility = value)}
    />

    <div class="a5e-party-sheet__actions__dc">
      <input
        id="a5e-party-ability-check-dc"
        class="a5e-input a5e-input--small a5e-input--slim"
        type="number"
        bind:value={abilityCheckDC}
      />

      <label
        class="a5e-party-sheet__actions__dc__label"
        for="a5e-party-ability-check-dc"
      >
        Optional DC
      </label>
    </div>
  </Section>

  <Section
    heading="Request Saving Throw"
    headerButtons={[
      {
        htmlString: '<i class="fa-solid fa-dice-d20"</i>',
        tooltip: "Request Saving Throw",
        handler: () => requestSavingThrow(),
      },
    ]}
    --a5e-section-body-gap="0.5rem"
  >
    <RadioGroup
      options={Object.entries(abilities)}
      allowDeselect={false}
      selected={selectedSaveAbility}
      onUpdateSelection={(value) => (selectedSaveAbility = value)}
    />

    <div class="a5e-party-sheet__actions__dc">
      <input
        id="a5e-party-ability-save-dc"
        class="a5e-input a5e-input--small a5e-input--slim"
        type="number"
        bind:value={abilitySaveDC}
      />

      <label
        class="a5e-party-sheet__actions__dc__label"
        for="a5e-party-ability-save-dc"
      >
        Optional DC
      </label>
    </div>
  </Section>

  <Section
    heading="Request Skill Check"
    headerButtons={[
      {
        htmlString: '<i class="fa-solid fa-dice-d20"</i>',
        tooltip: "Request Skill Check",
        handler: () => requestSkillCheck(),
      },
    ]}
    --a5e-section-body-gap="0.5rem"
  >
    <RadioGroup
      options={Object.entries(skills)}
      allowDeselect={false}
      selected={selectedSkill}
      onUpdateSelection={(value) => (selectedSkill = value)}
    />

    <div class="a5e-party-sheet__actions__dc">
      <input
        id="a5e-party-skill-check-dc"
        class="a5e-input a5e-input--small a5e-input--slim"
        type="number"
        bind:value={skillDC}
      />

      <label
        class="a5e-party-sheet__actions__dc__label"
        for="a5e-party-skill-check-dc"
      >
        Optional DC
      </label>
    </div>
  </Section>
</div>

<style lang="scss">
</style>
