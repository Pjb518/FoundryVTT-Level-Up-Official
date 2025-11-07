import TokenHUDA5e from "../pixi/tokenHUD.ts";

export default function canvasInit() {
  game.canvas.hud.token = new TokenHUDA5e();
}
