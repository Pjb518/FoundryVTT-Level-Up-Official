import renderPartyViewer from './renderPartyViewer';

export default function renderApplication(application) {
  if (
    application.constructor.name !== 'SceneControls'
    || (!game.settings.get('a5e', 'playersCanAccessPartyViewer') && !game.user.isGM)
  ) return;

  const sceneControls = document.querySelector('nav#controls .main-controls');
  const button = document.createElement('li');
  const buttonIcon = document.createElement('i');

  buttonIcon.classList.add('fa-solid', 'fa-users');

  button.id = 'a5e-js-toggle-party-viewer-visibility';
  button.classList.add('scene-control');
  button.setAttribute('data-tooltip', 'Party Viewer');
  button.addEventListener('click', renderPartyViewer);
  button.append(buttonIcon);

  sceneControls.append(button);
}
