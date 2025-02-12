import A5EDataModel from '../../A5EDataModel';
import GenericDialog from '../../../apps/dialogs/initializers/GenericDialog';

export default class BaseGrant extends A5EDataModel {
	#component = null;

	#configComponent = null;

	// Schema values
	declare _id: string;

	declare img: string;

	declare grantType: string;

	declare label: string;

	declare level: number;

	declare levelType: string;

	declare optional: boolean;

	constructor(data: any, options: any = {}) {
		// @ts-ignore
		super(data, options);
	}

	static defineSchema() {
		const { fields } = foundry.data;

		return {
			_id: new fields.DocumentIdField({ initial: () => foundry.utils.randomID() }),
			img: new fields.StringField({ required: true, initial: '' }),
			grantType: new fields.StringField({ required: true, initial: '' }),
			label: new fields.StringField({ required: true, initial: '' }),
			level: new fields.NumberField({ nullable: false, initial: 1, min: 1 }),
			levelType: new fields.StringField({ required: true, initial: 'character' }),
			optional: new fields.BooleanField({ required: true, initial: false }),
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
		const dialog = new GenericDialog(title, component, data, options);

		await dialog.render(true);
		const promise = await dialog.promise;

		if (!promise) return {};
		return promise;
	}

	async deleteGrant(): Promise<void> {
		const item = this.parent;
		await item.update({
			[`system.grants.-=${this._id}`]: null,
		});

		const document = this.parent?.parent;
		if (!document || document.documentName !== 'Actor') return;
		document.grants.removeGrant(this._id);
	}
}
