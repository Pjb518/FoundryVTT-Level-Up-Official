import DetectionModeBlindSight from './blindsight';

export default function prepareDetectionModes() {
  CONFIG.Canvas.detectionModes.blindsight = new DetectionModeBlindSight();
}
