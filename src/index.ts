import { Api } from './components/base/api';
import { CardsContainer } from './components/CardsContainer';
import './scss/styles.scss';
import { IApi, ICard, ICustomerData, IOrderDetails, Order} from './types';
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

const events = new EventEmitter();

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

const cardsData = new CardsData(events);
export const basket = new Basket(events);

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

const order = new Order(); 

api.getProducts()
    .then((cardResData) => {
        cardsData.cards = cardResData;
        events.emit('initialData:loaded');
    })
    .catch((err) => {
        console.error(`Ошибка загрузки карточек: ${err}`);
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
})

events.on('product:addToBasket', (idObject) => {
    const idValue = Object.values(idObject)[0];
    basket.add(idValue);
})

events.on('product:deleteFromBasket', (idObject) => {
    const idValue = Object.values(idObject)[0];
    basket.remove(idValue);
});

events.on('product:getData:request', (id) => {
    const idValue = Object.values(id)[0];
    api.getProductData(idValue)
        .then(res => events.emit('product:getData:response', res))
        .catch(err => console.log(`Ошибка при загрузке данных товара: ${err}`))
})

events.on('basket:changed', () => {
    basketModal.items = basket.items
})

events.on('orderDetailsModal:opened', () => {
    orderDetailsModal.open()
})

events.on('contactsModal:opened', () => {
    contactsModal.open();
})

events.on('order:add:products', (data: Map<string, number>) => {
    order.items = new Map(data);
})

events.on('order:add:orderDetails', (data: IOrderDetails) => {
    order.orderDetails = data;
})

events.on('order:add:contactsDetails', (data: ICustomerData) => {
    order.customerData = data;
})

events.on('order:finish', () => {
    console.log(order)
    orderDetailsModal.close();
    basket.clear();
    basketModal.clearBasket();
})