import { IBasketModel } from "../types";
import { IEvents } from "./base/events";

export class BasketModel implements IBasketModel {
    private _items: Map<string, number> = new Map();
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    add(id: string) {
        if (!this._items.has(id)) this._items.set(id, 0);
        this._items.set(id, this._items.get(id) + 1);
        this.events.emit('basket:changed', this._items);
    }

    remove(id: string) {
        if (!this._items.has(id)) return;
        if (this._items.get(id) > 0) {
            this._items.set(id, this._items.get(id) - 1);
            this.events.emit('basket:changed');
        }
    }

    clear() {
        this._items.clear();
    }

    set items(value: Map<string, number>) {
        this._items = value;
    }

    get items() {
        return this._items
    }
}