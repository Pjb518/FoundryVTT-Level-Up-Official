const crLabels = {
  0: '0',
  0.125: '1/8',
  0.25: '1/4',
  0.5: '1/2'
};

export default function prepareChallengeRating(data) {
  const cr = parseFloat(data.value.data.details.cr || 0);
  return cr >= 1 ? String(cr) : crLabels[cr] || 1;
}
