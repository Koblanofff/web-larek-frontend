import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export abstract class Modal<T> extends Component<T> {
    protected rootElement: HTMLElement;
    protected contentElement: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected events: IEvents;
    protected data?: T;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);

        this.rootElement = document.querySelector('#modal-container');
        this.contentElement = this.rootElement.querySelector('.modal__content');
        this.closeButton = this.rootElement.querySelector('.modal__close');
        this.events = events;

        this.closeButton.addEventListener('click', () => this.events.emit('modal:closed'));

        this.rootElement.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('modal')) this.events.emit('modal:closed');
        });

        this.events.on('modal:closed', () => this.close())
    }

    open(data?: T): void {
        this.render(data);
        this.contentElement.innerHTML = '';
        this.contentElement.appendChild(this.container);
        this.rootElement.classList.add('modal_active');
    }

    close(): void {
        this.rootElement.classList.remove('modal_active');
        this.contentElement.innerHTML = '';
    }

    getData(): T {
        return this.data;
    }

    setData(data: T) {
        this.data = data
    }
}