import { setElementProperty } from "../utils/utils";
import { IEvents } from "./base/events";
import { BasketModel } from "./BasketModel";

export class Basket extends BasketModel {
    protected openBasketButton: HTMLElement;
    protected itemsInBasketAmount: HTMLElement;
    protected currentAmount = 0;

    events: IEvents;

    constructor(events: IEvents) {
        super(events);

        this.openBasketButton = document.querySelector('.header__basket');
        this.itemsInBasketAmount = this.openBasketButton.querySelector('.header__basket-counter');

        this.openBasketButton.addEventListener('click', () => {
            this.events.emit('basketModal:opened');
        });
        
        this.events.on('product:addToBasket', () => {
            setElementProperty(this.itemsInBasketAmount, 'textContent', `${++this.currentAmount}`);
        });

        this.events.on('product:deleteFromBasket', () => {
            setElementProperty(this.itemsInBasketAmount, 'textContent', `${--this.currentAmount}`);
        });
    }

    clear(): void {
        setElementProperty(this.itemsInBasketAmount, 'textContent', `0`);
        this.items.clear();
    }
}