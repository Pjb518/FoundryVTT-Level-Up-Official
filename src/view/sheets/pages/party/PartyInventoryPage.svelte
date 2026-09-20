<script lang="ts">
  import { getContext } from "svelte";

  let party: Actor.OfType<"party"> = getContext("party");
  let members = $derived(party.reactive.members);
  let partyWealth = $derived(party.wealth);
</script>

<div class="a5e-party-sheet__stash">
  <aside class="a5e-party-sheet__stash-aside">
    <!-- Party Total -->
    <div class="a5e-party-sheet__stash__party-total">
      <header>Party Total</header>

      <div class="a5e-party-sheet__stash__party-total__data">
        <div class="a5e-party-sheet__stash__party-total__elem">
          <span>
            <i class="fa-solid fa-coins"></i>
            Coins
          </span>

          <span>{partyWealth.coins.toLocaleString()}</span>
        </div>

        <div class="a5e-party-sheet__stash__party-total__elem">
          <span>
            <i class="fa-solid fa-gem"></i>
            Wealth
          </span>

          <span>{partyWealth.wealth.toLocaleString()}</span>
        </div>
      </div>
    </div>

    <!-- Each Member Total -->
    {#each members as actor}
      <div class="a5e-party-sheet__stash__member-total">
        <header>{actor.name}</header>

        <div class="a5e-party-sheet__stash__member-total__data">
          <img
            style="grid-area: img;"
            src={actor.reactive.img}
            alt={actor.reactive.name}
          />

          <div>
            <div>
              <i class="fa-solid fa-coins"></i>
              <span>{actor.wealth.coins.toLocaleString()}</span>
            </div>

            <div>
              <i class="fa-solid fa-gem"></i>
              <span>{actor.wealth.wealth.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </aside>

  <section class="a5e-party-sheet__stash-inventory"></section>
</div>

<style lang="scss"></style>
