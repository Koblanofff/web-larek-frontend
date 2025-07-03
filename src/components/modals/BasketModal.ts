import { IBasketModel, ICard, ICardItem } from "../../types";
import { IEvents } from "../base/events";
import { Modal } from "../common/Modal";
import { BasketItem } from "../BasketItem";
import { cloneTemplate, setElementProperty } from "../../utils/utils";

const basketItemTemplate: HTMLTemplateElement = document.querySelector('#card-basket');

export class BasketModal extends Modal<IBasketModel> {
    protected events: IEvents;
    protected basketList: HTMLUListElement;
    protected basketTotalPriceElement: HTMLSpanElement;
	protected makeOrderButton: HTMLButtonElement;
    protected lastItemIndex: number;
    protected _items = new Map<string, number>();
    private itemsInCache = new Map<string, ICardItem>();

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container, events);
        this.events = events;

        this.basketList = container.querySelector('.basket__list');
        this.basketTotalPriceElement = container.querySelector('.basket__price');
		this.makeOrderButton = container.querySelector('.basket__button');

        this.lastItemIndex = 0;

        this.makeOrderButton.addEventListener('click', () => {
            this.events.emit('order:add:products', this.items);
            this.events.emit('orderDetailsModal:opened');
        })

        this.events.on('basketModal:opened',this.handleBasketModalOpened);

        this.events.on('modal:closed', this.destroy)
    }

    private handleBasketModalOpened = () => {
        this.renderBasketModal();
        this.events.on('basket:changed', this.handleBasketChanged);
    }

    private handleBasketChanged = async () => {
        await this.renderBasketModal();
    };

    private destroy = () => {
        this.events.off('basket:changed', this.handleBasketChanged);
    }

    private renderBasketModal = async () => {
        await this.renderBasketItems();
        this.setTotalPrice();
        this.handleMakeOrderButtonState();
    }

    private renderBasketItems = async () => {
        this.clearBasketContent();
        this.lastItemIndex = 0;

        try {
            await this.getProductsData();
        } catch (err) {
            console.log(`Ошибка при рендере карточек. ${err}`);
            return;
        }

        this.itemsInCache.forEach((value, key) => {
            const basketItem = new BasketItem(cloneTemplate(basketItemTemplate), this.events);
            this.lastItemIndex ++;
            basketItem.render({
                ...value,
                index: this.lastItemIndex
            });
            basketItem.getElement().dataset.itemId = key;
            this.basketList.appendChild(basketItem.getElement());

            if (!basketItem.amount) {
                this.removeBasketItem(key)
            }
        });
    }

    private setTotalPrice = () => {
        let totalPrice = 0;
        this.itemsInCache.forEach(item => {
            totalPrice += item.amount * item.price
        })

        this.price = totalPrice;
    }

    private removeBasketItem = (id: string) => {
        const basketItem = this.basketList.querySelector(`[data-item-id="${id}"]`)

        if (basketItem) {
            basketItem.remove();
            this.itemsInCache.delete(id);
            this._items.delete(id);
        }
    }

    private getProductsData = async (): Promise<void> => {
        const promises: Promise<void>[] = [];

        this.items.forEach((amount, id) => {
            if (!this.itemsInCache.has(id)) {
                const promise = new Promise<void>((res) => {
                    const handler = (data: ICard) => {
                        if (data.id === id) {
                            this.itemsInCache.set(id, { ...data, amount });
                            this.events.off('product:getData:response', handler);
                            res();
                        }
                    };

                    this.events.on('product:getData:response', handler);
                });

                promises.push(promise);

                this.events.emit('product:getData:request', { data: id });
            } else {
                const cachedItem = this.itemsInCache.get(id);

                if (cachedItem) {
                    cachedItem.amount = amount;
                }
            }
        });

        await Promise.all(promises);
    }

    private handleMakeOrderButtonState = () => {
        if (this.items) {
            if (this.items.size === 0) {
                this.makeOrderButton.disabled = true;
                return
            }

            this.makeOrderButton.disabled = false;
        } else this.makeOrderButton.disabled = true;
    }

    public clearBasketContent = () => {
        this.basketList.innerHTML = '';
    }

    public clearBasket = () => {
        this.clearBasketContent();
        this.itemsInCache.clear();
        this.items.clear();
    }

    set items(value: Map<string, number>) {
        this._items = value
    }

    get items() {
        return this._items
    }

    set price(value: number) {
        setElementProperty(this.basketTotalPriceElement, 'textContent', `${value ? value : '0'} Синапсов`)
    }

    get price() {
        return Number(this.basketTotalPriceElement.textContent.split(' ')[0])
    }
}