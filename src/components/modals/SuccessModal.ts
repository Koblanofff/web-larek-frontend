import { Modal } from "../common/Modal";
import { IEvents } from "../base/events";
import { setElementProperty } from "../../utils/utils";

export class SuccessModal extends Modal<number> {
    private totalPriceElement: HTMLParagraphElement;
    private returnButtonElement: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.events = events;

        this.totalPriceElement = container.querySelector('.order-success__description');
        this.returnButtonElement = container.querySelector('.order-success__close');

        this.events.on('successModal:opened', () => {
            this.returnButtonElement.addEventListener('click', () => {
                this.events.emit('modal:closed');
            })

            this.events.emit('order:finish')
        })
    }

    set totalPrice(value: number) {
        setElementProperty(this.totalPriceElement, 'textContent', `Списано ${value} синапсов`)
    }
}