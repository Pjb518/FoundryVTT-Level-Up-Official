import './scss/main.scss';

import '#runtime/tinymce';

import canvasInit from './hooks/canvasInit';
import createActor from './hooks/createActor';
import createToken from './hooks/createToken';
import init from './hooks/init';
import getDocumentDirectoryContext from './hooks/getDocumentDirectoryContext';
import preDeleteChatMessage from './hooks/preDeleteChatMessage';
import preCreateChatMessage from './hooks/preCreateChatMessage';
import ready from './hooks/ready';
import renderApplication from './hooks/renderApplication';
import renderChatMessage from './hooks/renderChatMessage';
import setup from './hooks/setup';
import updateActor from './hooks/updateActor';

Hooks.once('init', init);
Hooks.once('setup', setup);
Hooks.once('ready', ready);

Hooks.on('canvasInit', canvasInit);

Hooks.on('getActorDirectoryEntryContext', (dialog, html, data) => getDocumentDirectoryContext(dialog, html, data, 'Actor'));
Hooks.on('getItemDirectoryEntryContext', (dialog, html, data) => getDocumentDirectoryContext(dialog, html, data, 'Item'));
Hooks.on('getCompendiumDirectoryEntryContext', (dialog, html, data) => getDocumentDirectoryContext(dialog, html, data, 'Pack'));

Hooks.on('createActor', createActor);
Hooks.on('createToken', createToken);

Hooks.on('updateActor', updateActor);

Hooks.on('renderApplication', renderApplication);
Hooks.on('renderChatMessage', renderChatMessage);
Hooks.on('preCreateChatMessage', preCreateChatMessage);
Hooks.on('preDeleteChatMessage', preDeleteChatMessage);
