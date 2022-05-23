import getCircleTemplateData from './getCircleTemplateData';
import getConeTemplateData from './getConeTemplateData';
import getCubeTemplateData from './getCubeTemplateData';
import getLineTemplateData from './getLineTemplateData';

const TEMPLATE_FUNCTION_MAP = {
  cone: getConeTemplateData,
  cube: getCubeTemplateData,
  cylinder: getCircleTemplateData,
  line: getLineTemplateData,
  sphere: getCircleTemplateData
};

export default function createTemplateDocument(item) {
  const { shape } = item.data.data.area;
  const templateConfigFunction = TEMPLATE_FUNCTION_MAP[shape];

  if (!templateConfigFunction) return null;

  const templateData = templateConfigFunction(item);
  const TemplateDocument = CONFIG.MeasuredTemplate.documentClass;

  return new TemplateDocument(templateData, { parent: canvas.scene });
}
