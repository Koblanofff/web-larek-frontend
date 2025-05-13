import { IEvents } from "./base/events";
import { Component } from "./base/Component";
import { ICard } from "../types";
import { CDN_URL } from "../utils/constants";
import { setElementProperty } from "../utils/utils";

export class Card extends Component<ICard> {
    protected events: IEvents;
    protected cardId: string;
    protected cardTitle: HTMLElement;
    protected cardDescription: HTMLElement;
    protected cardImage: HTMLImageElement;
    protected cardCategory: HTMLElement;
    protected cardPrice: HTMLElement;
    protected cardData: ICard;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.cardDescription = this.container.querySelector('.card__text');
        this.cardImage = this.container.querySelector('.card__image');
        this.cardTitle = this.container.querySelector('.card__title');
        this.cardCategory = this.container.querySelector('.card__category');
        this.cardPrice = this.container.querySelector('.card__price');

        container.addEventListener('click', () => {
            this.events.emit('cardModal:opened', { card: this.cardData });
        });
    }

    render(cardData: Partial<ICard>) {
        if (!cardData) return this.container;

        this.cardData = cardData as ICard;
        Object.assign(this, cardData);
        return super.render(cardData);
    }

    set title(title: string) {
        setElementProperty(this.cardTitle, 'textContent', title);
    }

    set description(description: string) {
        setElementProperty(this.cardDescription, 'textContent', description);
    }

    set image(image: string) {
        setElementProperty(this.cardImage, 'src', `${CDN_URL}${image}`);
        setElementProperty(this.cardImage, 'alt', this.title ? this.title : 'Изображение товара');
    }

    set category(category: string) {
        setElementProperty(this.cardCategory, 'textContent', category);
    }

    set price(price: number) {
        setElementProperty(this.cardPrice, 'textContent', price ? `${price} синапсов` : 'Бесценно');
    }

    set id(id: string) {
        this.cardId = id;
    }
}
