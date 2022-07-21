/**
   * Measure the distance traversed over an array of measured segments
   * @param {object[]} segments                An Array of measured movement segments
   * @param {MeasureDistancesOptions} options  Additional options which modify the measurement
   * @returns {number[]}                       An Array of distance measurements for each segment
   * @override
*/
export default function measureDistances(segments, options = {}) {
  if (!options.gridSpaces) return BaseGrid.prototype.measureDistances.call(this, segments, options);

  // Track the total number of diagonals
  let diagonalCount = 0;
  const d = canvas.dimensions;
  const rule = this.parent.diagonalRule;

  const gridDistance = canvas.scene.grid.distance;

  return segments.map((segment) => {
    const { ray } = segment;

    // Determine the total distance traveled
    const totalX = Math.abs(Math.ceil(ray.dx / d.size));
    const totalY = Math.abs(Math.ceil(ray.dy / d.size));

    // Determine the number of straight and diagonal moves
    const totalDiagonals = Math.min(totalX, totalY);
    const totalStraights = Math.abs(totalY - totalX);
    diagonalCount += totalDiagonals;

    if (rule === 'euclidean') return Math.round(Math.hypot(totalX, totalY) * gridDistance);

    if (rule === '5105') {
      const d10 = Math.floor(diagonalCount / 2) - Math.floor((diagonalCount - totalDiagonals) / 2);
      const spaces = (d10 * 2) + (totalDiagonals - d10) + totalStraights;
      return spaces * canvas.dimensions.distance;
    }

    return (totalDiagonals + totalStraights) * gridDistance;
  });
}
