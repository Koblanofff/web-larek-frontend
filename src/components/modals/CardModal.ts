import { IEvents } from "../base/events";
import { ICard } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { Modal } from "../common/Modal";
import { setElementProperty } from "../../utils/utils";

export class CardModal extends Modal<ICard> {
    protected cardId: string;
    protected modalTitle: HTMLElement;
    protected modalDescription: HTMLElement;
    protected modalImage: HTMLImageElement;
    protected modalCategory: HTMLElement;
    protected modalPrice: HTMLElement;
    protected addToBasketButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.modalTitle = container.querySelector('.card__title');
        this.modalDescription = container.querySelector('.card__text');
        this.modalImage = container.querySelector('.card__image');
        this.modalCategory = container.querySelector('.card__category');
        this.modalPrice = container.querySelector('.card__price');
        this.addToBasketButton = container.querySelector('.card__button');

        this.addToBasketButton.addEventListener('click', () => {
			this.events.emit('product:addToBasket', {data: this.cardId });
        });
    }

    set title(value: string) {
        setElementProperty(this.modalTitle, 'textContent', value);
    }

    set description(value: string) {
        setElementProperty(this.modalDescription, 'textContent', value ?? 'Нет описания');
    }

    set image(value: string) {
        setElementProperty(this.modalImage, 'src', `${CDN_URL}${value}`);
    }

    set category(value: string) {
        setElementProperty(this.modalCategory, 'textContent', value);
    }

    set price(value: number) {
        setElementProperty(this.modalPrice, 'textContent', value ? `${value} синапсов` : "Бесценно");
    }

	set id(value: string) {
		this.cardId = value;
	}
}
