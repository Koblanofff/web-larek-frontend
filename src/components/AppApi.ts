import { ICard, IApi, ICardsResponse } from '../types/index'

export class AppApi {
    private _baseApi: IApi;

    constructor(baseApi: IApi) {
        this._baseApi = baseApi;
    }

	getProducts(): Promise<ICard[]> {
		return this._baseApi
            .get<ICardsResponse>(`/product`)
            .then((res) => res.items);
	}

    getProductData(id: string): Promise<ICard> {
        return this._baseApi
            .get<ICard>(`/product/${id}`)
            .then((res) => res)
    }
}   