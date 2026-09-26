import { GenericConfigDialog } from '#view/dialogs/initializers/GenericConfigDialog.svelte.ts';

import fields = foundry.data.fields;
import DataModel = foundry.abstract.DataModel;

// ======================================================
// Schema
// ======================================================
const baseSchema = () => ({
	/** @deprecated */
	_id: new fields.StringField({ persisted: false, required: true, nullable: false, initial: '' }),
	id: new fields.StringField({ persisted: false, required: true, nullable: false, initial: '' }),
	/** @deprecated */
	label: new fields.StringField({ requied: true, nullable: false, initial: '' }),
	name: new fields.StringField({ requied: true, nullable: false, initial: '' }),
	img: new fields.StringField({
		required: true,
		nullable: false,
		initial: '',
	}),
	flags: new fields.DocumentFlagsField({ required: true, nullable: false }),
	level: new fields.NumberField({ required: true, nullable: false, initial: 1, min: 1 }),
	levelType: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'character',
		choices: ['character', 'class'],
	}),
	optional: new fields.BooleanField({ required: true, nullable: false, initial: false }),
	restriction: new fields.StringField({ required: true, nullable: false, initial: undefined }),
	type: new fields.StringField({ required: true, nullable: false, blank: false, initial: '' }),
	/** @deprecated */
	grantType: new fields.StringField({ required: true, nullable: false, blank: false, initial: '' }),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace BaseGrant {
	type Schema = DataSchema & ReturnType<typeof baseSchema>;
}

class BaseGrant<
	const GrantSchema extends BaseGrant.Schema = BaseGrant.Schema,
> extends DataModel<GrantSchema> {
	#component: any;

	static type: string = '';

	static override defineSchema(): BaseGrant.Schema {
		return {
			...baseSchema(),
		};
	}

	get item() {
		const doc = this.getNearestDocument();
		if (doc?.documentName === 'Item') return doc;
		return null;
	}

	getApplyData(actor: any, data: any): any {
		return {};
	}

	getSelectionComponent(): any {
		return this.#component;
	}

	getSelectionComponentProps(data: any): any {
		return { ...data };
	}

	requiresConfig() {
		return false;
	}

	async configureGrant(title: string, data: any, component: any, options: any = {}): Promise<any> {
		const dialog = new GenericConfigDialog(this.item, title, component, data, options);

		await dialog.render(true);
		const promise = await dialog.promise;

		if (!promise) return {};
		return promise;
	}

	async deleteGrant(): Promise<void> {
		const item = this.item;
		if (!item) return;

		await item.update({
			[`system.grants.${this.id}`]: _del,
		});

		const document = item.parent;
		if (document?.documentName !== 'Actor') return;
		document.grants.removeGrant(this.id);
	}

	static override migrateData(source, options) {
		super.migrateData(source, options);
		if (!source) return source;

		source.type ??= source.grantType;
		return source;
	}
}

export { BaseGrant };

export default BaseGrant;
