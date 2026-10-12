<script lang="ts">
  import { localize } from "#utils/localization/localize.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
  import { editDocumentImage } from "#utils/view/editDocumentImage.ts";
  import Editor from "#view/components/Editor.svelte";
  import type { FollowerSheetA5E } from "#documents/sheets/FollowerSheet.svelte.ts";

  type Props = {
    follower: Actor.OfType<"follower">;
    sheet: FollowerSheetA5E;
  };

  function onEditImage(event: MouseEvent) {
    editDocumentImage(follower, { shiftKey: event.shiftKey });
  }

  let { follower, sheet }: Props = $props();

  const prose = ["personality", "quirk", "motivation"] as const;

  let system = $derived(follower.reactive.system);
  let experienceType = $derived(system.experienceType ?? "inexperienced");
  let editable = $derived(follower.isOwner);
</script>

<main class="a5e-follower-sheet">
  <header class="a5e-follower-sheet__header">
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <img
      class="a5e-follower-sheet__img"
      src={follower.reactive.img}
      alt={follower.reactive.name}
      onclick={editable ? onEditImage : undefined}
    />

    <input
      class="a5e-input a5e-input--character-name"
      type="text"
      value={follower.reactive.name}
      spellcheck="false"
      autocomplete="off"
      disabled={!editable}
      onchange={({ currentTarget }) =>
        updateDocumentDataFromField(follower, "name", currentTarget.value)}
    />

    <span class="a5e-follower-sheet__badge a5e-follower-sheet__badge--{experienceType}">
      {localize(CONFIG.A5E.followerExperienceTypes[experienceType])}
    </span>
  </header>

  <section class="a5e-follower-sheet__feature">
    <h3 class="a5e-follower-sheet__label">{localize("A5E.follower.feature")}</h3>
    <div class="a5e-follower-sheet__placeholder">
      {localize("A5E.follower.featurePlaceholder")}
    </div>
  </section>

  {#each prose as field (field)}
    <section class="a5e-follower-sheet__prose">
      <h3 class="a5e-follower-sheet__label">{localize(`A5E.follower.${field}`)}</h3>
      {#key `${field}::${system[field]}`}
        <Editor
          content={system[field] ?? ""}
          document={follower}
          documentUuid={follower.uuid}
          field="system.{field}"
          manageSecrets={follower.isOwner}
        />
      {/key}
    </section>
  {/each}
</main>
