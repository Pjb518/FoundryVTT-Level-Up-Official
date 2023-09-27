import FeatureItemA5e from '../documents/item/feature';
import OriginItemA5e from '../documents/item/origin';

export default function registerDocumentConfig(A5E) {
  A5E.Item = {
    documentClasses: {
      feature: FeatureItemA5e,
      background: OriginItemA5e,
      culture: OriginItemA5e,
      destiny: OriginItemA5e,
      heritage: OriginItemA5e
    }
  };
}
