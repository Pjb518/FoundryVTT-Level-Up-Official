import "./scss/main.scss";

import canvasInit from "./hooks/canvasInit.ts";
import canvasReady from "./hooks/canvasReady.ts";
import createActor from "./hooks/createActor.ts";
import createToken from "./hooks/createToken.ts";
import init from "./hooks/init.ts";
import getDocumentDirectoryContext from "./hooks/getDocumentDirectoryContext.ts";
import preDeleteChatMessage from "./hooks/preDeleteChatMessage.ts";
import preCreateChatMessage from "./hooks/preCreateChatMessage.ts";
import ready from "./hooks/ready.ts";
import renderApplication from "./hooks/renderApplication.ts";
import renderChatMessage from "./hooks/renderChatMessage.ts";
import renderSettings from "./hooks/renderSettings.ts";
import renderTokenHUDA5E from "./hooks/renderTokenHUDA5E.ts";
import setup from "./hooks/setup.ts";
import updateActor from "./hooks/updateActor.ts";
import { renderAbstractSideBarTab } from "./hooks/renderAbstractSidebarTab.ts";

Hooks.once("init", init);
Hooks.once("setup", setup);
Hooks.once("ready", ready);

Hooks.on("canvasInit", canvasInit);
Hooks.on("canvasReady", canvasReady);

Hooks.on("getActorDirectoryEntryContext", (dialog, html, data) =>
  getDocumentDirectoryContext(dialog, html, data, "Actor"),
);
Hooks.on("getItemDirectoryEntryContext", (dialog, html, data) =>
  getDocumentDirectoryContext(dialog, html, data, "Item"),
);
Hooks.on("getCompendiumDirectoryEntryContext", (dialog, html, data) =>
  getDocumentDirectoryContext(dialog, html, data, "Pack"),
);

Hooks.on("createActor", createActor);
Hooks.on("createToken", createToken);

Hooks.on("updateActor", updateActor);

Hooks.on("renderAbstractSidebarTab", renderAbstractSideBarTab);
Hooks.on("renderApplicationV2", renderApplication);
Hooks.on("renderChatMessage", renderChatMessage);
Hooks.on("preCreateChatMessage", preCreateChatMessage);
Hooks.on("preDeleteChatMessage", preDeleteChatMessage);
Hooks.on("renderSettings", renderSettings);
Hooks.on("renderTokenHUDA5e", renderTokenHUDA5E);
