export function getNearestDocument(model) {
	while (model && !(model instanceof foundry.abstract.Document)) model = model.parent;
	return model;
}
