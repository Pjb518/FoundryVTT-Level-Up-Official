export default {
  iconScale: (size) => {
    if (size >= 5) return 2.5;
    if (size >= 4) return 2.25;
    if (size >= 3) return 1.55;
    if (size >= 2) return 1.25;
    return 1.4;
  },
  maxIcons: (size) => {
    if (size >= 3) return 22;
    if (size >= 2) return 17;
    if (size >= 1) return 14;
    return 10;
  },
  ringOffset: (size) => {
    if (size >= 5) return 0.125;
    if (size >= 3) return 0.225;
    if (size >= 2) return 0.225;
    if (size >= 1) return 0.425;
    return 1.45;
  },
  ringRotation: (size) => {
    if (size >= 3) return 0.02;
    if (size >= 2) return 0.03;
    if (size >= 1) return 0.035;
    return 0.035;
  },
  sizeOffset: (size) => {
    if (size >= 5) return 1.080;
    if (size >= 3) return 1.080;
    if (size >= 2) return 1.120;
    if (size >= 1) return 1.25;
    return 1.45;
  }
};
