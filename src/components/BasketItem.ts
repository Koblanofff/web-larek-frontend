import { Component } from "./base/Component";
import { ICard } from "../types";
import { IEvents } from "./base/events";
import { setElementProperty } from "../utils/utils";

interface IBasketItemData extends Partial<ICard> {
	amount: number;
	index: number;
}

export class BasketItem extends Component <IBasketItemData> {
	private itemIndex: HTMLSpanElement;
	private itemTitle: HTMLSpanElement;
	private itemPrice: HTMLSpanElement;
	private deleteItemButton: HTMLButtonElement;
	private events: IEvents;
	
	private _amount: number;
	private _id: string;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.itemIndex = container.querySelector('.basket__item-index');
		this.itemTitle = container.querySelector('.card__title');
		this.itemPrice = container.querySelector('.card__price');
		this.deleteItemButton = container.querySelector('.basket__item-delete');

		this.deleteItemButton.addEventListener('click', () => {
			this.events.emit('product:deleteFromBasket', {data: this.id})
		})
	}

	render(itemData: IBasketItemData): HTMLElement {
		if(!itemData) return this.container;

        Object.assign(this, itemData);
        return super.render(itemData);
	}

	set title(value: string) {
		setElementProperty(this.itemTitle, 'textContent', value);
	}

	set amount(value: number) {
		this._amount = value;
	}

	get amount() {
		return this._amount
	}

	set price(value: number) {
        setElementProperty(this.itemPrice, 'textContent', value ? `${value * this._amount} синапсов` : "Бесценно");
	}

	set index(value: number) {
		setElementProperty(this.itemIndex, 'textContent', `${value}`)
	}

	set id(value: string) {
		this._id = value;
	}

	get id() {
		return this._id;
	}


	getElement(): HTMLElement {
		return this.container;
	}
}
