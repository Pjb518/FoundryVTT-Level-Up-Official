import renderPartyViewer from './renderPartyViewer';

export default function renderApplication(application) {
  if (
    application.constructor.name !== 'SceneControls'
    || (!game.settings.get('a5e', 'playersCanAccessPartyViewer') && !game.user.isGM)
  ) return;

  const sceneControls = document.querySelector('nav#controls .main-controls');
  const button = document.createElement('li');

  button.innerHTML = `
    <li
      id="a5e-js-toggle-party-viewer-visibility"
      class="scene-control"
      data-tooltip="Party Viewer"
    >
      <i class="fa-solid fa-users"></i>
    </li>
  `;

  button.addEventListener('click', renderPartyViewer);
  sceneControls.append(button);
}
