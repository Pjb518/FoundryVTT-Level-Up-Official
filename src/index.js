import './scss/main.scss';

import canvasInit from './hooks/canvasInit';
import createActor from './hooks/createActor';
import createToken from './hooks/createToken';
import init from './hooks/init';
import preDeleteChatMessage from './hooks/preDeleteChatMessage';
import preCreateChatMessage from './hooks/preCreateChatMessage';
import ready from './hooks/ready';
import renderChatMessage from './hooks/renderChatMessage';
import setup from './hooks/setup';
import updateActor from './hooks/updateActor';

Hooks.once('init', init);
Hooks.once('setup', setup);
Hooks.once('ready', ready);

Hooks.on('canvasInit', canvasInit);

Hooks.on('createActor', createActor);
Hooks.on('createToken', createToken);

Hooks.on('updateActor', updateActor);

Hooks.on('renderChatMessage', renderChatMessage);
Hooks.on('preCreateChatMessage', preCreateChatMessage);
Hooks.on('preDeleteChatMessage', preDeleteChatMessage);
