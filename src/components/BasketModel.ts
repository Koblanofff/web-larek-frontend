import { IBasketModel } from "../types";
import { IEvents } from "./base/events";

export class BasketModel implements IBasketModel {
    items: Map<string, number> = new Map();
    events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    add(id: string) {
        if (!this.items.has(id)) this.items.set(id, 0);
        this.items.set(id, this.items.get(id) + 1);
        this.events.emit('basket:changed');
    }

    remove(id: string) {
        if (!this.items.has(id)) return;
        if (this.items.get(id) > 0) {
            this.items.set(id, this.items.get(id) - 1);
            if (this.items.get(id) === 0) this.items.delete(id);
            this.events.emit('basket:changed');
        }
    }

    clear() {
        this.items.clear();
    }
}