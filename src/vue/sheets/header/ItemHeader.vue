<template>
  <header class="a5e-sheet-header a5e-sheet-header--item">
    <img
      class="a5e-image a5e-image--item-header"
      :src="data.img"
      :title="data.name"
      data-edit="img"
    />

    <div class="a5e-sheet-header__primary-details">
      <div class="u-flex-grow">
        <input
          class="a5e-input a5e-input--character-name"
          name="name"
          type="text"
          :value="data.name"
          :placeholder="localize('A5E.ItemNew')"
        />

        <div v-if="item.type === 'spell'" class="u-flex u-gap-sm u-text-medium">
          {{ localize(config.spellLevels[data.data.level]) }}

          <span v-if="data.data.schools.primary">
            ({{
              localize(
                config.spellSchools.primary[data.data.schools.primary] ??
                  data.data.schools.primary
              )
            }})
          </span>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { inject } from "vue";

export default {
  setup() {
    const data = inject("data");
    const item = inject("item");

    return {
      config: CONFIG.A5E,
      data,
      item,
      localize: (key) => game.i18n.localize(key),
    };
  },
};
</script>
