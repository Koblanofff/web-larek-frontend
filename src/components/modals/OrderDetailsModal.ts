import { Modal } from "../common/Modal";
import { ICard, IOrderDetails } from "../../types";
import { IEvents } from "../base/events";
import { isEmptyValidation, setElementProperty } from "../../utils/utils";

export class OrderDetailsModal extends Modal<IOrderDetails> {
    protected events: IEvents;
    protected addressInput: HTMLInputElement;
    protected paymentMethodButtons: NodeListOf<HTMLButtonElement>;
    protected currentlySelectedButton: HTMLButtonElement | null = null;
    protected orderButton: HTMLButtonElement;
    protected errorFields: HTMLSpanElement;
    protected items: ICard[];

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container, events);
        this.events = events;

        this.orderButton = container.querySelector('.order__button');
        this.addressInput = container.querySelector('.form__input');
        this.errorFields = container.querySelector('.form__errors');
        this.paymentMethodButtons = container.querySelectorAll('.button_alt');

        this.showEmptyFieldError();

        this.events.on('order:goToDetails', (data: Array<ICard & { amount: number }>) => {
            this.paymentButtonsStates();
            this.items = data;
        });

        this.addressInput.addEventListener('input', () => {
            if (isEmptyValidation(this.addressInput)) {
                this.showEmptyFieldError();
                this.toggleButtonState();
            } else {
                this.errorFields.textContent = '';
                this.toggleButtonState();
            }
        })

        if (!this.errorFields && this.currentlySelectedButton) {
            this.orderButton.disabled = false;
        }

        this.orderButton.addEventListener('click', (e) => {
            e.preventDefault();
            const orderData = {
                paymentMethod: this.getData().paymentMethod,
                address: this.addressInput.value,
                items: this.items
            };
            this.events.emit('order:goToContacts', { order: orderData });
        });
    }

    private paymentButtonsStates() {
        this.paymentMethodButtons.forEach((button) => {
            button.addEventListener('click', () => {
                if (this.currentlySelectedButton) {
                    this.currentlySelectedButton.classList.add('button_alt');
                    this.toggleButtonState();
                }

                button.classList.remove('button_alt');
                this.currentlySelectedButton = button;

                this.setData({
                    ...this.getData(),
                    paymentMethod: button.getAttribute('name') as 'card' | 'cash'
                })
            });
        });
    }

    private toggleButtonState() {
        if(!isEmptyValidation(this.addressInput) && this.currentlySelectedButton) this.orderButton.disabled = false;
        else this.orderButton.disabled = true;
    }

    private showEmptyFieldError() {
        setElementProperty(this.errorFields, 'textContent', 'Поле ввода не может быть пустым.');
    }
}