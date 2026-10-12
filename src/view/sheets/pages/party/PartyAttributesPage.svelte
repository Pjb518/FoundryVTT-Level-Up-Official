<script lang="ts">
  import { getContext } from "svelte";
  import { replaceHyphenWithMinusSign } from "#utils/replaceHyphenWithMinusSign";

  function getActorAbilities(actor: Creature) {
    const abilities: Record<
      string,
      { check: number; save: number; prof: boolean }
    > = {};

    Object.entries(actor.reactive.system.abilities ?? {}).forEach(
      ([key, abl]) => {
        abilities[key] = {
          check: replaceHyphenWithMinusSign(abl.check.deterministicBonus || 0),
          save: replaceHyphenWithMinusSign(abl.save.deterministicBonus || 0),
          prof: abl.save.proficient,
        };
      },
    );

    return abilities;
  }

  function getGridArea() {
    let variable = "img name ";
    variable += `${Object.keys(CONFIG.A5E.abilities).join(" ")}`;
    return `"${variable}"`;
  }

  function getGridSize() {
    const abilities = Object.keys(CONFIG.A5E.abilities);
    let variable = `2rem 1fr repeat(${abilities.length}, 0.5fr)`;
    return variable;
  }

  let party: Actor.OfType<"party"> = getContext("party");
  let members = $derived(party.reactive.members);
  let gridArea = getGridArea();
  let gridSize = getGridSize();
</script>

<section
  class="a5e-party-sheet__attributes"
  style="--a5e-party-sheet-attributes-grid-area: {gridArea}; --a5e-party-sheet-attributes-grid-size: {gridSize}; "
>
  <header class="a5e-party-sheet__attributes__header">
    {#each Object.entries(CONFIG.A5E.abilityAbbreviations) as [abl, label]}
      <span style="grid-area: {abl};">
        {label}
      </span>
    {/each}
  </header>

  <div class="a5e-party-sheet__attributes__members">
    {#each members as actor}
      {const abilities = getActorAbilities(actor)}
      {const displayOnly = !(
        game.user.isGM ||
        actor.testUserPermission(
          game.user,
          CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
        )
      )}

      <div class="a5e-party-sheet__attributes__row">
        <img
          class="a5e-party-sheet__actor-img a5e-party-sheet__attributes-img"
          style="width: 2rem;"
          src={actor.reactive.img}
          alt={actor.reactive.name}
        />

        <span class="a5e-party-sheet__attributes-name">
          {actor.reactive.name}
        </span>

        {#each Object.entries(abilities) as [abl, { check, save, prof }]}
          <div class="a5e-party-sheet__attribute" style="grid-area: {abl}">
            <div
              class="a5e-party-sheet__attribute__check"
              onclick={() => {
                if (displayOnly) return;
                actor.rollAbilityCheck(abl);
              }}
            >
              <span>{check}</span>
            </div>

            <div
              class="a5e-party-sheet__attribute__save"
              class:a5e-party-sheet__attribute__save--prof={prof}
              onclick={() => {
                if (displayOnly) return;
                actor.rollSavingThrow(abl);
              }}
            >
              <span>{save}</span>
            </div>
          </div>
        {/each}
      </div>
    {/each}
  </div>
</section>

<style lang="scss"></style>
