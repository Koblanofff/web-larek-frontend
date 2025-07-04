import { FormModal } from '../common/FormModal';
import { ICustomerData } from "../../types";
import { IEvents } from '../base/events';
import { validateEmail, validatePhone, getValueOfInputByName, getCleanPhoneNumber } from '../../utils/utils';

export class ContactsModal extends FormModal<ICustomerData> {
    private contactsDetailsData: ICustomerData;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.validators = {
            email: {
                validate: () => validateEmail(getValueOfInputByName(this.inputFormElements, 'email')),
                errorMessage: 'Некоректный адресс'
            },
            phone: {
                validate: () => validatePhone(getValueOfInputByName(this.inputFormElements, 'phone')),
                errorMessage: 'Неккоректный номер телефона'
            }
        }

        this.contactsDetailsData = {
            email: '',
            phone: ''
        }

        this.onSubmitFunction = () => {
            this.handleContactsDetains();

            this.events.emit('order:add:contactsDetails', this.contactsDetailsData);
            this.events.emit('successModal:opened');

            this.resetData();
        }
    }

    private handleContactsDetains = () => {
        this.contactsDetailsData.email = getValueOfInputByName(this.inputFormElements, 'email');
        
        this.contactsDetailsData.phone = getCleanPhoneNumber(getValueOfInputByName(this.inputFormElements, 'phone'))
    }

    protected resetData = () => {
        super.resetData();
        this.contactsDetailsData = {
            email: '',
            phone: ''
        }
    }
}