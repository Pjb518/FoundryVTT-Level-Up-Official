<template>
  <section
    class="u-flex u-flex-col u-gap-lg u-h-full u-pt-lg u-overflow-y-auto"
  >
    <section
      v-if="actorType === 'character'"
      class="a5e-box u-mx-lg u-p-md a5e-form__section--bio-wrapper"
    >
      <div
        v-for="[key, label] in Object.entries({
          age: 'A5E.DetailsAge',
          eyeColor: 'A5E.DetailsEyeColor',
          hairColor: 'A5E.DetailsHairColor',
          skinColor: 'A5E.DetailsSkinColor',
          height: 'A5E.DetailsHeight',
          weight: 'A5E.DetailsWeight',
          gender: 'A5E.DetailsGender',
        })"
        :key="key"
        class="u-align-center u-flex u-gap-md u-justify-space-between"
      >
        <h3 class="u-text-bold u-text-sm u-flex-shrink-0 u-mb-0">
          {{ localize(label) }}
        </h3>

        <div class="a5e-input-container a5e-input-container--bio">
          <input
            class="a5e-input a5e-input--slim"
            type="text"
            :name="`data.details.${key}`"
            :value="data.data.details[key]"
          />
        </div>
      </div>
    </section>

    <section class="u-flex u-flex-grow u-gap-lg">
      <div class="u-flex u-flex-col u-flex-grow">
        <div
          class="
            u-align-center
            u-border-b
            u-border-gray
            u-flex
            u-gap-lg
            u-mx-lg
            u-mb-md
            u-pb-md
          "
        >
          <a
            class="
              a5e-button
              u-border
              u-hover-bg-green
              u-hover-text-light
              u-hover-text-shadow-none
              u-p-sm
              u-rounded
              u-text-sm
              u-transition
            "
            :class="{
              'u-border-gray': currentEditor !== 'backstory',
              'u-bg-green u-border-green u-text-light':
                currentEditor === 'backstory',
            }"
            @click.prevent="onSelectEditor('backstory')"
          >
            {{
              actorType === "character"
                ? localize("A5E.DetailsBackstory")
                : localize("A5E.DetailsNotes")
            }}
          </a>

          <a
            v-if="actorType === 'character'"
            class="
              a5e-button
              u-border
              u-hover-bg-green
              u-hover-text-light
              u-hover-text-shadow-none
              u-p-sm
              u-rounded
              u-text-sm
              u-transition
            "
            :class="{
              'u-border-gray': currentEditor !== 'appearance',
              'u-bg-green u-border-green u-text-light':
                currentEditor === 'appearance',
            }"
            @click.prevent="onSelectEditor('appearance')"
          >
            {{ localize("A5E.DetailsAppearance") }}
          </a>

          <a
            v-if="actorType === 'npc'"
            class="
              a5e-button
              u-border
              u-hover-bg-green
              u-hover-text-light
              u-hover-text-shadow-none
              u-p-sm
              u-rounded
              u-text-sm
              u-transition
            "
            :class="{
              'u-border-gray': currentEditor !== 'privateNotes',
              'u-bg-green u-border-green u-text-light':
                currentEditor === 'privateNotes',
            }"
            @click.prevent="onSelectEditor('privateNotes')"
          >
            {{ localize("A5E.DetailsNotesPrivate") }}
          </a>
        </div>

        <section
          v-if="currentEditor === 'backstory'"
          class="a5e-editor u-flex u-flex-col u-flex-grow u-overflow-y-auto"
        >
          <div
            v-if="sheetIsLocked"
            v-html="
              TextEditor.enrichHTML(data.data.details.bio) ||
              `<p>Nothing to display.</p>`
            "
            class="u-flex-grow u-p-lg u-pt-xs"
          ></div>

          <div class="u-flex u-flex-col u-flex-grow u-p-lg u-pt-xs" v-else>
            <editor v-model="backstory" />
          </div>
        </section>

        <section
          v-if="currentEditor === 'appearance'"
          class="a5e-editor u-flex u-flex-col u-flex-grow u-overflow-y-auto"
        >
          <div
            v-if="sheetIsLocked"
            v-html="
              TextEditor.enrichHTML(data.data.details.appearance) ||
              `<p>Nothing to display.</p>`
            "
            class="u-flex-grow u-p-lg u-pt-xs"
          ></div>

          <div class="u-flex u-flex-col u-flex-grow u-p-lg u-pt-xs" v-else>
            <editor v-model="appearance" />
          </div>
        </section>

        <section
          v-if="currentEditor === 'privateNotes'"
          class="a5e-editor u-flex u-flex-col u-flex-grow u-overflow-y-auto"
        >
          <div
            v-if="sheetIsLocked"
            v-html="
              TextEditor.enrichHTML(data.data.details.privateNotes) ||
              `<p>Nothing to display.</p>`
            "
            class="u-flex-grow u-p-lg u-pt-xs"
          ></div>

          <div class="u-flex u-flex-col u-flex-grow u-p-lg u-pt-xs" v-else>
            <editor v-model="privateNotes" />
          </div>
        </section>
      </div>
    </section>
  </section>
</template>

<script>
import { inject, ref, watch } from "vue";

import Editor from "../../forms/Editor.vue";

export default {
  components: { Editor },
  setup() {
    const actor = inject("actor");
    const data = inject("data");
    const sheetIsLocked = inject("sheetIsLocked");

    const currentEditor = ref("backstory");
    const appearance = ref(data.value.data.details.appearance);
    const backstory = ref(data.value.data.details.bio);
    const privateNotes = ref(data.value.data.details.privateNotes);

    function onSelectEditor(editor) {
      currentEditor.value = editor;
    }

    watch(
      () => appearance.value,
      async (curr) => {
        await actor.update({ "data.details.appearance": curr });
      }
    );

    watch(
      () => backstory.value,
      async (curr) => {
        await actor.update({ "data.details.bio": curr });
      }
    );

    watch(
      () => privateNotes.value,
      async (curr) => {
        await actor.update({ "data.details.privateNotes": curr });
      }
    );

    return {
      actorType: actor.type,
      appearance,
      backstory,
      currentEditor,
      data,
      localize: (key) => game.i18n.localize(key),
      onSelectEditor,
      privateNotes,
      sheetIsLocked,
      TextEditor,
    };
  },
};
</script>
