export default class DetectionModeBlindSight extends DetectionMode {
  constructor() {
    super({
      angle: false,
      id: 'blindsight',
      label: 'A5E.SenseBlindsight',
      type: DetectionMode.DETECTION_TYPES.OTHER,
      walls: true
    });
  }

  static getDetectionFilter() {
    this._detectionFilter ??= OutlineOverlayFilter.create({
      outlineColor: [1, 1, 1, 1],
      knockout: true,
      wave: true
    });

    return this._detectionFilter;
  }

  _canDetect() {
    return true;
  }

  _testLOS(visionSource, mode, target, test) {
    const polygonBackend = CONFIG.Canvas.polygonBackends.sight;

    return !polygonBackend.testCollision(
      { x: visionSource.x, y: visionSource.y },
      test.point,
      {
        type: 'sight', mode: 'any', source: visionSource, useThreshold: false
      }
    );
  }
}
