import { Component } from "./base/Component";
import { ICard } from "../types";
import { IEvents } from "./base/events";
import { setElementProperty } from "../utils/utils";

interface IBasketItemData extends Partial<ICard> {
    index: number;
	amount: number;
}

export class BasketItem extends Component <IBasketItemData> {
	protected itemIndex: HTMLSpanElement;
	protected itemTitle: HTMLSpanElement;
	protected itemPrice: HTMLSpanElement;
	protected deleteItemButton: HTMLButtonElement;
	protected itemData: Partial<ICard>;

	private _id: string;
	private _amount: number;
	private _price: number;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.itemIndex = container.querySelector('.basket__item-index');
		this.itemTitle = container.querySelector('.card__title');
		this.itemPrice = container.querySelector('.card__price');
		this.deleteItemButton = container.querySelector('.basket__item-delete');

		this.deleteItemButton.addEventListener('click', () => {
			this.events.emit('product:deleteFromBasket', {data: this._id})
		})
	}

	render(itemData: IBasketItemData): HTMLElement {
		if(!itemData) return this.container;

		setElementProperty(this.itemIndex, 'textContent', `${itemData.index}`)
		this._amount = itemData.amount || 1;
        Object.assign(this, itemData);
        return super.render(itemData);
	}

	set title(value: string) {
		setElementProperty(this.itemTitle, 'textContent', value);
	}

	set price(value: number) {
		this._price = value * this._amount
        setElementProperty(this.itemPrice, 'textContent', this._price ? `${this._price} синапсов` : "Бесценно");
	}

	set id(value: string) {
		this._id = value;
	}

	getElement(): HTMLElement {
		return this.container;
	}
}
