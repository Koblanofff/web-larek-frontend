import { Api } from './components/base/api';
import { CardsContainer } from './components/CardsContainer';
import './scss/styles.scss';
import { IApi, ICard } from './types';
import { API_URL, settings } from './utils/constants';
import { AppApi } from './components/AppApi';
import { CardsData } from './components/CardsData';
import { EventEmitter } from './components/base/events';
import { Card } from './components/Card';
import { cloneTemplate } from './utils/utils';
import { BasketModal } from './components/modals/BasketModal';
import { Basket } from './components/Basket';
import { CardModal } from './components/modals/CardModal';
import { OrderDetailsModal } from './components/modals/OrderDetailsModal';
import { ContactsModal } from './components/modals/ContactsModal';
import { ICustomerData } from './types';

const events = new EventEmitter();

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

const cardsData = new CardsData(events);
const basket = new Basket(events);

const cardTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const cardModalTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
const basketModalTemplate: HTMLTemplateElement = document.querySelector('#basket');
const OrderDetailsModalTemplate: HTMLTemplateElement = document.querySelector('#order');
const contactsModalTemplate: HTMLTemplateElement = document.querySelector('#contacts');

const cardsContainer = new CardsContainer(document.querySelector('.gallery'));

const cardModal = new CardModal(cloneTemplate(cardModalTemplate), events);
const basketModal = new BasketModal(cloneTemplate(basketModalTemplate), events);
const orderDetailsModal = new OrderDetailsModal(cloneTemplate(OrderDetailsModalTemplate), events);
const contactsModal = new ContactsModal(cloneTemplate(contactsModalTemplate), events);

api.getProducts()
    .then((cardResData) => {
        cardsData.cards = cardResData;
        events.emit('initialData:loaded');
    })
    .catch((err) => {
        console.error('Ошибка загрузки карточек:', err);
    });

events.on('initialData:loaded', () => {
    const cardsArray = cardsData.cards.map((card: ICard) => {
        const cardInstant = new Card(cloneTemplate(cardTemplate), events);
        return cardInstant.render(card);
    });

    cardsContainer.render({ catalog: cardsArray });
});

events.on('cardModal:opened', (data: { card: ICard }) => {
    cardModal.open(data.card);
});

events.on('basketModal:opened', () => {
    basketModal.open();
    basketModal.updateBasket(basket.items, api);
})

events.on('product:addToBasket', (idObject) => {
    const idValue = Object.values(idObject)[0];
    api.getProductData(idValue)
        .then((productData) => {
            basket.add(productData.id);
        })
})

events.on('product:deleteFromBasket', (idObject) => {
    const idValue = Object.values(idObject)[0];
    basket.remove(idValue);
    basketModal.updateBasket(basket.items, api);
});

events.on('order:goToDetails', () => {
    orderDetailsModal.open()
})

events.on('order:goToContacts', () => {
    contactsModal.open();
})

events.on('order:submit', (orderData: ICustomerData) => {
    console.log('Полные данные заказа:', orderData);
    contactsModal.close();
    basket.clear();
});