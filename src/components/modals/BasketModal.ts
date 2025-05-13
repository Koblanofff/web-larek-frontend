import { BasketItem } from './../BasketItem';
import { Modal } from "../common/Modal";
import { IBasketModel } from "../../types";
import { IEvents } from "../base/events";
import { cloneTemplate, setElementProperty } from '../../utils/utils';
import { AppApi } from '../AppApi';
import { ICardItem } from '../../types';

const basketItemTemplate: HTMLTemplateElement = document.querySelector('#card-basket');

export class BasketModal extends Modal<IBasketModel> {
    protected events: IEvents;
    protected basketList: HTMLUListElement;
    protected basketTotalPriceElement: HTMLSpanElement;
    protected basketTotalPriceValue: number;	
    private renderedItemsId: string[] = [];
	protected makeOrderButton: HTMLButtonElement;
    protected itemsInBasket: ICardItem[];
    private itemsDataCache: Map<string, ICardItem> = new Map();

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container, events);
        this.events = events;

        this.basketList = container.querySelector('.basket__list');
        this.basketTotalPriceElement = container.querySelector('.basket__price');
		this.makeOrderButton = container.querySelector('.basket__button');
        this.basketTotalPriceValue = 0;

        this.makeOrderButton.addEventListener('click', () => {
            const items = Array.from(this.itemsDataCache.values())
                .filter(item => this.renderedItemsId.includes(item.id))
                .map(item => ({
                    ...item,
                    amount: item.amount
                }));
            this.events.emit('order:goToDetails', items);
        });
    }

    updateBasket(items: Map<string, number>, api: AppApi) {
        const _items = Array.from(items);
		if (!_items.length) {
			setElementProperty(this.basketTotalPriceElement, 'textContent', '0 синапсов');
			this.makeOrderButton.disabled = true;
		} else this.makeOrderButton.disabled = false;

        let currentIndex = 1;
		this.basketTotalPriceValue = 0;

        this.renderedItemsId = this.renderedItemsId.filter(id => items.has(id));
        this.basketList.innerHTML = '';

        _items.forEach(([id, amount]) => {
            if (this.itemsDataCache.has(id)) {
                const productData = this.itemsDataCache.get(id);
                this.createBasketItem({ ...productData, amount }, currentIndex, amount);
                currentIndex ++;
            } else {
                api.getProductData(id).then(productData => {
                    this.itemsDataCache.set(id, { ...productData, amount });
                    this.createBasketItem({ ...productData, amount }, currentIndex, amount);
                    currentIndex ++;
                });
            }
        });
    }

    private createBasketItem(productData: ICardItem, index: number, amount: number) {
        this.itemsDataCache.set(productData.id, { ...productData, amount });
        const basketItem = new BasketItem(cloneTemplate(basketItemTemplate), this.events);
        basketItem.render({ ...productData, index, amount });
        this.basketList.appendChild(basketItem.getElement());
        this.renderedItemsId.push(productData.id);
        
        if (productData.price) {
            this.basketTotalPriceValue += productData.price * amount;
			setElementProperty(this.basketTotalPriceElement, 'textContent', `${this.basketTotalPriceValue} синапсов`)
        }
    }

    set items(items: ICardItem[]) {
        this.itemsInBasket = items;
    }
}