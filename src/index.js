import './scss/main.scss';

import canvasInit from './hooks/canvasInit';
import createActor from './hooks/createActor';
import createToken from './hooks/createToken';
import init from './hooks/init';
import preDeleteChatMessage from './hooks/preDeleteChatMessage';
import ready from './hooks/ready';
import renderChatMessage from './hooks/renderChatMessage';
import setup from './hooks/setup';

Hooks.once('init', init);
Hooks.once('setup', setup);
Hooks.once('ready', ready);
Hooks.on('canvasInit', canvasInit);
Hooks.on('createActor', createActor);
Hooks.on('createToken', createToken);
Hooks.on('renderChatMessage', renderChatMessage);
Hooks.on('preDeleteChatMessage', preDeleteChatMessage);
