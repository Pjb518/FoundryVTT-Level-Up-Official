/** @deprecated In favour of TemplatePreparationManager */
export default function getShapeProperties(shape) {
  switch (shape) {
    case 'circle':
    case 'sphere':
      return ['radius'];
    case 'cone':
      return ['length'];
    case 'cube':
    case 'square':
      return ['width'];
    case 'cylinder':
      return ['radius', 'height'];
    case 'line':
      return ['length', 'width'];
    default:
      return [];
  }
}
