import { Modal } from "../common/Modal";
import { ICustomerData } from "../../types";
import { IEvents } from "../base/events";
import { isEmptyValidation } from "../../utils/utils";
import { IOrderDetails } from "../../types";

export class ContactsModal extends Modal<ICustomerData> {
    protected events: IEvents;
    protected emailInput: HTMLInputElement;
    protected phoneNumberInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container, events)
        this.events = events;

        this.emailInput = container.querySelector('input[name="email"]');
        this.phoneNumberInput = container.querySelector('input[name="phone"]');
        this.submitButton = container.querySelector('button[type="submit"]');

        this.emailInput.addEventListener('input', () => this.validateForm());
        this.phoneNumberInput.addEventListener('input', () => this.validateForm());

        events.on('order:goToContacts', (data: { order: IOrderDetails, email: string, phone: string }) => {
            this.setData({
                order: data.order,
                email: data.email,
                phone: data.phone
            });
            this.validateForm();
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            const orderData: ICustomerData = {
                order: this.getData().order,
                email: this.emailInput.value,
                phone: this.phoneNumberInput.value
            };
            this.events.emit('order:submit', orderData);
        });
    }

    private validateForm(): void {
        const isEmailEmpty = isEmptyValidation(this.emailInput);
        const isPhoneValid = this.validatePhoneNumber();
        const emailInputValue = this.emailInput.value

        this.submitButton.disabled = isEmailEmpty || !isPhoneValid || !emailInputValue.includes('@') || !emailInputValue.includes('.');
    }

    private validatePhoneNumber(): boolean {
        const phoneNumber = this.phoneNumberInput.value.replace(/\D/g, '');
        return phoneNumber.length === 11;
    }
}