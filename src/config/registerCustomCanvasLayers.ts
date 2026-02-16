class A5EToolsLayer extends CanvasLayer {
  constructor() {
    super();
  }

  override async _draw(options?: object): Promise<void> {
  }

  override async _tearDown(options?: object): Promise<void> {
  }
}

export default function registerCustomCanvasLayers() {
	CONFIG.Canvas.layers.a5eTools = {
    layerClass: A5EToolsLayer,
    group: "interface"
  };
}
