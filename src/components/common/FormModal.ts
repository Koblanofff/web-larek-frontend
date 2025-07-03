import { Modal } from "./Modal";
import { IEvents } from "../base/events";
import { setElementProperty } from "../../utils/utils";

type Validator = (value: string) => boolean;

export abstract class FormModal<T> extends Modal<T> {
    protected inputFormElements: NodeListOf<HTMLInputElement>;
    protected buttonFormElements: NodeListOf<HTMLButtonElement>;
    protected selectedFormButton: HTMLButtonElement | null = null;
    protected formErrorsField: HTMLSpanElement;
    protected submitButtonElement: HTMLButtonElement;
    protected onSubmitFunction: () => void;

    protected events: IEvents;

    protected validators: Record<string, {
        validate: Validator,
        errorMessage: string
    }> = {};

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container, events);
        this.events = events;

        this.inputFormElements = container.querySelectorAll('.form__input');
        this.buttonFormElements = container.querySelectorAll('.button_alt');
        this.formErrorsField = container.querySelector('.form__errors');
        this.submitButtonElement = container.querySelector('.button[type="submit"]');

        this.inputFormElements.forEach((input) => {
            input.addEventListener('input', () => this.validateForm());
        });

        container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.onSubmitFunction()
        });

        if (this.buttonFormElements.length !== 0) {
            this.handleButtonStates();
        }    
    }

    protected handleButtonStates = () => {
        if (!this.selectedFormButton) this.submitButton = false;

        this.buttonFormElements.forEach(button => {
            button.addEventListener('click', () => {
                if (button === this.selectedFormButton) return;

                if (this.selectedFormButton) {
                    this.selectedFormButton.classList.add('button_alt');
                }

                button.classList.remove('button_alt');
                this.selectedFormButton = button;

                this.validateForm();
            })
        })
    }

    protected validateForm = () => {
        let isValid = true;
        this.error = '';

        this.inputFormElements.forEach(input => {
            const value = input.value.trim();
            const validator = this.validators[input.name];

            if (!validator) {
                input.setCustomValidity('');
                return;
            }

            if (!validator.validate(value)) {
                input.setCustomValidity(validator.errorMessage);
                if (isValid) {
                    this.error = validator.errorMessage;
                    isValid = false;
                }
            } else {
                input.setCustomValidity('');
            }
        });

        if (this.buttonFormElements.length !==0) {
            this.submitButton = isValid && (this.selectedFormButton !== null);
            return;
        }

        this.submitButton = isValid;
    }

    protected resetData () {
        this.inputFormElements.forEach(input => {
            input.value = '';
        })

        this.selectedFormButton = null;
        this.buttonFormElements.forEach(button => {
            if (!button.classList.contains('button_alt')) button.classList.add('button_alt')
        })

        this.submitButton = false;
    }

    set error(errorText: string) {
        setElementProperty(this.formErrorsField, 'textContent', errorText);
    }

    set submitButton(formIsOk: boolean) {
        this.submitButtonElement.disabled = !formIsOk
    }
}