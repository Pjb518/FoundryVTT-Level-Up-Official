export default function prepareAreaSummary(areaData) {
  const {
    height, length, radius, shape, width
  } = areaData;

  if (!shape || !['cone', 'cube', 'cylinder', 'line', 'sphere'].includes(shape)) return null;

  let areaDetails;
  const areaName = game.i18n.localize(`A5E.Area${shape.charAt(0).toUpperCase() + shape.slice(1)}`);
  const unit = game.i18n.localize('A5E.MeasurementFeetAbbr');

  if (shape === 'cone') {
    if (length) areaDetails = `${length} ${unit}`;
  } else if (shape === 'cube') {
    if (width) areaDetails = `${width} ${unit}`;
  } else if (shape === 'cylinder') {
    if (radius) {
      if (height) areaDetails = `${radius} ${unit} ${game.i18n.localize('A5E.ItemAreaRadius')}; ${height} ${unit} ${game.i18n.localize('A5E.ItemAreaHeight')}`;
      else areaDetails = `${radius} ${unit} ${game.i18n.localize('A5E.ItemAreaRadius')}`;
    }
  } else if (shape === 'line') {
    if (length) {
      if (width) areaDetails = `${length} ${unit} x ${width} ${unit}`;
      else areaDetails = `${length} ${unit} x 5 ${unit}`;
    }
  } else if (shape === 'sphere') {
    if (radius) areaDetails = `${radius} ${unit} ${game.i18n.localize('A5E.ItemAreaRadius')}`;
  }

  return areaDetails ? `${areaName} (${areaDetails})` : areaName;
}
