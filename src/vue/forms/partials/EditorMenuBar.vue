<template>
  <div class="u-flex u-flex-wrap u-gap-sm">
    <editor-menu-button
      v-for="level in 4"
      :key="`heading-${level}`"
      :class="{
        'u-bg-green u-text-light': editor?.isActive('heading', { level }),
      }"
      :icon="`ri-h-${level}`"
      @click="editor.chain().focus().toggleHeading({ level }).run()"
    />

    <editor-menu-button
      :class="{ 'u-bg-green u-text-light': editor?.isActive('bold') }"
      icon="ri-bold"
      @click="editor.chain().focus().toggleBold().run()"
    />

    <editor-menu-button
      :class="{ 'u-bg-green u-text-light': editor?.isActive('italic') }"
      icon="ri-italic"
      @click="editor.chain().focus().toggleItalic().run()"
    />

    <editor-menu-button
      v-for="alignment in ['left', 'center', 'right']"
      :key="`editor-${alignment}`"
      :class="{
        'u-bg-green u-text-light': editor?.isActive({ textAlign: alignment }),
      }"
      :icon="`ri-align-${alignment}`"
      @click="editor.chain().focus().setTextAlign(alignment).run()"
    />

    <editor-menu-button
      :class="{ 'u-bg-green u-text-light': editor?.isActive('blockquote') }"
      icon="ri-double-quotes-l"
      @click="editor.chain().focus().toggleBlockquote().run()"
    />

    <editor-menu-button
      :class="{ 'u-bg-green u-text-light': editor?.isActive('bulletList') }"
      icon="ri-list-unordered"
      @click="editor.chain().focus().toggleBulletList().run()"
    />

    <editor-menu-button
      :class="{ 'u-bg-green u-text-light': editor?.isActive('orderedList') }"
      icon="ri-list-ordered"
      @click="editor.chain().focus().toggleOrderedList().run()"
    />

    <editor-menu-button
      icon="ri-separator"
      @click="editor.chain().focus().setHorizontalRule().run()"
    />
  </div>
</template>

<script>
import EditorMenuButton from "./EditorMenuButton.vue";

export default {
  components: { EditorMenuButton },
  props: { editor: Object },
};
</script>
