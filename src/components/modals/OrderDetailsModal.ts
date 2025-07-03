import { FormModal } from "../common/FormModal";
import { IOrderDetails, PaymentMethod } from "../../types";
import { IEvents } from "../base/events";
import { getValueOfInputByName } from "../../utils/utils";

export class OrderDetailsModal extends FormModal<IOrderDetails> {
    private orderDetailsData: IOrderDetails;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.validators = {
            address: {
                validate: (value) => value.length >= 5,
                errorMessage: 'Адрес должен содержать минимум 5 символов',
            }
        };

        this.orderDetailsData = {
            paymentMethod: undefined,
            address: ''
        }

        this.onSubmitFunction = () => {
            this.handleOrderDetails();

            this.events.emit('order:add:orderDetails', this.orderDetailsData);
            this.events.emit('contactsModal:opened');

            this.resetData();
        };
    }

    private handleOrderDetails = () => {
        this.orderDetailsData.address = getValueOfInputByName(this.inputFormElements, 'address');

        this.orderDetailsData.paymentMethod = this.selectedFormButton.textContent as PaymentMethod 
    }

    protected resetData = () => {
        super.resetData();
        this.orderDetailsData = {
            paymentMethod: undefined,
            address: ''
        }
    }
}