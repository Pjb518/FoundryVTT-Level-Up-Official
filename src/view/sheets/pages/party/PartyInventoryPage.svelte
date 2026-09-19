<script lang="ts">
  import { getContext } from "svelte";

  let party: Actor.OfType<"party"> = getContext("party");
</script>

<div class="a5e-party-sheet__stash">
  <aside class="a5e-party-sheet__stash-aside"></aside>

  <section class="a5e-party-sheet__stash-inventory"></section>
</div>

<style lang="scss"></style>
