import { ICard, ICardsData } from "../types/index";
import { IEvents } from "./base/events";

export class CardsData implements ICardsData {
    protected _cards: ICard[];
    protected _preview: string | null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    set cards(cards: ICard[]) {
        this._cards = cards;
    }

    get cards() {
        return this._cards;
    }

    set preview(cardId: string | null) {
        if (!cardId) {
            this._preview = null;
            return;
        }
        this.events.emit('card:selected')
    }
}