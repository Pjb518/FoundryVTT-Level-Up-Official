<svelte:options accessors={true} />

<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  const application = getContext("external").application;
  const languages = application.getLanguages();

  function submitForm() {
    application.submit(languages);
  }
</script>

<form>
  <section class="language-list">
    <h3>{localize("A5E.Languages")}</h3>
    <div class="container">
      {#each languages.core as language (language.value)}
        <input
          type="checkbox"
          id="core-language-{language.value}"
          checked={language.selected}
          disabled={language.disabled}
          on:change={({ target }) => (language.selected = target.checked)}
        />

        <label for={`core-language-${language.value}`}>
          {language.name}
        </label>
      {/each}
    </div>
  </section>

  <input
    class="a5e-input"
    type="text"
    name="custom-languages"
    value={languages.custom}
    on:change={({ target }) => (languages.custom = target.value)}
  />

  <p class="hint">{localize("A5E.HintSeparateBySemiColon")}</p>
  <div class="button-container">
    <button on:click|preventDefault={submitForm}>Submit</button>
  </div>
</form>

<style lang="scss">
  form {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0.75rem;
    gap: 1rem;
    overflow: auto;
  }

  .language-list {
    h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      border-bottom: 1px solid gray;
    }

    .container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.2rem;
    }

    input {
      display: none;

      &:checked + label {
        background: #2b6537;
        border-color: darken($color: #2b6537, $amount: 5);
        color: #f6f2eb;
      }

      &:disabled + label {
        color: #999;
      }
    }

    label {
      border-radius: 3px;
      border: 1px solid #bbb;
      font-size: 1rem;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
    }
  }

  .button-container {
    display: flex;
  }
</style>
