export default class DataProxy {
  constructor(data) {
    // eslint-disable-next-line no-constructor-return
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }
        return data[prop];
      }
    });
  }
}
