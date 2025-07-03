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

export interface IBasketModel {
    items: Map<string, number>;
    add(id: string): void;
    remove(id: string): void;
}
export type Validator = (value: string) => boolean;

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

export type PaymentMethod = 'card' | 'cash' | undefined;

export interface IOrderDetails {
    paymentMethod: PaymentMethod;
    address: string;
}

export interface ICustomerData {
    email: string;
    phone: string;
}

export class Order {
    items: Map<string, number>;
    orderDetails: IOrderDetails;
    customerData: ICustomerData;
}