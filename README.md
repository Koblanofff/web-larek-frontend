# Проектная работа "Веб-ларек"

Прототип интернет-магазина Web-ларёк, в котором можно посмотреть товары, добавить товары в корзину и сделать заказ.

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
Деплой Production-сборки проекта

```
npm run deploy
```

## Архитектура приложения

Архитектура следует модели MVP и разделена на три основных слоя, соединённых брокером событий:
- Model - хранит состояние, инкапсулирует логику
- View - отрисовывает UI, реагирует на события пользователя
- Presenter - модифицирует данные, триггерит обновления 

### Баззовые классы

#### Класс EventEmitter
Универсальный брокер событий, который дает возможность подписывать на события.\
Основные методы, реализуемые классов описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `off` - отписка от события
- `emit` - инициализация события

#### Класс Api
Базовый класс для выполнения HTTP-запросов к API, реализующий интерфейс IApi. Предоставляет методы для GET и POST-запросов с обработкой ответов.

`constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов(опционально).

#### Класс Component
Класс является дженериком и родителем всех компонентов слоя представления. В дженерик принимает тип объекта, в котором данные будут передаваться в метод `render` для отображения данных в компоненте. \
Метод `render`, отвечающий за сохранение полученных в параметре данных в полях компонентов через их сеттеры, возвращает обновленный контейнер компонента.

`constructor(protected readonly container: HTMLElement)` - принимает DOM-элемент, для дальнейшего рендера компонента.

### Слой данных

#### Класс CardsData
Класс отвечает за хранение данных карточек товаров, представленных в каталоге товаров. \

В полях класса хранятся следующие данные:
- `_cards: ICard[]` - массив объектов карточек
- `_preview: string | null` - id карточки, выбоанной для просмотра в модальном окне
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

`constructor(events: IEvents)` - принимает инстант брокера событий.

Также класс предоставляет набор геттеров и сеттеров для сохранения и получения данных из полей класса

#### Класс BasketModel
Класс отвечает за хранение данных товаров, добавленных в корзину.

В полях класса хранятся следующие данные:
- `items: Map<string, number> = new Map()` - объект, хранящий пары ключей и значений: id товара и количество данного товара, добавленного в корзину.
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

`constructor(events: IEvents)` - принимает инстант брокера событий.

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Card
Класс предназначен для отображения карточки, а именно для отображения наименования товара, описания, изображения товара, категории и цены.

Поля класса:
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий.
- `cardId: string` - айди конкретного товара;
- `cardTitle: HTMLElement` - элемент разметки отображающий наименование товара;
- `cardDescription: HTMLElement` - элемент разметки отображающий описание товара;
- `cardImage: HTMLImageElement` - элемент разметки отображающий изображение товара;
- `cardCategory: HTMLElement` - элемент разметки отображающий категорию товара;
- `cardPrice: HTMLElement` - элемент разметки отображающий цену товара;
- `cardData: ICard` - объект содержащий данные товара;

`constructor(protected container: HTMLElement, events: IEvents)` - принимает DOM-элемент для дальнейшего отображения при рендере компонента и инстант брокера событий. 

Методы класса:
- `render` - принимает в качестве сигнатуры данные товара для отображения. Метод предотвращает отприсовку карточки товара, если данные не определены и вызывает все необходимые сеттеры для установки значений для соответсвующих элементов разметки.

#### Класс CardsContainer
Класс предназначен для отрисовки контейнера для всех карточек товара.

Поле `catalog: HTMLElement[]` - содержит массив всех элементов разметки карточек товаров для отображения в каталоге.
Сеттер класса устанавливает для поля catalog элементы, передаваемые в качестве сигнатуры.

`constructor(protected container: HTMLElement)` - принимает DOM-элемент для дальнейшего отображения при рендере компонента.

#### Класс BasketItem
Класс отображает данные одного товара, находящегося в корзине.

Поля класса:
- `itemIndex: HTMLSpanElement` - index товара (позиция товара в списке, начиная с единицы).
- `itemTitle: HTMLSpanElement` - элемент разметки, содержащий название товара;
- `itemPrice: HTMLSpanElement` - элемент разметки, содержащий цену товара;
- `deleteItemButton: HTMLButtonElement` - кнока, по клику на которую количество товара, к которму привязана кнопка уменьшается на 1, если количество становится 0, то такой товар убирается из корзины и не отображается в соответсвующем модальном окне;
В конструкторе при нажатии на кнопку удаления товара устанавливается событие `product:deleteFromBasket`, удаляющее единицу товара из корзины.

`constructor(container: HTMLElement, events: IEvents)` - принимает DOM-элемент для дальнейшего отображения при рендере компонента и инстант брокера событий.

Класс содержит все необходимые сеттеры для установления значений для всех соответсвующих элементов разметки и метод render, который принимает данные товара, включая index и количество определенного товара в корзине.\
Метод `render` предовтращает рендер пустого объекта, отрисовывает index для каждого товара, обновляет количество добавленного товара, либо устанавливает в качестве значения для количетсва 1, если товар был добавлен в корзину впервые.


#### Класс Modal
Класс реализует модальное окно, принимая в конструкторе темплейт окна, которое нужно открыть, и инстант брокера событий. Содержит методы `open` и `close` для управления отображением модального окна. Устанавливает слущатели событий для закрытия модального окна по клику на соответсвующую кнопку и по клику вне модального окна.

`constructor(protected container: HTMLElement, events: IEvents)` - принимает DOM-элемент для дальнейшего отображения при рендере компонента и инстант брокера событий.

Поля класса:
- `rootElement: HTMLElement` - корневой элемент модального окна, который является контейнером для других модальных окон.
- `contentElement: HTMLElement` - элемнт контента модального окна, который изменяется в зависимости от темплейта, передаваемого в конструкторе.
- `closeButton: HTMLButtonElement` - элемент кнопки, для закрытия модального окна.
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.
- `data?: T` - данные которые используются для отображения.

#### Класс FormModal
Класс расширяет класс `Modal` и предназначен для модальных окон, содержащих форму, требующую валидацию. Метод `validateForm` предназначен для валидации формы, метод `resetData` отвечает за полный сброс данных формы. 

`constructor(protected container: HTMLElement, events: IEvents)` - принимает DOM-элемент для дальнейшего отображения при рендере компонента и инстант брокера событий.

Поля класса:
- `inputFormElements: NodeListOf<HTMLInputElement>` - содержит список всех полей воода в DOM-дереве, для которых требуется валидация.
- `buttonFormElements: NodeListOf<HTMLButtonElement>` - содержит список кнопок, отвечающих за определенные данные формы на выбор.
- `formErrorsField: HTMLSpanElement` - DOM-элемент, отвечающий за отображения сообщения ошибок при валидации формы.
- `submitButtonElement: HTMLButtonElement` - элемент кнопки, отвечающий за подтвержение формы и выполнения функции `onSubmitFunction`.
- `onSubmitFunction: () => void` - функция, выполняемая при клике на элемент `submitButtonElement` (Например: отправление данных, заполненных в полях и т.п.).
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.
- `validators: Record<string, {validate: Validator, errorMessage: string}> = {}` - объект, содержащий пары ключ-значение. Ключ - имена input-элемента, значение - объект, содержащий функию, проверяющую поле-ввода на валидность, и сообщение ошибки.

#### Класс CardModal
Класс расширяет класс `Modal`. Предназначен для реализации модального окна с просмотром карточки товара и возможности добавления его в корзину.

`constructor(container: HTMLElement, events: IEvents)` - принимает DOM-элемент для дальнейшего отображения при рендере компонента и инстант брокера событий.

Поля класса содержат HTML элементы для корректного отображения товара (загаловок, описание, изображение, категория, цена), id товара, кнопка для добавления в корзину.
- `modalTitle`, `modalDescription`, `modalImage`, `modalCategory`, `modalPrice` - элементы отображения данных товара
- `addToBasketButton` - кнопка для доавбления товара в корзину, при клике создается событие `product:addToBasket`, которое передает id товара для последующего отображения его в корзине
- `cardId` - id просматриваемого товара.\
Класс предоставляет набор сеттеров, котоыре устанавливает все необходимые значения для элементов отображения товара.

#### Класс BasketModal
Класс расширяет класс `Modal`. Предназначен для реализации модального окна с просмотром корзины и добавленных в ее товаров.

Поля класса:
- `events: IEvents` - экземпляр класса EventEmitter` для инициации событий при изменении данных.
- `basketList: HTMLUListElement` - элемент разметки, содержащий элементы добавленных товаров.
- `basketTotalPriceElement: HTMLSpanElement` - элемент разметки, отображающий общую сумму заказа.
- `makeOrderButton: HTMLButtonElement` - кнопка, создающая события `order:add:products`, добавляющее данные в объект `order`, и событие `orderDetailsModal:opened`, открывающее модальное окно с формой данных с дополнительной информацией по заказу.
- `lastItemIndex: number` - значение индекса последнего добавленного товара в корзину.
- `_items = new Map<string, number>()` - содержит данные о товарах в формате "айди товара - количество в корзине".
- `itemsInCache = new Map<string, ICardItem>()` - содержит данные о товарах, необходимые для отображения в корзине.

`constructor(protected container: HTMLElement, events: IEvents)` - принимает DOM-элемент для дальнейшего отображения при рендере компонента и инстант брокера событий.

Основные методы класса:
- `async getProductsData(): Promise<void>` - асинхронный метод, отвечающий за добавления данных в поле `itemsInCache`, путем эмита события `product:getData:request` и последующей обработкой события `product:getData:response`, добавляя информацию о товарах, которые были добавлены в корзину впервые. Если данные товара уже находятся в поле `itemsInCache`, то происходит только обновление его количества.
- `renderBasketItems` - асинхронный метод, отвечающий за рендер товаров, данные которых находятся в поле `itemsInCache`.
- `setTotalPrice` - метод, устанавилвающий общую стоимость товаров, находящихся в корзине.

#### Класс OrderDetailsModal
Класс расширяет класс `FormModal`. Предназначен для реализации модального окна с вводом данных заказа (*Способ оплаты*, *Адресс*).

Поля класса:
- `orderDetailsData: IOrderDetails` - объект, содержащий введеные в форму данные. 

`constructor(container: HTMLElement, events: IEvents)` - принимает DOM-элемент для дальнейшего отображения при рендере компонента и инстант брокера событий.\
Также в конструкторе устанавливаются значения для полей валидации формы родительного класса и функция, выполняющаяся при отправке формы.

#### Класс ContactsModal
Класс расширяет класс `FormModal`. Предназначен для реализации модального окна с вводном контакной информации пользователя (*email*, *номер телеформа*)

Поля класса:
- `contactsDetailsData: ICustomerData` - объект, содержащий введеные в форму данные.

`constructor(container: HTMLElement, events: IEvents)` - принимает DOM-элемент для дальнейшего отображения при рендере компонента и инстант брокера событий.\
Также в конструкторе устанавливаются значения для полей валидации формы родительного класса и функция, выполняющаяся при отправке формы.

#### Класс SuccessModal
Класс расширяет класс `Modal`. Предназначен для отоброжения сообщения об успешном оформлении заказа с отображением итоговой суммы заказа.

Поля класса:
- `totalPriceElement: HTMLParagraphElement` - DOM-элемент, содержащий итоговую сумму заказа.
- `returnButtonElement: HTMLButtonElement` - элемент кнопки, закрывающий модальное окно.

`constructor(container: HTMLElement, events: IEvents)` - принимает DOM-элемент для дальнейшего отображения при рендере компонента и инстант брокера событий.\

Для установления итоговой суммы в модальном окне используется сеттер.

### Слой коммуникации

#### Класс AppApi
Содержит в себе лоигку отправки запросов. В конструктор передается базовый адрес сервера.

Методы класса:
- `getProducts` - возвращает массив данных всех товаров.
- `getProductData` - принимает в качестве сигнатуры id товара и возращает его данные. 

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `card:selected` - изменение открываемой в модальном окне картинки карточки.
- `basket:changed` - изменени данных товаров, добавленных в корзину.
- `initialData:loaded` - загрузка карточек товаров в каталоге.

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `cardModal:opened` - событие, генерируемое при клике на карточку товара.
- `product:addToBasket` - событие, генерируемое при клике на кнопку добавления товара в корзину.
- `product:deleteFromBasket` - событие, генерируемое при клике на кнопку удаления товара из корзины.
- `product:getData:request` - событие, вызывающее метод `getProductData` объекта `api`.
- `product:getData:response` - событие, возвращающее данные при успешном запросе `api.getProductData`
- `basketModal:opened` - событие, генерируемое при клике на кнопку открытия корзины.
- `orderDetailsModal:opened` - событие, открывающее модальное окно с вводом дополнительной информации по заказу.
- `contactsModal:opened` - событие, открывающее модальное окно с вводом контакной информации пользователя.
- `successModal:opened` - событие, открывающее модальное окно с сообщением об успешном оформлении заказа.
- `modal:closed` - событие, генерируемое при закрытии любого модального окна, либо по кнопке, либо по клику вне модального окна.
- `order:add:products` - событие, отвечающее за добавление данных добавлленых в корзину товаров.
- `order:add:orderDetails` - событие, отвечающее за добавление дополнительной информации по заказу.
- `order:add:contactsDetails` - событие, отвечающее за добавление контакной информации пользователя.
- `order:finish` - событие, генерирумое после заполнения всех необходиммых данных заказа. 

## Основные типы и интерфесы
- Интерфейс карточки товара:
```
interface ICard {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number;
}

```
- Интерфейс данных всех товаров:
```
interface ICardsData {
    cards: ICard[];
    preview: string | null;
}
```

- Интерфейс модели корзины:
```
interface IBasketModel {
    items: Map<string, number>;
    add(id: string): void;
    remove(id: string): void;
}
```

- Тип функции-валидатора поля ввода:
```
type Validator = (value: string) => boolean;
```

- Интерфейс `API`:
```
interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
```

- Интерфейс данных товаров, для отображения:
```
interface ICardsResponse {
    total: number;
    items: ICard[];
}
```

- Интерфейс, расширяющий `ICard`, добавляя поле `amount`, отвечающее за количество определенного товара в корзине:
```
interface ICardItem extends ICard {
    amount: number;
}
```

- Тип, отвечающий за выбор способа оплаты:
```
type PaymentMethod = 'card' | 'cash' | undefined;
```

- Интерфейс дополнительных данных заказа:
```
interface IOrderDetails {
    paymentMethod: PaymentMethod;
    address: string;
}
```

- Интерфейс контактных данных пользователя:
```
interface ICustomerData {
    email: string;
    phone: string;
}
```

- Класс, содержащий всю информацию по заказу:
```
class Order {
    items: Map<string, number>;
    orderDetails: IOrderDetails;
    customerData: ICustomerData;
}
```

## Ссылка на репозиторий
https://github.com/Koblanofff/web-larek-frontend

## Ссылка на gh-pages проект
https://koblanofff.github.io/web-larek-frontend/