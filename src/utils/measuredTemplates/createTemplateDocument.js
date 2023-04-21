import getCircleTemplateData from './getCircleTemplateData';
import getConeTemplateData from './getConeTemplateData';
import getCubeTemplateData from './getCubeTemplateData';
import getLineTemplateData from './getLineTemplateData';

const TEMPLATE_FUNCTION_MAP = {
  circle: getCircleTemplateData,
  cone: getConeTemplateData,
  cube: getCubeTemplateData,
  cylinder: getCircleTemplateData,
  line: getLineTemplateData,
  sphere: getCircleTemplateData,
  square: getCubeTemplateData
};

export default function createTemplateDocument(item, actionId) {
  const { shape } = item.actions[actionId].area;
  const templateConfigFunction = TEMPLATE_FUNCTION_MAP[shape];

  const templateData = templateConfigFunction(item, actionId);
  if (!templateData) return null;

  const TemplateDocument = CONFIG.MeasuredTemplate.documentClass;

  return new TemplateDocument(templateData, { parent: canvas.scene });
}
