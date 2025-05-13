import { ApiPostMethods } from "../components/base/api";

export interface ICard {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number;
}

export interface ICardsData {
    cards: ICard[];
    preview: string | null;
}

export interface IModal {
    modalTitle: HTMLElement;
    modalDescription: HTMLElement;
    modalImage: HTMLImageElement;
    modalCategory: HTMLElement;
    modalPrice: HTMLElement;
}

export interface IBasketModel {
    items: Map<string, number>;
    add(id: string): void;
    remove(id: string): void;
}

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface ICardsResponse {
    total: number;
    items: ICard[];
}

export interface ICardItem extends ICard {
    amount: number;
}

export interface IOrderDetails {
    paymentMethod: 'card' | 'cash';
    address: string;
    items: ICardItem[];
}

export interface ICustomerData {
    order: IOrderDetails;
    email: string;
    phone: string;
}