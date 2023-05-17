import TokenHUDA5e from '../documents/tokenHUD';

import measureDistances from '../pixi/measureDistances';

export default function canvasInit() {
  canvas.grid.diagonalRule = game.settings.get('a5e', 'diagonalRule');
  SquareGrid.prototype.measureDistances = measureDistances;
  game.canvas.hud.token = new TokenHUDA5e();
}
