import { CompendiumBrowser } from "#view/dialogs/initializers/CompendiumBrowser.svelte.ts";

async function renderCompendiaBrowser(app, html: HTMLElement) {
  if (app.tabName !== "compendium") return;

  const button = document.createElement("button");
  button.classList.add("a5e-sidebar-button--compendia-browser");

  const i = document.createElement("i");
  i.classList.add("fa-solid");
  i.classList.add("fa-book-atlas");
  button.appendChild(i);

  const span = document.createElement("span");
  span.textContent = "Compendium Browser";
  button.appendChild(span);

  const parent = html.querySelector(".header-actions");
  if (!parent) return;

  parent.append(button);

  // Add Event Listener
  button.addEventListener("click", (e) => {
    e.preventDefault();
    new CompendiumBrowser().render(true);
  });
}

export async function renderAbstractSideBarTab(app, html: HTMLElement) {
  renderCompendiaBrowser(app, html);
}
